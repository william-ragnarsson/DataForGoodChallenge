export default function BentoGrid() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <div className="lp-bento">
          <article className="lp-cell lp-span-3">
            <p className="lp-mono-dim">FRAME NAVIGATION</p>
            <h3 className="lp-h3">Move through the procedure one frame</h3>
            <p className="lp-body">
              Arrow keys step forward and back. Clicking an annotation jumps
              straight to the middle of the interval it describes.
            </p>
            <div className="lp-viz lp-viz-strip" aria-hidden="true">
              {Array.from({ length: 30 }, (_, i) => (
                <span
                  key={i}
                  className={i === 14 ? "lp-vtick lp-vtick-on" : "lp-vtick"}
                />
              ))}
            </div>
          </article>

          <article className="lp-cell lp-span-3">
            <p className="lp-mono-dim">ERROR ANNOTATIONS</p>
            <h3 className="lp-h3">Every flagged interval says what and why</h3>
            <p className="lp-body">
              Each one carries a type, a written explanation, and a reference
              image from the frame where it is clearest.
            </p>
            <div className="lp-viz" aria-hidden="true">
              <div className="lp-anno">
                <span className="lp-anno-chip">Needle misalignment</span>
                <span className="lp-mono-dim">734&ndash;745</span>
              </div>
              <div className="lp-anno lp-anno-muted">
                <span className="lp-anno-chip lp-anno-chip-off">
                  Instrument collision
                </span>
                <span className="lp-mono-dim">768&ndash;773</span>
              </div>
            </div>
          </article>

          <article className="lp-cell lp-span-2">
            <p className="lp-mono-dim">IN CONTEXT</p>
            <h3 className="lp-h3">Ask about what you are looking at</h3>
            <p className="lp-body">
              The assistant already knows the current frame and what was flagged
              on it.
            </p>
            <div className="lp-viz" aria-hidden="true">
              <div className="lp-bubble lp-bubble-user lp-bubble-sm">
                <span className="lp-mock-line lp-w-70" />
              </div>
              <div className="lp-bubble lp-bubble-ai lp-bubble-sm">
                <span className="lp-mock-line lp-w-90" />
                <span className="lp-mock-line lp-w-60" />
              </div>
            </div>
          </article>

          <article className="lp-cell lp-span-2">
            <p className="lp-mono-dim">REPORT</p>
            <h3 className="lp-h3">The session leaves as a PDF</h3>
            <p className="lp-body">
              Findings, severities and reference frames, laid out for a
              supervisor to sign off.
            </p>
            <div className="lp-viz" aria-hidden="true">
              <div className="lp-doc">
                <span className="lp-mock-line lp-w-40 lp-accent-line" />
                <span className="lp-mock-line lp-w-95" />
                <span className="lp-mock-line lp-w-85" />
                <span className="lp-mock-line lp-w-90" />
                <span className="lp-mock-line lp-w-55" />
              </div>
            </div>
          </article>

          <article className="lp-cell lp-span-2">
            <p className="lp-mono-dim">DATA</p>
            <h3 className="lp-h3">Driven by the annotation file</h3>
            <p className="lp-body">
              Frame rate, interval boundaries and error types all come from the
              procedure's own JSON.
            </p>
            <div className="lp-viz" aria-hidden="true">
              <pre className="lp-code">
{`"range": { "start": 755,
           "end":   760 },
"type": "Suture tension
         too high"`}
              </pre>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
