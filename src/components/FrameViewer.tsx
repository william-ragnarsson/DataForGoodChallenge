import React, { useState, useEffect } from 'react';
import annotationsData from '../assets/json-files/dummy-file.json';
import ChatBot from '../chatbot/chatbot';

// PDF-maker imports
import {
  convertSurgeryJsonToAnalysis,
  type SurgeryJson,
} from "../pdfmaker/convertFromSurgeryJson";
import { generateReportPdfFromJson } from "../pdfmaker/generateReport";

interface ErrorItem {
  range: { start: number; end: number };
  type: string;
  explanation: string;
  example_image?: string;
}

interface AnnotationsData {
  metadata: {
    total_frames: number;
    start_frame: number;
    end_frame: number;
    fps: number;
    description: string;
  };
  errors: ErrorItem[];
}

const FrameViewer: React.FC = () => {
  const data = annotationsData as AnnotationsData;
  const { start_frame, end_frame, total_frames } = data.metadata;

  const [currentFrame, setCurrentFrame] = useState(start_frame);
  const [currentError, setCurrentError] = useState<ErrorItem | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Import all frames dynamically
  const getFrameImage = (frameNumber: number) => {
    try {
      return new URL(`../assets/images/${frameNumber}.jpg`, import.meta.url).href;
    } catch {
      return "";
    }
  };

  // Check if current frame has an error
  useEffect(() => {
    const error = data.errors.find(
      (err) => currentFrame >= err.range.start && currentFrame <= err.range.end
    );
    setCurrentError(error || null);
  }, [currentFrame, data.errors]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentFrame((prev) => Math.min(prev + 1, end_frame));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentFrame((prev) => Math.max(prev - 1, start_frame));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [end_frame, start_frame]);

  const frameIndex = currentFrame - start_frame + 1;

  // --- PDF export handler (rechtsboven knop) ---
  const handleExportPdf = async () => {
    if (exporting) return;
    setExporting(true);
    setExportError(null);
    try {
      // 1) Converteer dummy JSON naar AnalysisResult (incl. image-URLs)
      const analysis = convertSurgeryJsonToAnalysis(annotationsData as SurgeryJson);

      // 2) Genereer PDF blob (download handmatig voor beste browser-compat)
      const blob = await generateReportPdfFromJson(analysis, {
        title: "Surgical Performance Feedback",
        organization: "ORSI Academy",
        outputName: "orsi-feedback",
        download: false, // we downloaden hieronder zelf
      });

      // 3) Forceer download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orsi-feedback.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setExportError(
        err instanceof Error ? err.message : "Failed to generate PDF"
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="frame-viewer"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#0a0a0a',
        display: 'flex',
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {/* Left Column - Error/Annotation Section */}
      <div
        style={{
          width: '25%',
          height: '100%',
          backgroundColor: '#1a1a1a',
          borderRight: '2px solid rgba(155, 93, 229, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0a0a0a",
        display: "flex",
        overflow: "hidden",
        position: "relative", // voor de absolute knop rechtsboven
      }}
    >
      {/* --- Export knop rechtsboven --- */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
        }}
      >
        <button
          type="button"
          onClick={handleExportPdf}
          disabled={exporting}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(0,0,0,0.4)",
            background:
              "linear-gradient(180deg, rgba(0,166,166,0.9) 0%, rgba(10,42,90,0.95) 100%)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 13,
            letterSpacing: 0.2,
            cursor: exporting ? "not-allowed" : "pointer",
            boxShadow: "0 6px 18px rgba(0,0,0,0.3)",
          }}
          title="Generate ORSI PDF from dummy JSON"
        >
          {exporting ? "Preparing PDF…" : "Export PDF (dummy)"}
        </button>
        {exportError ? (
          <span style={{ color: "#fca5a5", fontSize: 12 }}>{exportError}</span>
        ) : null}
      </div>

      {/* Left Side - Image Viewer (2/3) */}
      <div
        style={{
          width: "66.66%",
          height: "100%",
          backgroundColor: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "20px",
        }}
      >
        <img
          src={getFrameImage(currentFrame)}
          alt={`Frame ${currentFrame}`}
          style={{
            maxWidth: "100%",
            maxHeight: "calc(100% - 80px)",
            width: "auto",
            height: "auto",
            display: "block",
            borderRadius: "8px",
            objectFit: "contain",
          }}
        />

        {/* Progress Counter */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "24px",
            fontSize: "16px",
            fontFamily: "monospace",
            border: "2px solid rgba(155, 93, 229, 0.5)",
            zIndex: 5,
          }}
        >
          Frame {frameIndex} / {total_frames} (#{currentFrame})
          <div
            style={{
              fontSize: "12px",
              opacity: 0.7,
              marginTop: "4px",
              textAlign: "center",
            }}
          >
            Use ← → arrow keys to navigate
          </div>
        </div>
      </div>

      {/* Right Side - Sidebar (1/3) */}
      <div
        style={{
          width: "33.33%",
          height: "100%",
          backgroundColor: "#1a1a1a",
          borderLeft: "2px solid rgba(155, 93, 229, 0.3)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: '1',
            overflowY: 'auto',
            padding: '20px'
            flex: "0 0 auto",
            maxHeight: "50%",
            overflowY: "auto",
            padding: "20px",
            borderBottom: currentError
              ? "2px solid rgba(155, 93, 229, 0.3)"
              : "none",
          }}
        >
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            color: '#9b5de5',
            fontWeight: 'bold',
            borderBottom: '2px solid rgba(155, 93, 229, 0.3)',
            paddingBottom: '12px'
          }}>
            Problems
          </h3>
          {currentError ? (
            <div
              style={{
                backgroundColor: "rgba(155, 93, 229, 0.15)",
                border: "2px solid rgba(155, 93, 229, 0.6)",
                borderRadius: "12px",
                padding: "20px",
                color: "#fff",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: "rgba(155, 93, 229, 0.9)",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Error Detected
              </div>
              <h2
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#9b5de5",
                }}
              >
                {currentError.type}
              </h2>
              <p
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#e0e0e0",
                }}
              >
                {currentError.explanation}
              </p>
              {currentError.example_image && (
                <div style={{ marginTop: "16px" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#aaa",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Reference Frame:
                  </p>
                  <img
                    src={getFrameImage(
                      parseInt(currentError.example_image.replace(".jpg", ""))
                    )}
                    alt="Example"
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      border: "2px solid rgba(155, 93, 229, 0.4)",
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                color: "#666",
                textAlign: "center",
                padding: "40px 20px",
                fontSize: "14px",
              }}
            >
              <p style={{ margin: 0 }}>No errors detected in current frame</p>
              <p style={{ margin: "8px 0 0 0", fontSize: "12px", opacity: 0.7 }}>
                Navigate with arrow keys to explore the sequence
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Center Column - Image Viewer */}
      <div
        style={{
          width: '50%',
          height: '100%',
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '20px',
          borderRight: '2px solid rgba(155, 93, 229, 0.3)'
        }}
      >
        <img
          src={getFrameImage(currentFrame)}
          alt={`Frame ${currentFrame}`}
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(100% - 80px)',
            width: 'auto',
            height: 'auto',
            display: 'block',
            borderRadius: '8px',
            objectFit: 'contain'
          }}
        />

        {/* Progress Counter */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '24px',
            fontSize: '16px',
            fontFamily: 'monospace',
            border: '2px solid rgba(155, 93, 229, 0.5)',
            zIndex: 5
          }}
        >
          Frame {frameIndex} / {total_frames} (#{currentFrame})
          <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px', textAlign: 'center' }}>
            Use ← → arrow keys to navigate
          </div>
        </div>
      </div>

      {/* Right Column - Chatbot Section */}
      <div
        style={{
          width: '25%',
          height: '100%',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            overflow: 'hidden'
            flex: "1",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            overflowY: "auto",
          }}
        >
          <h3 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '18px', 
            color: '#9b5de5',
            fontWeight: 'bold',
            borderBottom: '2px solid rgba(155, 93, 229, 0.3)',
            paddingBottom: '12px'
          }}>
            Cockpilot
          </h3>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Render the ChatBot component inside the sidebar */}
            <ChatBot />
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {/* Render the ChatBot component inside the sidebar and pass current frame/context */}
            <ChatBot
              currentFrame={currentFrame}
              frameImageUrl={getFrameImage(currentFrame)}
              currentError={currentError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameViewer;