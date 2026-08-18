import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="lp-hero">
      {/* Background texture only — sits behind the type, never competes with it.
          The masks (rows, then columns) sit on the two outer elements and stay
          static; only the innermost element moves, so the cells stay locked to
          the gridlines while the band travels. */}
      <div className="lp-hero-grid" aria-hidden="true">
        <div className="lp-scan">
          <div className="lp-scan-band">
            <div className="lp-scan-inner" />
          </div>
        </div>
      </div>

      <div className="lp-container lp-hero-inner">
        <p className="lp-eyebrow">
          <span className="lp-eyebrow-dot" />
          Surgical training feedback
        </p>

        <h1 className="lp-hero-title">How surgical review should be</h1>

        <p className="lp-hero-sub">
          Frame by frame error-annotation and testing for students
        </p>

        <div className="lp-cta-row">
          <Link to="/nora" className="lp-btn lp-btn-primary">
            Open Nora AI
          </Link>
          <a href="#how-it-works" className="lp-btn lp-btn-ghost">
            How it works
          </a>
        </div>
      </div>
    </section>
  );
}
