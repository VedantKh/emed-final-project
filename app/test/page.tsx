"use client";
import { useState } from "react";
import { scenarios } from "../lib/scenarios";

// Sample CEO response transcript for testing
const sampleTranscript = `
Interviewer: How would you approach the timing and extent of disclosure about the data breach to affected members, regulators, and the public?

CEO: I would implement an accelerated disclosure strategy prioritizing member protection and transparency. We'll notify all affected members within 15 days through multiple channels including email, express mail, and phone calls. Our notification will include specific details about what was compromised and immediate protective actions.

Interviewer: How do you balance the need for a complete investigation with the urgency of notifying affected individuals about potential identity theft risks?

CEO: While a complete investigation is important, the urgency of protecting our members from identity theft takes precedence. We won't wait for a complete investigation before notifying members about the breach.
`;

interface EvaluationResult {
  // Add specific fields based on your API response structure
  [key: string]: unknown; // Temporary type until we know the exact structure
}

export default function TestPage() {
  const [scenarioId, setScenarioId] = useState("data_breach");
  const [transcript, setTranscript] = useState(
    `Interviewer: What is your strategy for telehealth expansion during this crisis?

CEO: I would implement a three-pronged approach. First, we'll immediately invest in scaling our infrastructure by partnering with multiple telehealth platforms to create redundancy and expand capacity by 1500%. Second, we'll launch a rapid provider enablement program with dedicated technical support teams, simplified credentialing, and financial incentives for quick adoption. Third, we'll create a digital equity initiative with specialized support for elderly and low-income members, including simplified interfaces and potential device distribution through community partnerships.

Interviewer: How would you balance financial sustainability with member coverage needs?

CEO: I would waive all cost-sharing for COVID-related testing and treatment, removing financial barriers to necessary care during this crisis. For members facing economic hardship, we'll create a COVID Relief Program offering premium payment deferrals, hardship waivers, and simplified transitions to subsidized marketplace plans when appropriate. To manage the financial impact, we'll redirect funds from non-essential capital projects, draw from our reserves while staying above regulatory requirements, and engage with reinsurance partners.

Interviewer: What is your approach to public relations and stakeholder communication?

CEO: I would implement a comprehensive stakeholder communication strategy built on radical transparency, empathetic engagement, and decisive action. We'll publicly acknowledge our current bottom-quartile ranking on the COVID Coverage Scorecard and commit to specific improvements with measurable targets and regular public progress updates. We'll establish tailored communication channels for each stakeholder group and empower our customer service representatives to resolve issues efficiently. Rather than defending past decisions, we'll focus on forward-looking improvements and invite stakeholders to hold us accountable.`
  );
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

      setEvaluationResult(result.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">CEO Evaluation Test Page</h1>

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
            <h2 className="text-xl font-bold mb-4">Evaluation Result</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2">Overall Assessment</h3>
              <div className="bg-white p-3 rounded border">
                {evaluationResult.overallFeedback}
              </div>
            </div>
            
            {evaluationResult.questionScores.map((score: any, index: number) => (
              <div key={index} className="mb-6 border-t pt-4">
                <h3 className="text-lg font-bold mb-2">Question {index + 1}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <span className="font-bold">Ethical Score:</span> {score.ethical}/10
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <span className="font-bold">Strategic Score:</span> {score.strategic}/10
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="font-bold mb-1">Feedback</h4>
                  <div className="bg-white p-3 rounded border">
                    {score.feedback}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-1">Real-World Comparison</h4>
                  <div className="bg-white p-3 rounded border">
                    {evaluationResult.realWorldComparisons[index]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
