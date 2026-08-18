import Hero from "../components/landing/Hero";
import PitchBlock from "../components/landing/PitchBlock";
import BentoGrid from "../components/landing/BentoGrid";
import HowItWorks from "../components/landing/HowItWorks";
import UnderTheHood from "../components/landing/UnderTheHood";
import Footer from "../components/landing/Footer";

export default function Home() {
  return (
    <main className="lp">
      <Hero />

      <div className="lp-section lp-strip">
        <div className="lp-container lp-strip-inner">
          <span>Data for Good Challenge</span>
          <span className="lp-strip-sep">&middot;</span>
          <span>ORSI Academy</span>
          <span className="lp-strip-sep">&middot;</span>
          <span>KU Leuven</span>
        </div>
      </div>

      <PitchBlock />
      <BentoGrid />
      <HowItWorks />
      <UnderTheHood />
      <Footer />
    </main>
  );
}
