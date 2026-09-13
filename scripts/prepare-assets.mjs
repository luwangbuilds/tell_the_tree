// Optional format-only optimization. Uses sharp from a supplied tool runtime.
import { createRequire } from 'node:module';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const files = process.argv.slice(2);
if (files.length !== 3) throw new Error('Pass source PNGs in order: tree, opening, breathing.');
await mkdir(new URL('../public/assets/', import.meta.url), { recursive: true });
await Promise.all(files.map((file, i) => sharp(file).webp({ quality: 90 }).toFile(new URL(`../public/assets/${['tree', 'opening', 'breathing'][i]}.webp`, import.meta.url).pathname)));
