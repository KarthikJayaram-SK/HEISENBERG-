import React, { useState, useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

/* 
 🧠 SIMULATED RAG (Retrieval-Augmented Generation)
 This chatbot mimics the process:
  1. Vectorize NCC knowledge (here we use simple word-matching for demo)
  2. Retrieve similar text chunks from knowledgeBase
  3. Generate a natural response
*/

// Dummy "Knowledge Base" simulating vector storage (replace with Firestore or external embeddings later)
const knowledgeBase = [
  {
    question: "what is ncc",
    answer:
      "NCC stands for National Cadet Corps. It is a youth organization that trains students in discipline, leadership, and patriotism.",
  },
  {
    question: "ncc motto",
    answer: "The motto of NCC is 'Unity and Discipline'.",
  },
  {
    question: "who can join ncc",
    answer:
      "Students from schools and colleges can join NCC voluntarily if their institution has an NCC unit.",
  },
  {
    question: "benefits of ncc",
    answer:
      "NCC helps develop leadership, teamwork, physical fitness, and discipline. It also provides opportunities to attend camps and parades.",
  },
  {
    question: "what are the ncc wings",
    answer:
      "NCC has three wings: Army, Navy, and Air Force. Each provides training related to its service.",
  },
  {
    question: "ncc camps",
    answer:
      "Cadets can attend various camps such as Annual Training Camp (ATC), Republic Day Camp (RDC), and National Integration Camp (NIC).",
  },
  {
    question: "ncc certificate",
    answer:
      "Cadets can earn A, B, and C certificates based on their level of training and exams passed.",
  },
];

/* 
🧮 Simple vector-like retrieval — uses keyword similarity.
In real RAG: you'd convert text into embeddings and search via cosine similarity.
*/
const retrieveAnswer = (input) => {
  const lower = input.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;
    const words = item.question.split(" ");
    for (const word of words) {
      if (lower.includes(word)) score++;
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch) return bestMatch.answer;
  return "I'm not sure about that. Try asking something else about NCC 😊";
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hello! I'm your NCC Assistant. Ask me anything about NCC!",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    const botResponse = { sender: "bot", text: retrieveAnswer(input) };
    setMessages((prev) => [...prev, userMessage, botResponse]);
    setInput("");
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          backgroundColor: "#1E40AF",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          cursor: "pointer",
          zIndex: 9999,
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
      >
        <FaRobot size={28} />
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "95px",
            right: "25px",
            width: "340px",
            height: "450px",
            backgroundColor: "#fff",
            borderRadius: "12px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <div
            style={{
              backgroundColor: "#1E40AF",
              color: "#fff",
              padding: "12px",
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: "0.5px",
            }}
          >
            NCC Assistant 🤖
          </div>

          <div
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              background: "#f3f4f6",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    backgroundColor:
                      msg.sender === "user" ? "#1E40AF" : "#E5E7EB",
                    color: msg.sender === "user" ? "white" : "#111827",
                    padding: "10px 14px",
                    borderRadius: "18px",
                    maxWidth: "80%",
                    fontSize: "14px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              display: "flex",
              borderTop: "1px solid #e5e7eb",
              padding: "8px",
              background: "#fff",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your question..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "10px",
                fontSize: "14px",
                background: "#f9fafb",
                borderRadius: "8px",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                background: "#1E40AF",
                border: "none",
                color: "#fff",
                padding: "10px",
                borderRadius: "8px",
                marginLeft: "6px",
                cursor: "pointer",
              }}
            >
              <IoMdSend size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
