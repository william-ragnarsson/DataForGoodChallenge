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
  // report UI state (no persistence)
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  
  // Resizable pane widths (in percentage)
  const [leftWidth, setLeftWidth] = useState(25);
  const [rightWidth, setRightWidth] = useState(25);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

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

  // Handle resize for left pane
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth >= 15 && newWidth <= 40) {
          setLeftWidth(newWidth);
        }
      }
      if (isResizingRight) {
        const newWidth = ((window.innerWidth - e.clientX) / window.innerWidth) * 100;
        if (newWidth >= 15 && newWidth <= 40) {
          setRightWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizingLeft, isResizingRight]);

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

  // --- Report (red exclamation) handlers ---
  const openReport = () => setReportOpen(true);
  const closeReport = () => {
    setReportText("");
    setReportOpen(false);
  };

  const submitReport = () => {
    if (!reportText.trim()) return;
    // ephemeral: clear the input and close the panel; do not persist
    setReportText("");
    setReportOpen(false);
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
      {/* Export PDF Button - Top Right */}
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
      {/* Report button (red exclamation) - bottom left */}
      <div style={{ position: 'fixed', left: 20, bottom: 20, zIndex: 40 }}>
        <button
          onClick={openReport}
          title="Report / comment on current frame"
          style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            width: 48,
            height: 48,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <span style={{ fontSize: 20, lineHeight: '20px' }}>!</span>
        </button>
      </div>

      {/* Report input panel */}
      {reportOpen && (
        <div
          style={{
            position: 'fixed',
            left: 20,
            bottom: 84,
            zIndex: 50,
            width: 320,
            background: '#111',
            color: '#fff',
            borderRadius: 8,
            padding: 12,
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ fontSize: 14, marginBottom: 8 }}>Report comment for frame #{currentFrame}</div>
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Describe what you disagree with or report..."
            style={{ width: '100%', height: 100, padding: 8, borderRadius: 6, background: '#0b0b0b', color: '#fff', border: '1px solid #333' }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 8, justifyContent: 'flex-end' }}>
            <button onClick={closeReport} style={{ padding: '6px 10px', borderRadius: 6, background: '#333', color: '#fff', border: 'none' }}>Cancel</button>
            <button onClick={submitReport} style={{ padding: '6px 10px', borderRadius: 6, background: '#ef4444', color: '#fff', border: 'none' }}>Submit</button>
          </div>
        </div>
      )}

      {/* Left Column - Error/Annotation Section */}
      <div
        style={{
          width: `${leftWidth}%`,
          height: '100%',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div
          style={{
            flex: '1',
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* Current Error Section */}
          <div>
            <h3 style={{ 
              margin: '0 0 16px 0', 
              fontSize: '18px', 
              color: '#9b5de5',
              fontWeight: 'bold',
              borderBottom: '2px solid rgba(155, 93, 229, 0.3)',
              paddingBottom: '12px'
            }}>
              Current Frame
            </h3>
            {currentError ? (
              <div
                style={{
                  backgroundColor: 'rgba(155, 93, 229, 0.15)',
                  border: '2px solid rgba(155, 93, 229, 0.6)',
                  borderRadius: '12px',
                  padding: '20px',
                  color: '#fff'
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(155, 93, 229, 0.9)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginBottom: '12px'
                  }}
                >
                  Error Detected
                </div>
                <h2 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: '#9b5de5'
                }}>
                  {currentError.type}
                </h2>
                <p style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  color: '#e0e0e0'
                }}>
                  {currentError.explanation}
                </p>
                {currentError.example_image && (
                  <div style={{ marginTop: '16px' }}>
                    <p style={{ 
                      fontSize: '12px', 
                      color: '#aaa', 
                      marginBottom: '8px',
                      fontWeight: '500'
                    }}>
                      Reference Frame:
                    </p>
                    <img
                      src={getFrameImage(parseInt(currentError.example_image.replace('.jpg', '')))}
                      alt="Example"
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        border: '2px solid rgba(155, 93, 229, 0.4)'
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ 
                color: '#666', 
                textAlign: 'center', 
                padding: '40px 20px',
                fontSize: '14px'
              }}>
                <p style={{ margin: 0 }}>No errors detected in current frame</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
                  Navigate with arrow keys to explore the sequence
                </p>
              </div>
            )}
          </div>

          {/* All Annotations List */}
          <div>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px', 
              color: '#9b5de5',
              fontWeight: 'bold',
              borderBottom: '2px solid rgba(155, 93, 229, 0.3)',
              paddingBottom: '10px'
            }}>
              All Annotations ({data.errors.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.errors.map((error, index) => {
                const isActive = currentFrame >= error.range.start && currentFrame <= error.range.end;
                const midFrame = Math.floor((error.range.start + error.range.end) / 2);
                
                return (
                  <div
                    key={index}
                    onClick={() => setCurrentFrame(midFrame)}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'rgba(155, 93, 229, 0.25)' : 'rgba(0, 0, 0, 0.3)',
                      border: isActive ? '2px solid rgba(155, 93, 229, 0.8)' : '1px solid rgba(155, 93, 229, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(155, 93, 229, 0.15)';
                        e.currentTarget.style.border = '1px solid rgba(155, 93, 229, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                        e.currentTarget.style.border = '1px solid rgba(155, 93, 229, 0.2)';
                      }
                    }}
                  >
                    <div style={{
                      fontSize: '10px',
                      color: isActive ? '#9b5de5' : '#888',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      marginBottom: '6px',
                      letterSpacing: '0.5px'
                    }}>
                      Frames {error.range.start}-{error.range.end}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: isActive ? '#fff' : '#ccc',
                      fontWeight: isActive ? 'bold' : 'normal',
                      marginBottom: '4px'
                    }}>
                      {error.type}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#999',
                      lineHeight: '1.4',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {error.explanation}
                    </div>
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#9b5de5',
                        boxShadow: '0 0 8px rgba(155, 93, 229, 0.8)'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Left Resize Handle */}
        <div
          onMouseDown={() => setIsResizingLeft(true)}
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '8px',
            cursor: 'col-resize',
            backgroundColor: 'transparent',
            zIndex: 10,
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(155, 93, 229, 0.5)';
          }}
          onMouseLeave={(e) => {
            if (!isResizingLeft) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div style={{
            position: 'absolute',
            right: '3px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '2px',
            height: '40px',
            backgroundColor: 'rgba(155, 93, 229, 0.6)',
            borderRadius: '1px'
          }} />
        </div>
      </div>

      {/* Center Column - Image Viewer */}
      <div
        style={{
          width: `${100 - leftWidth - rightWidth}%`,
          height: '100%',
          backgroundColor: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '20px'
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
          width: `${rightWidth}%`,
          height: '100%',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Right Resize Handle */}
        <div
          onMouseDown={() => setIsResizingRight(true)}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '8px',
            cursor: 'col-resize',
            backgroundColor: 'transparent',
            zIndex: 10,
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(155, 93, 229, 0.5)';
          }}
          onMouseLeave={(e) => {
            if (!isResizingRight) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <div style={{
            position: 'absolute',
            left: '3px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '2px',
            height: '40px',
            backgroundColor: 'rgba(155, 93, 229, 0.6)',
            borderRadius: '1px'
          }} />
        </div>
        
        <div
          style={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            overflow: 'hidden'
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
            NORA AI
          </h3>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <ChatBot 
              currentFrame={currentFrame}
              currentError={currentError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameViewer;