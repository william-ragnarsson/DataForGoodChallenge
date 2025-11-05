import React, { useState } from "react";
import { askAI } from "./openai";
import dummyData from "../assets/json-files/dummy-file.json";

interface Message {
  sender: "user" | "ai";
  text: string;
}

const ChatBot: React.FC = () => {
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

    // combine user input with the dummy JSON context so the AI always receives annotations
    const contextStr = JSON.stringify(dummyData, null, 2);
    const combinedMessage = `Context (annotations):\n${contextStr}\n\nUser question:\n${text}`;

    try {
      const aiResponse = await askAI(combinedMessage);
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
        border: '2px solid rgba(155, 93, 229, 0.3)',
        borderRadius: '12px',
        backgroundColor: '#0a0a0a',
        overflow: 'hidden'
      }}
    >
      {/* Messages container */}
      <div 
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: m.sender === "user" ? 'rgba(59, 130, 246, 0.9)' : 'rgba(155, 93, 229, 0.2)',
              color: '#fff',
              maxWidth: '85%',
              alignSelf: m.sender === "user" ? 'flex-end' : 'flex-start',
              wordWrap: 'break-word',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <p style={{ color: '#9b5de5', fontSize: '14px', padding: '8px' }}>
            AI is aan het typen...
          </p>
        )}
      </div>

      {/* Input container */}
      <div 
        style={{
          display: 'flex',
          padding: '16px',
          borderTop: '2px solid rgba(155, 93, 229, 0.3)',
          backgroundColor: '#1a1a1a',
          gap: '8px'
        }}
      >
        <input
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '8px',
            border: '2px solid rgba(155, 93, 229, 0.4)',
            backgroundColor: '#0a0a0a',
            color: '#fff',
            fontSize: '14px',
            outline: 'none'
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !loading) {
              handleSend();
            }
          }}
          placeholder="Typ je bericht..."
        />
        <button
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: loading ? '#555' : 'rgba(155, 93, 229, 0.9)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
          onClick={handleSend}
          disabled={loading}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'rgba(155, 93, 229, 1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = 'rgba(155, 93, 229, 0.9)';
            }
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
