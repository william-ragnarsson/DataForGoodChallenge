import UseDummyButton from "./pdfmaker/UseDummyButton";
import JsonToPdf from "./pdfmaker/JsonToPdf";

export default function App() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <h1>JSON → PDF maker</h1>
      <UseDummyButton />
      <div style={{ height: 16 }} />
      <JsonToPdf />
    </div>
  );
}
