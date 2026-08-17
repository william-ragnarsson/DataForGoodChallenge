import { Link } from "react-router-dom";
import HeroMosaic from "./HeroMosaic";

export default function Hero() {
  return (
    <section className="lp-hero">
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

        <HeroMosaic />
      </div>
    </section>
  );
}
