import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ICO builder (PNG-in-ICO) for modern browsers (Vista+).
// Embeds PNG bytes directly; supports multiple sizes.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const pngs = [
  { size: 16, file: path.join(root, 'public', 'favicon-16x16.png') },
  { size: 32, file: path.join(root, 'public', 'favicon-32x32.png') },
];

const outFile = path.join(root, 'public', 'favicon.ico');

function u16le(n) {
  const b = Buffer.alloc(2);
  b.writeUInt16LE(n, 0);
  return b;
}
function u32le(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32LE(n, 0);
  return b;
}

const images = await Promise.all(
  pngs.map(async (p) => {
    const data = await fs.readFile(p.file);
    return { ...p, data };
  }),
);

// ICO header: reserved(0), type(1=icon), count
const header = Buffer.concat([u16le(0), u16le(1), u16le(images.length)]);

// Directory entries (16 bytes each)
let offset = header.length + images.length * 16;
const entries = [];
for (const img of images) {
  const w = img.size === 256 ? 0 : img.size;
  const h = img.size === 256 ? 0 : img.size;
  const entry = Buffer.concat([
    Buffer.from([w, h, 0, 0]), // width, height, colorCount, reserved
    u16le(1), // planes
    u16le(32), // bitcount
    u32le(img.data.length), // bytes in resource
    u32le(offset), // image offset
  ]);
  entries.push(entry);
  offset += img.data.length;
}

const ico = Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
await fs.writeFile(outFile, ico);

console.log(`OK: ${path.relative(root, outFile)} (${ico.length} bytes)`);
