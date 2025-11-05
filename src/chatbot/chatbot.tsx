import React, { useState } from "react";
import { askAI } from "./openai";
import dummyData from "../assets/json-files/dummy-file.json";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ErrorAnnotation {
  range: { start: number; end: number };
  type: string;
  explanation: string;
  example_image?: string;
}

interface ChatBotProps {
  currentFrame?: number;
  currentError?: ErrorAnnotation | null;
}

interface AnnotationsData {
  errors: ErrorAnnotation[];
}

const ChatBot: React.FC<ChatBotProps> = ({ currentFrame, currentError }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Get all annotations data
    const allAnnotations = (dummyData as AnnotationsData).errors || [];
    
    // Find next upcoming error if current frame has no error
    let nextError = null;
    if (!currentError && typeof currentFrame === "number") {
      nextError = allAnnotations.find(
        (err: ErrorAnnotation) => err.range.start > currentFrame
      );
    }

    // Build comprehensive context
    const systemPrompt = `You are NORA AI, an AI surgical training assistant helping student surgeons improve their technique.

CRITICAL INSTRUCTIONS:
1. NEVER hallucinate or make up information not in the annotations
2. ALWAYS be specific and reference actual frame numbers from the annotations
3. If the current frame has NO error, inform the user and reference the NEXT upcoming error with specific frame numbers
4. Provide detailed, educational responses covering WHY, WHAT, and HOW

RESPONSE STRUCTURE (when discussing an error):
- **WHY**: Explain why the surgeon made this mistake (root cause, common misconception, etc.)
- **WHAT**: Describe exactly what the mistake was with technical details
- **HOW**: Provide actionable steps to avoid repeating this mistake
- **Context**: Reference specific frame numbers where this occurs

Be concise but thorough. Use a supportive, educational tone.`;

    let frameContext = "";
    if (typeof currentFrame === "number") {
      frameContext += `\n\nCURRENT FRAME: #${currentFrame}\n`;
      
      if (currentError) {
        frameContext += `CURRENT ERROR DETECTED:\n`;
        frameContext += `- Type: ${currentError.type}\n`;
        frameContext += `- Frames: ${currentError.range.start}-${currentError.range.end}\n`;
        frameContext += `- Explanation: ${currentError.explanation}\n`;
        if (currentError.example_image) {
          frameContext += `- Reference image: ${currentError.example_image}\n`;
        }
      } else {
        frameContext += `STATUS: No error detected at current frame.\n`;
        
        if (nextError) {
          frameContext += `\nNEXT UPCOMING ERROR:\n`;
          frameContext += `- Type: ${nextError.type}\n`;
          frameContext += `- Frames: ${nextError.range.start}-${nextError.range.end}\n`;
          frameContext += `- Explanation: ${nextError.explanation}\n`;
        } else {
          frameContext += `\nNo upcoming errors found in remaining frames.\n`;
        }
      }
    }

    // List all annotations for reference
    const annotationsList = allAnnotations.map((err: ErrorAnnotation, idx: number) => 
      `${idx + 1}. [Frames ${err.range.start}-${err.range.end}] ${err.type}: ${err.explanation}`
    ).join("\n");

    const fullContext = `${systemPrompt}

ALL AVAILABLE ANNOTATIONS:
${annotationsList}
${frameContext}

USER PROFILE: This is a student surgeon in training, reviewing a surgical procedure video for educational purposes.

USER QUESTION: ${text}

Remember: Be specific, reference frame numbers, don't hallucinate, and structure your answer with WHY, WHAT, and HOW when relevant.`;

    try {
      const aiResponse = await askAI(fullContext);
      const aiMsg: Message = { sender: "ai", text: aiResponse };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errMsg: Message = { sender: "ai", text: "Er is een fout opgetreden bij het ophalen van een antwoord." };
      setMessages((prev) => [...prev, errMsg]);
      console.error("askAI error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        backgroundColor: 'transparent',
        overflow: 'hidden'
      }}
    >
      {/* Messages container */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '12px',
          border: '1px solid rgba(155, 93, 229, 0.2)'
        }}
      >
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            fontSize: '14px'
          }}>
            <p style={{ margin: 0 }}>Ask NORA AI about the current frame</p>
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
              Get AI-powered feedback on surgical techniques
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: m.sender === "user" 
                ? 'linear-gradient(135deg, rgba(0,166,166,0.9) 0%, rgba(10,42,90,0.95) 100%)'
                : 'rgba(155, 93, 229, 0.15)',
              border: m.sender === "user"
                ? '1px solid rgba(0,166,166,0.4)'
                : '2px solid rgba(155, 93, 229, 0.5)',
              color: '#fff',
              maxWidth: '90%',
              alignSelf: m.sender === "user" ? 'flex-end' : 'flex-start',
              wordWrap: 'break-word',
              fontSize: '13px',
              lineHeight: '1.6',
              boxShadow: m.sender === "user"
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 2px 8px rgba(155, 93, 229, 0.2)'
            }}
          >
            {m.sender === "ai" && (
              <div style={{
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#9b5de5',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                NORA AI
              </div>
            )}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div style={{ 
            color: '#9b5de5', 
            fontSize: '13px', 
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              border: '2px solid rgba(155, 93, 229, 0.3)',
              borderTop: '2px solid #9b5de5',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            NORA AI is thinking...
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Input container */}
      <div 
        style={{
          display: 'flex',
          padding: '12px 0 0 0',
          gap: '8px'
        }}
      >
        <input
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: '10px',
            border: '2px solid rgba(155, 93, 229, 0.4)',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
            transition: 'all 0.2s'
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              e.preventDefault();
              handleSend();
            }
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '2px solid rgba(155, 93, 229, 0.7)';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '2px solid rgba(155, 93, 229, 0.4)';
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
          }}
          placeholder="Ask about this frame..."
        />
        <button
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            border: '1px solid rgba(155, 93, 229, 0.4)',
            background: loading 
              ? 'rgba(100, 100, 100, 0.5)' 
              : 'linear-gradient(135deg, rgba(155, 93, 229, 0.9) 0%, rgba(100, 50, 180, 0.95) 100%)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.3px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(155, 93, 229, 0.3)',
            minWidth: '70px'
          }}
          onClick={handleSend}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(155, 93, 229, 1) 0%, rgba(120, 60, 200, 1) 100%)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(155, 93, 229, 0.5)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(155, 93, 229, 0.9) 0%, rgba(100, 50, 180, 0.95) 100%)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(155, 93, 229, 0.3)';
            }
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
