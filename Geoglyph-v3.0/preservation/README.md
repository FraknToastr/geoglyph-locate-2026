# Preserved source workspaces

These manifests record SHA-256 checksums of the original Geoglyph v2 working files and Explorer Suite v2 reference files before the new launcher version was created. They include the working source as it existed on disk, including uncommitted changes. They describe the original workspaces, not the editable copies in this version.

Run the read-only verification from this version's directory:

```sh
rtk node scripts/verify-preservation.cjs
```

The verifier checks every recorded file in each manifest's absolute `source` directory, detects additional files, and reports counts and paths for changes, missing files, additions and read errors. It exits with status 0 only when both inventories match. It never writes to either original workspace.

Each manifest's `excluded` list applies to matching file or directory names at any depth. Git metadata, agent configuration, credentials, installed dependencies, caches, coverage, browser reports and the new `Geoglyph-v3.0` directory are excluded. An asterisk matches any characters; `.env*` excludes environment files. Historical audit and validation files present in the original source are checked even when they were intentionally omitted from the new app copy.

Keep these manifests unchanged as the preservation baseline. Builds and tests for this version must run against its copied project and write outputs inside this version or a temporary directory. If the original workspaces are deliberately changed later, verification will report those differences; that does not imply the new version caused them.
