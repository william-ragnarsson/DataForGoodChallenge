const STEPS = [
  {
    n: "01",
    title: "Load the annotated procedure",
    body: "A suturing sequence of 51 frames at 5 fps, with four labelled error intervals and a reference image for each.",
  },
  {
    n: "02",
    title: "Step through what was flagged",
    body: "Walk the sequence frame by frame, or jump straight to an interval. The error card and the assistant both follow where you are.",
  },
  {
    n: "03",
    title: "Export the review",
    body: "Findings, explanations and reference frames come out as a branded PDF at the end of the session.",
  },
];

export default function HowItWorks() {
  return (
    <section className="lp-section" id="how-it-works">
      <div className="lp-container">
        <p className="lp-eyebrow">
          <span className="lp-eyebrow-dot" />
          How it works
        </p>
        <h2 className="lp-h2 lp-h2-tight">Three steps, start to finish</h2>

        <ol className="lp-steps">
          {STEPS.map((s) => (
            <li key={s.n} className="lp-step">
              <span className="lp-step-n">{s.n}</span>
              <h3 className="lp-h3">{s.title}</h3>
              <p className="lp-body">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
