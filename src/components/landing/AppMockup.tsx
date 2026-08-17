/**
 * Stylized redraw of the three-pane tool — annotation list, frame panel, chat.
 * Drawn entirely in CSS rather than screenshotted, so no procedure footage
 * appears anywhere below the hero.
 */
export default function AppMockup() {
  return (
    <div className="lp-mock" aria-hidden="true">
      <div className="lp-mock-bar">
        <span className="lp-mock-dot" />
        <span className="lp-mock-dot" />
        <span className="lp-mock-dot" />
        <span className="lp-mono-dim lp-mock-title">NORA AI</span>
      </div>

      <div className="lp-mock-body">
        <div className="lp-mock-pane lp-mock-left">
          <p className="lp-mono-dim">ANNOTATIONS</p>
          <div className="lp-mock-card lp-mock-card-active">
            <span className="lp-mock-line lp-w-70 lp-accent-line" />
            <span className="lp-mock-line lp-w-90" />
            <span className="lp-mock-line lp-w-50" />
          </div>
          <div className="lp-mock-card">
            <span className="lp-mock-line lp-w-60" />
            <span className="lp-mock-line lp-w-85" />
          </div>
          <div className="lp-mock-card">
            <span className="lp-mock-line lp-w-75" />
            <span className="lp-mock-line lp-w-40" />
          </div>
        </div>

        <div className="lp-mock-pane lp-mock-center">
          <div className="lp-mock-frame">
            <span className="lp-mock-region" />
          </div>
          <div className="lp-mock-strip">
            {Array.from({ length: 24 }, (_, i) => (
              <span
                key={i}
                className={
                  i === 8 || i === 9 || i === 16
                    ? "lp-mock-tick lp-mock-tick-on"
                    : "lp-mock-tick"
                }
              />
            ))}
          </div>
        </div>

        <div className="lp-mock-pane lp-mock-right">
          <p className="lp-mono-dim">ASSISTANT</p>
          <div className="lp-bubble lp-bubble-user">
            <span className="lp-mock-line lp-w-80" />
          </div>
          <div className="lp-bubble lp-bubble-ai">
            <span className="lp-mock-line lp-w-95" />
            <span className="lp-mock-line lp-w-85" />
            <span className="lp-mock-line lp-w-60" />
          </div>
          <div className="lp-bubble lp-bubble-user">
            <span className="lp-mock-line lp-w-55" />
          </div>
        </div>
      </div>
    </div>
  );
}
