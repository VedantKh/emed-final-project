"use client";
import { useState } from "react";
import { scenarios } from "./lib/scenarios";

export default function Home() {
  const [scenarioId, setScenarioId] = useState("data_breach");
  const [transcript, setTranscript] = useState("");
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEvaluate = async () => {
    if (!transcript) {
      setError("Please enter a transcript");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcriptText: transcript,
          scenarioId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to evaluate");
      }

      setEvaluationResult(result);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">CEO Crisis Evaluation Test</h1>

      <div className="w-full space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Scenario
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={scenarioId}
            onChange={(e) => setScenarioId(e.target.value)}
          >
            {scenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Conversation Transcript
          </label>
          <textarea
            className="w-full h-64 p-2 border border-gray-300 rounded"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Enter the conversation transcript here..."
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleEvaluate}
          disabled={loading}
        >
          {loading ? "Evaluating..." : "Evaluate Response"}
        </button>

        {error && (
          <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>
        )}

        {evaluationResult && (
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Evaluation Result</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(evaluationResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  );
}
