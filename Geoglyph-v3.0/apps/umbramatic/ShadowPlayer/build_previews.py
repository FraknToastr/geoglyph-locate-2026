#!/usr/bin/env python3
"""Build reusable half-resolution WebP tiles for a Shadow Player export."""

import argparse
import hashlib
import io
import json
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path, PurePosixPath

MANIFEST_NAME = "shadow_player_manifest.json"
PREVIEW_DIRECTORY = "shadow_player_previews"
PREVIEW_SCHEMA = "uos-shadow-player-previews-v1"


def write_atomic(path, data):
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as stream:
            temporary = Path(stream.name)
            stream.write(data)
        temporary.replace(path)
    finally:
        if temporary is not None:
            temporary.unlink(missing_ok=True)


def export_tiles(root, manifest):
    frames = manifest.get("frames")
    if manifest.get("schema") != "uos-shadow-player-v1" or not isinstance(frames, list) or not frames:
        raise ValueError("Choose a folder containing a valid Shadow Player manifest.")

    sources = {}
    for frame in frames:
        for tile in frame["tiles"]:
            if tile.get("direct_url"):
                continue
            name = tile["path"].replace("\\", "/")
            if name.startswith("./"):
                name = name[2:]
            relative = PurePosixPath(name)
            if relative.is_absolute() or ".." in relative.parts or ":" in name:
                raise ValueError(f"Expected a relative tile path: {name}")
            original = (root / relative).resolve(strict=True)
            if root not in original.parents or not original.is_file():
                raise ValueError(f"Tile must be a file inside the export: {name}")
            sources[name] = original
    return sources


def build_tile(original, directory, image_module):
    data = original.read_bytes()
    digest = hashlib.sha256(b"umbramatic-half-resolution-webp-v1\0")
    digest.update(data)
    target = directory / (digest.hexdigest() + ".webp")
    if target.is_file() and not target.is_symlink():
        try:
            with image_module.open(target) as previous:
                if previous.format == "WEBP":
                    previous.load()
                    return target.name
        except OSError:
            pass

    with image_module.open(io.BytesIO(data)) as native:
        size = ((native.width + 1) // 2, (native.height + 1) // 2)
        resampling = getattr(image_module, "Resampling", image_module)
        preview = native.convert("RGBA").resize(size, resampling.BOX)
        encoded = io.BytesIO()
        preview.save(
            encoded, format="WEBP", lossless=True, exact=True, method=3, quality=65,
            icc_profile=native.info.get("icc_profile"),
        )
    write_atomic(target, encoded.getvalue())
    return target.name


def build_previews(root, workers, image_module):
    manifest_path = root / MANIFEST_NAME
    manifest_bytes = manifest_path.read_bytes()
    manifest = json.loads(manifest_bytes)
    sources = export_tiles(root, manifest)
    if not sources:
        raise ValueError("The manifest has no local image tiles.")

    directory = root / PREVIEW_DIRECTORY
    if directory.is_symlink():
        raise ValueError(f"Use an ordinary directory for {PREVIEW_DIRECTORY}.")
    directory.mkdir(exist_ok=True)

    def prepare(original):
        try:
            return build_tile(original, directory, image_module)
        except OSError as error:
            raise ValueError(f"Cannot build a preview for {original.relative_to(root)}: {error}") from error

    with ThreadPoolExecutor(max_workers=workers) as pool:
        previews = dict(zip(sources.keys(), pool.map(prepare, sources.values())))
    if manifest_path.read_bytes() != manifest_bytes:
        raise ValueError("The export changed during preview generation. Run the command again.")

    index = {
        "schema": PREVIEW_SCHEMA,
        "export_generated_at_utc": manifest.get("generated_at_utc"),
        "tiles": previews,
    }
    write_atomic(directory / "index.json", json.dumps(index, separators=(",", ":")).encode("utf-8"))
    total_bytes = sum((directory / name).stat().st_size for name in set(previews.values()))
    return len(previews), total_bytes


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("export_folder", type=Path, help=f"Folder containing {MANIFEST_NAME}")
    parser.add_argument("--workers", type=int, default=4, help="Number of concurrent tile conversions")
    args = parser.parse_args()
    if args.workers < 1:
        parser.error("--workers must be at least 1")
    try:
        from PIL import Image, features
    except ImportError:
        parser.exit(1, "Install Pillow with python -m pip install Pillow to generate WebP previews.\n")
    if not features.check("webp"):
        parser.exit(1, "This Pillow build needs WebP support to generate playback previews.\n")
    try:
        count, size = build_previews(args.export_folder.resolve(strict=True), args.workers, Image)
    except (OSError, ValueError, AttributeError, TypeError, KeyError) as error:
        parser.exit(1, f"Preview generation failed: {error}\n")
    print(f"Ready to play {count:,} preview tiles ({size / 1048576:.1f} MiB) from {PREVIEW_DIRECTORY}/.")


if __name__ == "__main__":
    main()
