import React, { useState, useEffect } from 'react';
import annotationsData from '../assets/json-files/dummy-file.json';

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
      } else if (currentError) {
        // Dismiss error popup on any key press
        setCurrentError(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentError, end_frame, start_frame]);

  const handleClick = () => {
    if (currentError) {
      setCurrentError(null);
    }
  };

  const frameIndex = currentFrame - start_frame + 1;

  return (
    <div 
      className="frame-viewer"
      onClick={handleClick}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Frame Image */}
      <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '85vh' }}>
        <img
          src={getFrameImage(currentFrame)}
          alt={`Frame ${currentFrame}`}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '8px'
          }}
        />

        {/* Error Popup Overlay */}
        {currentError && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(155, 93, 229, 0.95)',
              color: '#fff',
              padding: '24px 32px',
              borderRadius: '12px',
              maxWidth: '500px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              zIndex: 10,
              cursor: 'pointer'
            }}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentError(null);
            }}
          >
            <h2 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: 'bold' }}>
              {currentError.type}
            </h2>
            <p style={{ margin: '0 0 16px 0', fontSize: '16px', lineHeight: '1.5' }}>
              {currentError.explanation}
            </p>
            {currentError.example_image && (
              <div style={{ marginTop: '16px' }}>
                <img
                  src={getFrameImage(parseInt(currentError.example_image.replace('.jpg', '')))}
                  alt="Example"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                />
              </div>
            )}
            <p style={{ 
              marginTop: '16px', 
              fontSize: '12px', 
              opacity: 0.8,
              fontStyle: 'italic' 
            }}>
              Click anywhere or press any key to dismiss
            </p>
          </div>
        )}
      </div>

      {/* Progress Counter */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  );
};

export default FrameViewer;
