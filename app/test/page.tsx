"use client";

import { useState, useEffect, useRef } from "react";
import { FlexibleScenario } from "../lib/scenarios-flexible";
import { flexibleScenarios } from "../lib/scenarios-flexible";
import type { EvaluationResult } from "../lib/evaluation-flexible";
import VoiceInteraction from "../components/VoiceInteraction";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function TestPage() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    flexibleScenarios[0].id
  );
  const [scenario, setScenario] = useState<FlexibleScenario>(
    flexibleScenarios[0]
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effect to update the scenario when selectedScenarioId changes
  useEffect(() => {
    const selected =
      flexibleScenarios.find((s) => s.id === selectedScenarioId) ||
      flexibleScenarios[0];
    setScenario(selected);
  }, [selectedScenarioId]);

  // Initialize conversation when the page loads
  useEffect(() => {
    // No longer auto-starting conversation to allow scenario selection first
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start a new conversation
  const startConversation = async () => {
    setIsInitializing(true);
    setMessages([]);
    setIsComplete(false);
    setEvaluation(null);
    setError(""); // Clear any previous errors

    try {
      const response = await fetch("/api/test/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenarioId: selectedScenarioId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start conversation");
      }

      setMessages([{ role: "assistant", content: data.message }]);
    } catch (error) {
      console.error("Error starting conversation:", error);
      setError(
        (error as Error).message ||
          "Failed to start conversation. Please try again."
      );
    } finally {
      setIsInitializing(false);
    }
  };

  // Handle sending user message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/test/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
      setIsComplete(data.isComplete || false);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(
        (error as Error).message || "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Evaluate the conversation
  const handleEvaluate = async () => {
    if (isEvaluating) return;
    setIsEvaluating(true);

    try {
      const response = await fetch("/api/test/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to evaluate conversation");

      const data = await response.json();
      setEvaluation(data.evaluation);
    } catch (error) {
      console.error("Error evaluating conversation:", error);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Handle transcript updates from voice interaction
  const handleTranscriptUpdate = (transcript: string) => {
    setInput(transcript);
  };

  // Handle voice interaction errors
  const handleVoiceError = (error: string) => {
    setError(error);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">
        Healthcare Leadership Decision Simulator
      </h1>

      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg mb-2">
          <h2 className="font-bold text-lg mb-2">
            Your Challenge: {scenario.title}
          </h2>
          <p className="mb-2">{scenario.contextParams.incidentType}</p>

          {messages.length === 0 && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Select a scenario:</label>
                <select
                  value={selectedScenarioId}
                  onChange={(e) => setSelectedScenarioId(e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  {flexibleScenarios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={startConversation}
                disabled={isInitializing}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isInitializing ? "Getting ready..." : "Start Conversation"}
              </button>
            </>
          )}

          {messages.length > 0 && (
            <button
              onClick={startConversation}
              disabled={isInitializing}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isInitializing ? "Getting ready..." : "Start Over"}
            </button>
          )}
        </div>
      </div>

      {/* Error message display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Chat messages */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 h-[calc(100vh-400px)] overflow-y-auto mb-4">
        {messages.length === 0 && isInitializing ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Setting up your scenario...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Your conversation will appear here</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg max-w-[80%] ${
                message.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
              }`}
            >
              <p className="font-semibold mb-1">
                {message.role === "user" ? "You" : "Leadership Coach"}
              </p>
              <p>{message.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice interaction */}
      {messages.length > 0 && !isComplete && (
        <div className="mb-4">
          <VoiceInteraction
            onTranscriptUpdate={handleTranscriptUpdate}
            onError={handleVoiceError}
          />
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSendMessage} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isInitializing || loading || isComplete}
            placeholder={
              isComplete ? "Exercise complete" : "Type your response here..."
            }
            className="flex-1 p-2 border border-gray-300 rounded disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isInitializing || loading || !input.trim() || isComplete}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>

      {/* Evaluation section */}
      {isComplete && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-bold mb-4">Exercise Complete!</h2>
          {!evaluation ? (
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isEvaluating ? "Looking at your answers..." : "See How You Did"}
            </button>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Your Results</h3>

              <div className="mb-4">
                <h4 className="font-bold">Overall Feedback:</h4>
                <p>{evaluation.overallFeedback}</p>
              </div>

              {evaluation.questionScores?.map((score, i) => (
                <div
                  key={i}
                  className="mb-4 p-3 bg-white rounded-lg border border-gray-200"
                >
                  <h4 className="font-bold">Question {i + 1}</h4>
                  <div className="flex gap-4 mt-2 mb-2">
                    <div className="bg-blue-100 px-3 py-1 rounded">
                      Ethical Score: {score.ethical}/10
                    </div>
                    <div className="bg-green-100 px-3 py-1 rounded">
                      Strategic Score: {score.strategic}/10
                    </div>
                  </div>
                  <p>{score.feedback}</p>
                </div>
              ))}

              {evaluation.developmentRecommendations?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold">Tips for Improvement:</h4>
                  <ul className="list-disc pl-5">
                    {evaluation.developmentRecommendations.map(
                      (rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {evaluation.realWorldComparisons?.length > 0 && (
                <div>
                  <h4 className="font-bold">Real-World Examples:</h4>
                  <ul className="list-disc pl-5">
                    {evaluation.realWorldComparisons.map(
                      (comparison: string, i: number) => (
                        <li key={i}>{comparison}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
