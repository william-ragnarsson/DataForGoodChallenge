import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/landing/Nav";
import Home from "./pages/Home";
import "./styles/landing.css";

/**
 * The tool is loaded lazily on purpose.
 *
 * `src/chatbot/openai.tsx` constructs its OpenAI client at module scope, which
 * throws when VITE_OPENAI_API_KEY is unset. Importing it eagerly would take the
 * landing page down with it, so the chunk is only fetched when /nora is opened.
 * It also keeps the ~2MB tool bundle off the homepage's critical path.
 */
const NoraApp = lazy(() => import("./pages/NoraApp"));

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/nora"
          element={
            <Suspense fallback={<div className="lp-route-loading" />}>
              <NoraApp />
            </Suspense>
          }
        />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
