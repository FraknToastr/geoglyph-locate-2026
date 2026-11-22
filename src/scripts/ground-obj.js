import { Matrix3, Vector3 } from 'three';

// Serialize immutable triangle buffers without changing display/GPU resources.
// Yield between small batches so downloads do not monopolise the animation loop.
export async function createOBJ(mesh, transform, {
  name = 'GeoGlyph', isCurrent = () => true,
  yieldControl = () => new Promise(resolve => setTimeout(resolve, 0))
} = {}) {
  const { position, normal } = mesh || {};
  if (!position?.length || position.length % 9 || normal?.length !== position.length) throw Error('No valid triangle mesh to export');
  if (!transform?.elements?.every(Number.isFinite) || !Number.isFinite(transform.determinant()) || transform.determinant() === 0) throw Error('Invalid OBJ transform');
  const matrix = transform.clone(), normals = new Matrix3().getNormalMatrix(matrix);
  const reflected = matrix.determinant() < 0, point = new Vector3(), direction = new Vector3();
  const label = String(name).replace(/[^\p{L}\p{N}_-]+/gu, '_').slice(0, 100) || 'GeoGlyph';
  const parts = [`# GeoGlyph OBJ\n# Units: metres. X east, Y north, Z up. Origin: map anchor at ground level.\no ${label}\n`];
  const number = value => {
    if (!Number.isFinite(value)) throw Error('Mesh contains a non-finite coordinate or normal');
    return String(Number(value.toFixed(6)));
  };
  for (let start = 0; start < position.length; start += 9 * 256) {
    if (!isCurrent()) throw Error('The object changed before export. Retry with the desired object.');
    const lines = [], end = Math.min(position.length, start + 9 * 256);
    for (let at = start; at < end; at += 9) {
      for (let vertex = 0; vertex < 3; vertex++) {
        const offset = at + vertex * 3;
        if (![normal[offset], normal[offset + 1], normal[offset + 2]].every(Number.isFinite)) throw Error('Mesh contains an invalid normal');
        point.fromArray(position, offset).applyMatrix4(matrix);
        direction.fromArray(normal, offset).applyMatrix3(normals);
        if (!direction.lengthSq()) throw Error('Mesh contains an invalid normal');
        direction.normalize();
        lines.push(`v ${number(point.x)} ${number(point.y)} ${number(point.z)}\n`,
          `vn ${number(direction.x)} ${number(direction.y)} ${number(direction.z)}\n`);
      }
      const a = at / 3 + 1, b = a + (reflected ? 2 : 1), c = a + (reflected ? 1 : 2);
      lines.push(`f ${a}//${a} ${b}//${b} ${c}//${c}\n`);
    }
    parts.push(lines.join(''));
    await yieldControl();
  }
  if (!isCurrent()) throw Error('The object changed before export. Retry with the desired object.');
  return new Blob(parts, { type: 'text/plain;charset=utf-8' });
}
