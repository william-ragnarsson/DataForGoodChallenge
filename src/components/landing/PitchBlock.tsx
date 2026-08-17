import AppMockup from "./AppMockup";

export default function PitchBlock() {
  return (
    <section className="lp-section lp-pitch">
      <div className="lp-container lp-pitch-inner">
        <div className="lp-pitch-copy">
          <p className="lp-eyebrow">
            <span className="lp-eyebrow-dot" />
            What it does
          </p>
          <h2 className="lp-h2">Improve student precision during surgery</h2>
          <p className="lp-lede">
            NORA AI reviews an annotated procedure with the trainee, one frame
            at a time. It marks where the technique broke down, explains what
            went wrong and why it matters, and answers questions about the frame
            on screen.
          </p>
          <p className="lp-lede">
            Nothing about the session is lost afterwards — the whole review
            exports as a report a supervisor can read end to end.
          </p>

          <ul className="lp-pitch-list">
            <li>
              <span className="lp-pitch-num">01</span>
              Errors are tied to the exact frames they happen on, not to a
              timestamp scribbled down after the fact.
            </li>
            <li>
              <span className="lp-pitch-num">02</span>
              Explanations sit next to the footage, so the trainee reads them
              while looking at the mistake.
            </li>
            <li>
              <span className="lp-pitch-num">03</span>
              The same review works as a teaching session and as a written
              record.
            </li>
          </ul>
        </div>

        <div className="lp-pitch-visual">
          <AppMockup />
        </div>
      </div>
    </section>
  );
}
