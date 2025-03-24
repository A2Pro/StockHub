'use client';

import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled
const Navbar = dynamic(() => import('../components/navbar.js'), {
  ssr: false
});

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isClient, setIsClient] = useState(false);

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Scroll to the bottom of the chat whenever messages update
  // Only run on client-side
  useEffect(() => {
    if (isClient && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isClient]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    // Add the user's message to the chat
    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send the question to the backend
      const response = await fetch(`http://localhost:9284/answer_question/${encodeURIComponent(input)}`);
      const data = await response.text(); // Use text() first to avoid JSON parse errors

      // Try to parse as JSON, fallback to string
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        parsedData = data;
      }

      // Add the bot's response to the chat
      const botMessage = { role: "bot", content: parsedData };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = { role: "bot", content: "Sorry, something went wrong. Please try again." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Return loading placeholder during server rendering
  if (!isClient) {
    return (
      <div className="flex h-screen bg-white text-black items-center justify-center">
        <div className="text-xl">Loading chat interface...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar - Changed from bg-gray-800 to bg-white */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <Navbar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <h1 className="text-xl font-bold text-gray-800">Talk to the Market</h1>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3/4 p-4 rounded-lg ${
                  message.role === "user"
                    ? "bg-indigo-500 text-white"
                    : "bg-indigo-500 text-white"
                }`}
              >
                {typeof message.content === 'string' 
                  ? message.content 
                  : JSON.stringify(message.content)}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Type your message..."
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}