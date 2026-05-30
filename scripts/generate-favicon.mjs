#!/usr/bin/env node
// Generates public/favicon.ico (32×32) and public/apple-touch-icon.png (180×180)
// Run: node scripts/generate-favicon.mjs

import { writeFileSync, mkdirSync } from "fs";
import { deflateSync } from "zlib";

// ── CRC32 ────────────────────────────────────────────────────
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// ── PNG helpers ───────────────────────────────────────────────
function u32be(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n);
  return b;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, "ascii");
  return Buffer.concat([u32be(data.length), t, data, u32be(crc32(Buffer.concat([t, data])))]);
}

function makePng(w, h, px) {
  // px: Uint8Array of RGBA per pixel
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA

  const rows = [];
  for (let y = 0; y < h; y++) {
    rows.push(0); // filter: None
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      rows.push(px[i], px[i + 1], px[i + 2], px[i + 3]);
    }
  }

  return Buffer.concat([
    sig,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(Buffer.from(rows), { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── Draw primitives ───────────────────────────────────────────
function setPixel(px, w, x, y, color) {
  if (x < 0 || x >= w || y < 0 || y >= w) return;
  const i = (y * w + x) * 4;
  px[i] = color[0]; px[i + 1] = color[1]; px[i + 2] = color[2]; px[i + 3] = color[3] ?? 255;
}

function fillRect(px, w, x0, y0, rw, rh, color) {
  for (let y = y0; y < y0 + rh; y++)
    for (let x = x0; x < x0 + rw; x++)
      setPixel(px, w, x, y, color);
}

// Rounded rectangle with per-pixel alpha (anti-aliased corners)
function fillRoundedRect(px, imgW, imgH, x0, y0, rw, rh, r, color) {
  for (let y = y0; y < y0 + rh; y++) {
    for (let x = x0; x < x0 + rw; x++) {
      const cx = Math.max(x0 + r, Math.min(x0 + rw - r - 1, x));
      const cy = Math.max(y0 + r, Math.min(y0 + rh - r - 1, y));
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist <= r + 0.5) {
        const alpha = dist > r - 0.5 ? Math.round(255 * (r + 0.5 - dist)) : 255;
        if (alpha > 0) setPixel(px, imgW, x, y, [...color.slice(0, 3), alpha]);
      }
    }
  }
}

// ── Colours ───────────────────────────────────────────────────
const BLUE  = [27, 79, 216, 255];  // #1B4FD8
const WHITE = [255, 255, 255, 255];
const TRANS = [0, 0, 0, 0];

// ── 32×32 favicon icon ────────────────────────────────────────
function makeIcon32() {
  const S = 32;
  const px = new Uint8Array(S * S * 4); // transparent

  // Blue rounded square (radius 6)
  fillRoundedRect(px, S, S, 0, 0, S, S, 6, BLUE);

  // White "L":
  //   Vertical bar  : x 9-12, y 6-23  (4 px wide, 18 px tall)
  //   Horizontal bar: x 9-22, y 20-23 (14 px wide, 4 px tall)
  fillRect(px, S, 9, 6,  4,  18, WHITE);  // vertical
  fillRect(px, S, 9, 20, 14,  4, WHITE);  // horizontal

  return px;
}

// ── 16×16 favicon icon (for ICO multi-size) ───────────────────
function makeIcon16() {
  const S = 16;
  const px = new Uint8Array(S * S * 4);

  fillRoundedRect(px, S, S, 0, 0, S, S, 3, BLUE);

  // Vertical: x 4-5, y 3-11  (2 px wide, 9 px tall)
  // Horizontal: x 4-10, y 10-11 (7 px wide, 2 px tall)
  fillRect(px, S, 4, 3, 2, 9, WHITE);
  fillRect(px, S, 4, 10, 7, 2, WHITE);

  return px;
}

// ── 180×180 apple touch icon ─────────────────────────────────
function makeIcon180() {
  const S = 180;
  const px = new Uint8Array(S * S * 4);

  // Solid blue (iOS adds its own rounded corners)
  fillRect(px, S, 0, 0, S, S, BLUE);

  // Bold white "L" — proportional to 32×32 design
  //   Vertical : x 48-70, y 34-136  (22 px wide, 102 px tall)
  //   Horizontal: x 48-128, y 114-136 (80 px wide, 22 px tall)
  fillRect(px, S, 48, 34,  22, 102, WHITE); // vertical
  fillRect(px, S, 48, 114, 80,  22, WHITE); // horizontal

  return px;
}

// ── Build ICO (16×16 + 32×32) ────────────────────────────────
function makeIco(images) {
  // images: [{ png, width, height }, ...]
  const count = images.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: ICO
  header.writeUInt16LE(count, 4);

  const dirs = images.map(({ png, width, height }) => {
    const dir = Buffer.alloc(16);
    dir[0] = width  === 256 ? 0 : width;
    dir[1] = height === 256 ? 0 : height;
    dir[2] = 0;  // color count (true-color)
    dir[3] = 0;  // reserved
    dir.writeUInt16LE(1,  4); // color planes
    dir.writeUInt16LE(32, 6); // bpp
    dir.writeUInt32LE(png.length, 8);
    dir.writeUInt32LE(offset, 12);
    offset += png.length;
    return dir;
  });

  return Buffer.concat([header, ...dirs, ...images.map((i) => i.png)]);
}

// ── Write files ───────────────────────────────────────────────
mkdirSync("public", { recursive: true });

const png16  = makePng(16,  16,  makeIcon16());
const png32  = makePng(32,  32,  makeIcon32());
const png180 = makePng(180, 180, makeIcon180());

const ico = makeIco([
  { png: png16,  width: 16,  height: 16  },
  { png: png32,  width: 32,  height: 32  },
]);

writeFileSync("public/favicon.ico",         ico);
writeFileSync("public/apple-touch-icon.png", png180);

console.log("✓ public/favicon.ico (16×16 + 32×32)");
console.log("✓ public/apple-touch-icon.png (180×180)");
