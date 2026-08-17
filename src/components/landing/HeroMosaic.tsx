/**
 * Hero visual.
 *
 * Deliberately abstract: the backdrop is a 28x16 downsample of a real frame
 * (public/mosaic.png, generated with `sips`), scaled up with
 * `image-rendering: pixelated` and heavily desaturated. Nothing anatomical
 * survives at that resolution — it reads as video data, not tissue.
 *
 * The meaning is carried by the overlay instead: a tracked region and a
 * 51-cell timeline where the four labelled error intervals light up.
 */

const TOTAL_FRAMES = 51;
const START_FRAME = 734;

// Mirrors src/assets/json-files/dummy-file.json
const ERROR_RANGES = [
  { start: 740, end: 745, type: "Needle misalignment" },
  { start: 755, end: 760, type: "Suture tension too high" },
  { start: 768, end: 773, type: "Instrument collision" },
  { start: 776, end: 780, type: "Camera instability" },
];

function isFlagged(frame: number) {
  return ERROR_RANGES.some((r) => frame >= r.start && frame <= r.end);
}

export default function HeroMosaic() {
  const frames = Array.from({ length: TOTAL_FRAMES }, (_, i) => START_FRAME + i);

  return (
    <div className="lp-visual" aria-hidden="true">
      <div className="lp-mosaic">
        <img className="lp-mosaic-img" src="/mosaic.png" alt="" />
        <div className="lp-mosaic-tint" />
        <div className="lp-mosaic-grid" />
        <div className="lp-mosaic-scan" />

        <div className="lp-hud lp-hud-tl">FRAME 759 / 784</div>
        <div className="lp-hud lp-hud-tr">5 FPS</div>

        <div className="lp-region">
          <span className="lp-region-corner lp-c-tl" />
          <span className="lp-region-corner lp-c-tr" />
          <span className="lp-region-corner lp-c-bl" />
          <span className="lp-region-corner lp-c-br" />
          <span className="lp-region-label">Suture tension too high</span>
        </div>
      </div>

      <div className="lp-timeline">
        <div className="lp-timeline-head">
          <span className="lp-mono-dim">734</span>
          <span className="lp-mono-dim">51 frames &middot; 4 flagged intervals</span>
          <span className="lp-mono-dim">784</span>
        </div>
        <div className="lp-timeline-track">
          {frames.map((frame) => (
            <span
              key={frame}
              className={
                isFlagged(frame) ? "lp-tick lp-tick-flagged" : "lp-tick"
              }
            />
          ))}
          <span className="lp-playhead" />
        </div>
      </div>
    </div>
  );
}
