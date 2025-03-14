import { ScenarioId } from "./scenarios";
import { OpenAI } from "openai";

// Types for structured evaluation response
export interface EvaluationScore {
  ethical: number;
  strategic: number;
  feedback: string;
}

export interface EvaluationResult {
  scenarioId: ScenarioId;
  overallFeedback: string;
  questionScores: EvaluationScore[];
  realWorldComparisons: string[];
}

/**
 * Constructs an enhanced evaluation prompt for the o3 mini model
 */
export function constructEvaluationPrompt(
  transcriptText: string,
  rubric: string,
  examples: string,
  realWorldExamples: string
): string {
  // Enhanced prompt template with more specific instructions
  const prompt = `
# CEO Crisis Evaluation Task

## Conversation Transcript
${transcriptText}

## Evaluation Rubric
${rubric}

## Example Answers for Reference
${examples}

## Real-World CEO Responses
${realWorldExamples}

# Evaluation Instructions

You are an expert in healthcare executive leadership evaluation with extensive experience analyzing CEO crisis responses. Please evaluate the transcript above containing a CEO's responses to three challenging questions in a healthcare crisis scenario.

For EACH of the three main questions in the transcript:

1. Identify the question and the CEO's response
2. Score the response on the ETHICAL dimension (1-10) based on the rubric
3. Score the response on the STRATEGIC dimension (1-10) based on the rubric
4. Provide specific feedback explaining the strengths and weaknesses of the response, justifying your scores
5. Compare the CEO's approach to the relevant real-world example

Finally, provide an overall assessment summarizing:
- The CEO's key strengths and areas for improvement
- Patterns in their ethical and strategic thinking
- Specific recommendations for development

Format your response in the following structured way:

## Question 1: [Question text]
**Ethical Score:** [1-10]
**Strategic Score:** [1-10]
**Feedback:** [Detailed feedback]
**Real-World Comparison:** [Comparison to real example]

## Question 2: [Question text]
**Ethical Score:** [1-10]
**Strategic Score:** [1-10]
**Feedback:** [Detailed feedback]
**Real-World Comparison:** [Comparison to real example]

## Question 3: [Question text]
**Ethical Score:** [1-10]
**Strategic Score:** [1-10]
**Feedback:** [Detailed feedback]
**Real-World Comparison:** [Comparison to real example]

## Overall Assessment
[Overall feedback and recommendations]
`;

  return prompt;
}

/**
 * Parses the evaluation response from OpenAI into a structured format
 */
export function parseEvaluationResponse(responseText: string): EvaluationResult | null {
  try {
    console.log("Raw response to parse:", responseText);
    
    // Extract question scores using more flexible regex
    // This pattern is more forgiving with whitespace and formatting variations
    const questionScores: EvaluationScore[] = [];
    const realWorldComparisons: string[] = [];
    
    // First try to split by questions
    const questionSections = responseText.split(/## Question \d+:/g).filter(Boolean);
    
    if (questionSections.length === 0) {
      // Fallback approach - try to find scores directly
      const ethicalScores = responseText.match(/\*\*Ethical Score:\*\*\s*(\d+)/g);
      const strategicScores = responseText.match(/\*\*Strategic Score:\*\*\s*(\d+)/g);
      
      if (ethicalScores && strategicScores && ethicalScores.length > 0) {
        // We found some scores, let's extract what we can
        for (let i = 0; i < Math.min(ethicalScores.length, strategicScores.length); i++) {
          const ethical = parseInt(ethicalScores[i].match(/(\d+)/)[1], 10);
          const strategic = parseInt(strategicScores[i].match(/(\d+)/)[1], 10);
          
          // Extract nearby feedback if possible, or use placeholder
          const feedbackStartIndex = responseText.indexOf(strategicScores[i]) + strategicScores[i].length;
          const feedbackEndIndex = i < ethicalScores.length - 1 ? 
            responseText.indexOf(ethicalScores[i+1], feedbackStartIndex) : 
            responseText.length;
          
          const sectionText = responseText.substring(feedbackStartIndex, feedbackEndIndex);
          
          // Try to find feedback and comparison in this section
          const feedbackMatch = sectionText.match(/\*\*Feedback:\*\*([\s\S]*?)(?=\*\*|$)/);
          const comparisonMatch = sectionText.match(/\*\*Real-World Comparison:\*\*([\s\S]*?)(?=\*\*|$)/);
          
          const feedback = feedbackMatch ? feedbackMatch[1].trim() : "Extracted feedback not available";
          const comparison = comparisonMatch ? comparisonMatch[1].trim() : "Extracted comparison not available";
          
          questionScores.push({ ethical, strategic, feedback });
          realWorldComparisons.push(comparison);
        }
      }
    } else {
      // Process each question section
      for (const section of questionSections) {
        const ethicalMatch = section.match(/\*\*Ethical Score:\*\*\s*(\d+)/);
        const strategicMatch = section.match(/\*\*Strategic Score:\*\*\s*(\d+)/);
        
        if (ethicalMatch && strategicMatch) {
          const ethical = parseInt(ethicalMatch[1], 10);
          const strategic = parseInt(strategicMatch[1], 10);
          
          // Extract feedback
          const feedbackMatch = section.match(/\*\*Feedback:\*\*([\s\S]*?)(?=\*\*Real-World|$)/);
          const feedback = feedbackMatch ? feedbackMatch[1].trim() : "Feedback not found";
          
          // Extract real-world comparison
          const comparisonMatch = section.match(/\*\*Real-World Comparison:\*\*([\s\S]*?)(?=##|$)/);
          const comparison = comparisonMatch ? comparisonMatch[1].trim() : "Comparison not found";
          
          questionScores.push({ ethical, strategic, feedback });
          realWorldComparisons.push(comparison);
        }
      }
    }
    
    // Extract overall assessment with a more flexible pattern
    let overallFeedback = "No overall assessment provided";
    const overallMatch = responseText.match(/## Overall Assessment([\s\S]+)(?=$)/);
    if (overallMatch) {
      overallFeedback = overallMatch[1].trim();
    }
    
    // If we still have no scores, try one more fallback approach
    if (questionScores.length === 0) {
      console.error("Failed to parse with primary and secondary methods. Response format:", responseText);
      
      // Create a minimal result with what we can find
      const ethicalScoreMatch = responseText.match(/ethical.*?(\d+)/i);
      const strategicScoreMatch = responseText.match(/strategic.*?(\d+)/i);
      
      if (ethicalScoreMatch && strategicScoreMatch) {
        questionScores.push({
          ethical: parseInt(ethicalScoreMatch[1], 10),
          strategic: parseInt(strategicScoreMatch[1], 10),
          feedback: "Unable to extract detailed feedback"
        });
        realWorldComparisons.push("Unable to extract real-world comparison");
      } else {
        throw new Error("Failed to parse question scores from response");
      }
    }
    
    console.log("Parsed scores:", questionScores);
    console.log("Parsed comparisons:", realWorldComparisons);
    
    return {
      scenarioId: "pharma_pricing" as ScenarioId, // This will be replaced with actual scenarioId in the API route
      overallFeedback,
      questionScores,
      realWorldComparisons
    };
  } catch (error) {
    console.error("Error parsing evaluation response:", error);
    return null;
  }
}

/**
 * Calls OpenAI API with o3 mini to evaluate the conversation
 */
export async function evaluateConversation(
  prompt: string,
  scenarioId: ScenarioId
): Promise<EvaluationResult | null> {
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call the API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using gpt-3.5-turbo as a stand-in for o3-mini since it's not yet available
      messages: [
        {
          role: "system",
          content: "You are an expert in healthcare executive leadership evaluation."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2500
    });

    // Extract content from response
    const responseText = response.choices[0].message.content || "";
    
    // Parse the response
    const result = parseEvaluationResponse(responseText);
    
    // Set the scenario ID
    if (result) {
      result.scenarioId = scenarioId;
    }
    
    return result;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return null;
  }
}
