import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <section className="lp-section lp-closing">
        <div className="lp-container lp-closing-inner">
          <h2 className="lp-h2">Open the review tool</h2>
          <p className="lp-body lp-closing-body">
            The full interface, running on the annotated suturing sequence.
          </p>
          <Link to="/nora" className="lp-btn lp-btn-primary">
            Open Nora AI
          </Link>
        </div>
      </section>

      <footer className="lp-footer">
        <div className="lp-container lp-footer-inner">
          <div>
            <span className="lp-wordmark lp-wordmark-static">
              <span className="lp-wordmark-dot" aria-hidden="true" />
              NORA<span className="lp-wordmark-ai">AI</span>
            </span>
            <p className="lp-footer-note">
              A prototype built for the Data for Good Challenge with ORSI
              Academy and KU Leuven. It runs on one fixed, pre-annotated
              procedure rather than ingesting new video.
            </p>
          </div>

          <div className="lp-footer-links">
            <Link to="/" className="lp-nav-link">
              Home
            </Link>
            <Link to="/nora" className="lp-nav-link">
              Nora AI
            </Link>
            <a
              className="lp-nav-link"
              href="https://github.com/william-popmie/DataForGoodChallenge"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
