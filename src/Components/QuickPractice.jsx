// src/Components/QuickPractice.jsx
import React, { useState, useRef, useEffect } from "react";
import DashboardNavbar from "./DashboardNavbar";
import { Mic, StopCircle, Play, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * QuickPractice page:
 * - job role input -> generate questions (from sample array)
 * - show current question
 * - choose response mode: Text / Audio
 * - audio recording using MediaRecorder (browser)
 * - save answers (text or audio blob)
 * - navigate questions
 *
 * Replace sampleQuestions with server-provided dataset when ready.
 */

const sampleQuestions = [
  // GATE/CS fundamentals style sample questions (short versions)
  { id: 1, topic: "DSA", text: "Explain the difference between an array and a linked list." },
  { id: 2, topic: "DSA", text: "What is the time complexity of binary search? Explain why." },
  { id: 3, topic: "Algorithms", text: "Describe quicksort and its average/worst case complexities." },
  { id: 4, topic: "OS", text: "What is a race condition? How can it be prevented?" },
  { id: 5, topic: "DBMS", text: "Explain normalization and why it's important." },
  { id: 6, topic: "CN", text: "Explain the TCP three-way handshake." },
  { id: 7, topic: "TOC", text: "What is the difference between DFA and NFA?" },
  { id: 8, topic: "Compilers", text: "What is lexical analysis in compiler design?" },
  { id: 9, topic: "OS", text: "What is virtual memory? How does paging work?" },
  { id: 10, topic: "DBMS", text: "What is an index in databases? Types of indexing?" },
  { id: 11, topic: "CN", text: "What is DNS? How does it resolve domain names?" },
  { id: 12, topic: "Algorithms", text: "Explain dynamic programming vs divide-and-conquer." },
  { id: 13, topic: "DSA", text: "When to prefer a heap over a balanced BST?" },
  { id: 14, topic: "Security", text: "What is symmetric vs asymmetric encryption?" },
  { id: 15, topic: "AI/ML", text: "Explain the bias-variance tradeoff briefly." }
];

const QuickPractice = () => {
  // Setup
  const [jobRole, setJobRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Response mode: 'text' or 'audio'
  const [mode, setMode] = useState("text");

  // Text answer state
  const [answerText, setAnswerText] = useState("");

  // Audio recording state
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  const timerRef = useRef(null);
  const [chunks, setChunks] = useState([]);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  // Saved answers
  const [answers, setAnswers] = useState([]); // { qId, type: 'text'|'audio', text?, blob?, url? }

  // UI messages
  const [message, setMessage] = useState("");

  // Generate questions based on jobRole (simple keyword match + random)
  const generateQuestions = () => {
    setMessage("");
    // Lowercase jobRole for matching
    const role = jobRole.toLowerCase();
    // Simple filter: pick questions whose text/topic contains keywords
    const matched = sampleQuestions.filter(q => {
      if (!role) return false;
      if (role.includes("software") || role.includes("engineer") || role.includes("developer")) {
        return q.topic === "DSA" || q.topic === "Algorithms" || q.topic === "Compilers";
      }
      if (role.includes("data") || role.includes("scientist") || role.includes("ml")) {
        return q.topic === "AI/ML" || q.topic === "Algorithms" || q.topic === "DSA";
      }
      if (role.includes("network") || role.includes("networking")) {
        return q.topic === "CN";
      }
      if (role.includes("db") || role.includes("database") || role.includes("sql")) {
        return q.topic === "DBMS";
      }
      // fallback: mix of core CS fundamentals
      return true;
    });

    // If matched has few items, fallback to sampling from full array
    const pool = matched.length >= 5 ? matched : sampleQuestions;
    // shuffle and select 6 questions
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 6);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setAnswerText("");
    setAudioURL(null);
    setAudioBlob(null);
    setMessage(`Generated ${selected.length} questions for "${jobRole || "General CS"}".`);
  };

  // Recording functions
  const startRecording = async () => {
    setMessage("");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMessage("Audio recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      setChunks([]);
      mr.ondataavailable = (e) => setChunks(prev => prev.concat(e.data));
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioURL(url);
        // stop tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
      };
      mr.start();
      setRecording(true);
      setRecSecs(0);
      timerRef.current = setInterval(() => setRecSecs(s => s + 1), 1000);
    } catch (err) {
      console.error(err);
      setMessage("Permission denied or audio device unavailable.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Save current answer (text or audio)
  const saveAnswer = () => {
    const q = questions[currentIndex];
    if (!q) return;
    if (mode === "text") {
      if (!answerText.trim()) {
        setMessage("Please type your answer before saving.");
        return;
      }
      setAnswers(prev => [...prev, { qId: q.id, type: "text", text: answerText.trim() }]);
      setAnswerText("");
      setMessage("Text answer saved.");
    } else {
      // audio
      if (!audioBlob) {
        setMessage("No audio recorded yet.");
        return;
      }
      setAnswers(prev => [...prev, { qId: q.id, type: "audio", blob: audioBlob, url: audioURL }]);
      setAudioBlob(null);
      setAudioURL(null);
      setMessage("Audio answer saved.");
    }
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setAnswerText("");
      setAudioURL(null);
      setAudioBlob(null);
      setMessage("");
    } else {
      setMessage("End of questions. You can regenerate or review your answers.");
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setAnswerText("");
      setAudioURL(null);
      setAudioBlob(null);
      setMessage("");
    }
  };

  const regenerate = () => {
    generateQuestions();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNavbar userName="John" />

      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quick Practice</h1>
            <p className="text-sm text-gray-600">Short focused sessions tailored for CS freshers.</p>
          </div>
          <div>
            <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">← Back to Dashboard</Link>
          </div>
        </div>

        {/* Setup Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h3 className="text-sm font-semibold text-blue-500 mb-2">Quick Practice Setup</h3>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 font-medium">What job are you preparing for?</label>
              <input
                placeholder='e.g. "Software Engineer, Product Manager, Data Scientist"'
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={generateQuestions}
                className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:opacity-95"
              >
                Generate Interview Questions
              </button>
              <button
                onClick={regenerate}
                title="Regenerate"
                className="px-3 py-3 bg-white border rounded-lg flex items-center gap-2 hover:shadow"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" /> Regenerate
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Questions are sampled from core Computer Science fundamentals (GATE-style).</p>
        </div>

        {/* Interview Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-500 mb-1">Interview Question</h3>
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                {questions.length ? `${currentIndex + 1}. ${questions[currentIndex].text}` : "No questions generated yet."}
              </h2>
              <p className="text-sm text-gray-600 mb-4">Take a moment to think about your answer, then record or type it below.</p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500">Questions: <span className="font-semibold">{questions.length}</span></p>
              <p className="text-xs text-gray-500">Saved answers: <span className="font-semibold">{answers.length}</span></p>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setMode("text")}
              className={`px-3 py-1 rounded-full ${mode === "text" ? "bg-blue-600 text-white" : "bg-white border"}`}
            >
              Text Answer
            </button>
            <button
              onClick={() => setMode("audio")}
              className={`px-3 py-1 rounded-full ${mode === "audio" ? "bg-blue-600 text-white" : "bg-white border"}`}
            >
              Audio Answer
            </button>
          </div>

          {/* Response Area */}
          {mode === "text" ? (
            <div>
              <textarea
                placeholder="Type your answer here..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                rows={6}
                className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex items-center gap-3">
                <button onClick={saveAnswer} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Answer</button>
                <button onClick={goPrev} className="px-3 py-2 bg-white border rounded-lg">Prev</button>
                <button onClick={goNext} className="px-3 py-2 bg-white border rounded-lg">Next</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  {!recording ? (
                    <button onClick={startRecording} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg">
                      <Mic className="w-4 h-4" /> Start Recording
                    </button>
                  ) : (
                    <button onClick={stopRecording} className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg">
                      <StopCircle className="w-4 h-4" /> Stop
                    </button>
                  )}
                  <div className="text-sm text-gray-600"> {recording ? `Recording • ${recSecs}s` : audioURL ? "Recording ready" : "Not recorded"}</div>
                </div>

                <div className="flex items-center gap-2">
                  {audioURL && (
                    <audio controls src={audioURL} className="outline-none" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={saveAnswer} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Audio Answer</button>
                <button onClick={goPrev} className="px-3 py-2 bg-white border rounded-lg">Prev</button>
                <button onClick={goNext} className="px-3 py-2 bg-white border rounded-lg">Next</button>
              </div>
            </div>
          )}

        </div>

        {/* Saved Answers / Review */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Saved Answers</h3>
          {answers.length === 0 ? (
            <p className="text-sm text-gray-500">You have not saved any answers yet.</p>
          ) : (
            <div className="grid gap-3">
              {answers.map((a, idx) => (
                <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Q {idx + 1}: {sampleQuestions.find(q => q.id === a.qId)?.text || "Question"}</p>
                    <p className="text-xs text-gray-600">{a.type === "text" ? a.text.slice(0, 120) + (a.text.length > 120 ? "..." : "") : "Audio answer"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.type === "audio" && a.url && (
                      <audio controls src={a.url} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer quick tips */}
        <div className="text-sm text-gray-600">
          <p className="mb-2">Tips: Focus on clarity and structure. For technical answers, mention approach, complexity, and trade-offs.</p>
          <p className="text-gray-500">Note: This page uses a local sample dataset of CS fundamentals. In the final version, questions will be drawn from a curated GATE-style dataset and tailored using your uploaded resume.</p>
        </div>
      </div>
    </div>
  );
};

export default QuickPractice;

