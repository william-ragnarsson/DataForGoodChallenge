/**
 * Hero background texture.
 *
 * A fine hairline grid with a few violet blobs sitting on it. Each blob is a
 * cluster of individual grid cells rather than a soft gradient, so the shape
 * stays quantised to the grid and reads as "cells lighting up" instead of a
 * glow pasted on top.
 *
 * Cell positions are emitted as `calc(var(--cell) * n)` so the whole field
 * rescales from one custom property at the breakpoint.
 */

type Blob = {
  /** Top-left corner of the cluster, in grid cells. */
  x: number;
  y: number;
  /** Cluster size, in cells. */
  w: number;
  h: number;
  seed: number;
  /** Overall strength, so some blobs sit further back than others. */
  strength: number;
  delay: number;
};

// Kept clear of the centre column where the headline sits, so the type never
// has to compete with a bright cluster directly behind it.
const BLOBS: Blob[] = [
  { x: 8, y: 24, w: 13, h: 9, seed: 1, strength: 1, delay: 0 },
  { x: 32, y: 7, w: 10, h: 7, seed: 2, strength: 0.7, delay: 2.4 },
  { x: 99, y: 28, w: 14, h: 10, seed: 3, strength: 0.95, delay: 4.8 },
  { x: 122, y: 10, w: 9, h: 7, seed: 4, strength: 0.65, delay: 1.2 },
  { x: 56, y: 51, w: 13, h: 8, seed: 5, strength: 0.8, delay: 3.6 },
];

/** Deterministic value in [0, 1) — avoids the field reshuffling on every render. */
function noise(x: number, y: number, seed: number) {
  const v = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return v - Math.floor(v);
}

function cellsFor(blob: Blob) {
  const cells: { x: number; y: number; o: number }[] = [];
  const cx = (blob.w - 1) / 2;
  const cy = (blob.h - 1) / 2;

  for (let y = 0; y < blob.h; y++) {
    for (let x = 0; x < blob.w; x++) {
      const nx = (x - cx) / (blob.w / 2);
      const ny = (y - cy) / (blob.h / 2);
      const dist = Math.sqrt(nx * nx + ny * ny);
      if (dist > 1) continue;

      // Falloff from the centre, roughened so the edge is ragged rather than
      // a clean ellipse.
      const n = noise(x, y, blob.seed);
      const o = (1 - dist) * (0.45 + 0.55 * n) * blob.strength;
      if (o > 0.08) cells.push({ x, y, o });
    }
  }
  return cells;
}

export default function HeroGrid() {
  return (
    <div className="lp-hero-grid" aria-hidden="true">
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="lp-blob"
          style={{
            left: `calc(var(--cell) * ${blob.x})`,
            top: `calc(var(--cell) * ${blob.y})`,
            animationDelay: `${blob.delay}s`,
          }}
        >
          {cellsFor(blob).map((cell, j) => (
            <span
              key={j}
              className="lp-blob-cell"
              style={{
                left: `calc(var(--cell) * ${cell.x} + 1px)`,
                top: `calc(var(--cell) * ${cell.y} + 1px)`,
                opacity: Number(cell.o.toFixed(3)),
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
