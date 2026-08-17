import { useEffect } from "react";
import FrameViewer from "../components/FrameViewer";

/**
 * Route wrapper for the tool.
 *
 * The viewer is `position: fixed; inset: 0` and assumes it owns the viewport,
 * so the page scroll lock that used to live globally in index.css is re-applied
 * here for this route only — and released on unmount so the landing page
 * scrolls again on the way back.
 */
export default function NoraApp() {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return <FrameViewer />;
}
