import React, { useState, useEffect } from 'react';
import annotationsData from '../assets/json-files/dummy-file.json';
import ChatBot from '../chatbot/chatbot';

interface Error {
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
  errors: Error[];
}

const FrameViewer: React.FC = () => {
  const data = annotationsData as AnnotationsData;
  const { start_frame, end_frame, total_frames } = data.metadata;
  
  const [currentFrame, setCurrentFrame] = useState(start_frame);
  const [currentError, setCurrentError] = useState<Error | null>(null);

  // Import all frames dynamically
  const getFrameImage = (frameNumber: number) => {
    try {
      return new URL(`../assets/images/${frameNumber}.jpg`, import.meta.url).href;
    } catch {
      return '';
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
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentFrame((prev) => Math.min(prev + 1, end_frame));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentFrame((prev) => Math.max(prev - 1, start_frame));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [end_frame, start_frame]);

  const frameIndex = currentFrame - start_frame + 1;

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
        }}
      >
        <div
          style={{
            flex: '1',
            overflowY: 'auto',
            padding: '20px'
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameViewer;