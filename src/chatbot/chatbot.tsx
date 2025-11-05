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
    <div className="flex flex-col w-full max-w-md mx-auto p-4 border rounded-2xl shadow-lg">

      <div className="flex-1 overflow-y-auto h-80 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg ${
              m.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <p className="text-gray-500">AI is aan het typen...</p>}
      </div>

      <div className="flex mt-4">
        <input
          className="flex-1 border rounded-l-lg p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Typ je bericht..."
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r-lg"
          onClick={handleSend}
          disabled={loading}
        >
          Verstuur
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
