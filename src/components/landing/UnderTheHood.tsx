const FACTS = [
  { k: "Interface", v: "React 18 + TypeScript" },
  { k: "Build", v: "Vite 7" },
  { k: "Assistant", v: "GPT-4o-mini" },
  { k: "Reporting", v: "react-pdf" },
  { k: "Dataset", v: "51 annotated frames" },
  { k: "Styling", v: "Hand-written CSS" },
];

export default function UnderTheHood() {
  return (
    <section className="lp-section">
      <div className="lp-container">
        <p className="lp-eyebrow">
          <span className="lp-eyebrow-dot" />
          Under the hood
        </p>
        <h2 className="lp-h2 lp-h2-tight">What it is built on</h2>

        <dl className="lp-facts">
          {FACTS.map((f) => (
            <div key={f.k} className="lp-fact">
              <dt className="lp-mono-dim">{f.k.toUpperCase()}</dt>
              <dd className="lp-fact-v">{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
