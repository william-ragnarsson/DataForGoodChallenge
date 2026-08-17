import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <header className="lp-nav">
      <div className="lp-nav-inner">
        <NavLink to="/" className="lp-wordmark" aria-label="NORA AI, home">
          <span className="lp-wordmark-dot" aria-hidden="true" />
          NORA<span className="lp-wordmark-ai">AI</span>
        </NavLink>

        <nav className="lp-nav-links">
          <NavLink to="/" end className="lp-nav-link">
            Home
          </NavLink>
          <NavLink to="/nora" className="lp-nav-link">
            Nora AI
          </NavLink>
        </nav>

        <a
          className="lp-nav-link lp-nav-right"
          href="https://github.com/william-popmie/DataForGoodChallenge"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
