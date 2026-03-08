import fs from "node:fs";
import path from "node:path";

export interface ImageDimensions {
  width: number;
  height: number;
}

const dimensionsCache = new Map<string, ImageDimensions | null>();

export function getPublicImageDimensions(src: string): ImageDimensions | null {
  if (!src.startsWith("/")) {
    return null;
  }

  const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));

  if (dimensionsCache.has(filePath)) {
    return dimensionsCache.get(filePath) ?? null;
  }

  if (!fs.existsSync(filePath)) {
    dimensionsCache.set(filePath, null);
    return null;
  }

  const buffer = fs.readFileSync(filePath);
  const extension = path.extname(filePath).toLowerCase();

  let dimensions: ImageDimensions | null = null;

  if (extension === ".png") {
    dimensions = readPngDimensions(buffer);
  } else if (extension === ".jpg" || extension === ".jpeg") {
    dimensions = readJpegDimensions(buffer);
  } else if (extension === ".gif") {
    dimensions = readGifDimensions(buffer);
  }

  dimensionsCache.set(filePath, dimensions);
  return dimensions;
}

function readPngDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 24) {
    return null;
  }

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

function readGifDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 10) {
    return null;
  }

  return {
    width: buffer.readUInt16LE(6),
    height: buffer.readUInt16LE(8),
  };
}

function readJpegDimensions(buffer: Buffer): ImageDimensions | null {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }

  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset++;
      continue;
    }

    const marker = buffer[offset + 1];

    if (!marker) {
      return null;
    }

    if (marker === 0xd9 || marker === 0xda) {
      break;
    }

    const blockLength = buffer.readUInt16BE(offset + 2);

    if (isStartOfFrame(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }

    offset += 2 + blockLength;
  }

  return null;
}

function isStartOfFrame(marker: number) {
  return [
    0xc0, 0xc1, 0xc2, 0xc3,
    0xc5, 0xc6, 0xc7,
    0xc9, 0xca, 0xcb,
    0xcd, 0xce, 0xcf,
  ].includes(marker);
}
