import { OpenAI } from "openai";
import { FlexibleScenario } from "./scenarios-flexible";

// Types for structured evaluation response
export interface EvaluationScore {
  ethical: number;
  strategic: number;
  feedback: string;
}

export interface EvaluationResult {
  scenarioId: string;
  overallFeedback: string;
  questionScores: EvaluationScore[];
  realWorldComparisons: string[];
  developmentRecommendations: string[];
}

/**
 * Creates an accessible evaluation prompt that uses simpler language
 */
export function constructFlexibleEvaluationPrompt(
  transcriptText: string,
  scenario: FlexibleScenario
): string {
  // Create a more accessible prompt with simplified language
  const prompt = `
# Healthcare Leadership Decision Evaluation

## Conversation Transcript
${transcriptText}

## Situation Overview
${scenario.title}: ${scenario.contextParams.incidentType}

## Main Questions Discussed
${scenario.decisionPoints
  .map((dp, i) => `${i + 1}. ${dp.topic}: ${dp.mainQuestion}`)
  .join("\n")}

## What Makes a Good Answer

### Doing What's Right (Ethical Considerations)
${scenario.evaluationCriteria.ethical
  .map((criteria) => `- ${criteria}`)
  .join("\n")}

### Making Smart Business Decisions (Strategic Considerations)
${scenario.evaluationCriteria.strategic
  .map((criteria) => `- ${criteria}`)
  .join("\n")}

# Your Evaluation Task

You're going to evaluate how someone did in a role-play exercise where they pretended to be a healthcare company CEO facing a challenging situation.

For each of the main questions:
1. Give a score from 1-10 for how ethical their answer was (how well they considered what's right for people)
2. Give a score from 1-10 for how strategic their answer was (how smart their business thinking was)
3. Give friendly, specific feedback about what they did well and what they could improve
4. Share a brief, real-world example of how an actual healthcare CEO handled a similar situation

End with overall feedback, helpful tips for improvement, and the main strengths you noticed.

Use straightforward, conversational language that a high school student would understand. Avoid complicated business jargon. Focus on making your feedback helpful and educational.
`;

  return prompt;
}

/**
 * Evaluates a conversation using accessible language
 */
export async function evaluateConversationFlexible(
  transcriptText: string,
  scenario: FlexibleScenario
): Promise<EvaluationResult> {
  const openai = new OpenAI();

  // Create the accessible evaluation prompt
  const prompt = constructFlexibleEvaluationPrompt(transcriptText, scenario);

  // First pass: Get comprehensive evaluation with simplified language
  const evaluationResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2500,
    temperature: 0.7,
  });

  const evaluationText = evaluationResponse.choices[0].message.content || "";

  // Second pass: Ask the model to structure its output in an accessible way
  const structuringPrompt = `
    Based on your friendly evaluation:
    
    ${evaluationText}
    
    Please organize your evaluation into a simple JSON format that looks like this:
    
    {
      "scenarioId": "${scenario.id}",
      "overallFeedback": "A friendly summary of how they did overall",
      "questionScores": [
        {
          "question": "The first main question they answered",
          "ethical": 7, // a score from 1-10 for how ethical their answer was
          "strategic": 8, // a score from 1-10 for how strategic their answer was
          "feedback": "Specific, friendly feedback on this answer"
        },
        // repeat for each question
      ],
      "realWorldComparisons": [
        "A simple comparison to how a real healthcare CEO handled something similar",
        // additional comparisons
      ],
      "developmentRecommendations": [
        "A friendly tip for how they could improve next time",
        // additional recommendations
      ]
    }
    
    Make sure your JSON is properly formatted, and keep all the text inside it conversational and easy to understand.
  `;

  const structuredResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "user", content: prompt },
      { role: "assistant", content: evaluationText },
      { role: "user", content: structuringPrompt },
    ],
    max_tokens: 1500,
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  try {
    // Parse the structured JSON response
    return JSON.parse(
      structuredResponse.choices[0].message.content || "{}"
    ) as EvaluationResult;
  } catch (error) {
    console.error("Failed to parse structured evaluation:", error);

    // Fallback: Return a basic structure with the raw evaluation
    return {
      scenarioId: scenario.id,
      overallFeedback: evaluationText.substring(0, 500) + "...",
      questionScores: [],
      realWorldComparisons: [],
      developmentRecommendations: [],
    };
  }
}

/**
 * Generates real-world examples using accessible language
 */
export async function generateRealWorldExamples(
  scenario: FlexibleScenario
): Promise<string> {
  const openai = new OpenAI();

  const prompt = `
    You're helping create educational content for high school students who are learning about leadership and decision-making.
    
    Please share 3-4 short, interesting real-world examples of how actual healthcare company leaders handled situations similar to:
    
    "${scenario.title}: ${scenario.contextParams.incidentType}"
    
    For each example:
    1. Name the real person and their company
    2. Briefly explain the similar situation they faced (when it happened, what the problem was)
    3. Tell what they decided to do about it
    4. Share how things turned out - both good and bad results
    
    Focus on examples related to these decision areas:
    ${scenario.decisionPoints.map((dp) => `- ${dp.topic}`).join("\n")}
    
    Include both successful and unsuccessful examples if possible. Use clear, conversational language that a high school student would understand - avoid complicated business terms and jargon.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 1500,
    temperature: 0.7,
  });

  return completion.choices[0].message.content || "";
}
