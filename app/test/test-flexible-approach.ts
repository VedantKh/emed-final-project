import dotenv from "dotenv";
import { flexibleScenarios } from "../lib/scenarios-flexible";
import { FlexibleConversationManager } from "../lib/conversation-flexible";
import {
  evaluateConversationFlexible,
  generateRealWorldExamples,
} from "../lib/evaluation-flexible";

// Load environment variables
dotenv.config();

/**
 * Test script to demonstrate the flexible prompting approach
 * that leverages LLM knowledge instead of extensive content files
 */
async function testFlexibleApproach() {
  try {
    console.log("FLEXIBLE PROMPTING SYSTEM TEST");
    console.log("===============================");

    // Get API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Select a scenario from the flexible scenarios
    const scenario = flexibleScenarios[0]; // data_breach scenario
    console.log(`Selected scenario: ${scenario.title}`);

    // Optional: Generate and display real-world examples using LLM knowledge
    console.log(
      "\nDynamically generating real-world examples using LLM knowledge..."
    );
    const realWorldExamples = await generateRealWorldExamples(scenario);
    console.log("\nGENERATED REAL-WORLD EXAMPLES:");
    console.log("------------------------------");
    console.log(realWorldExamples);

    // Create conversation manager with the scenario
    const conversationManager = new FlexibleConversationManager(
      apiKey,
      scenario
    );

    // Start the conversation
    console.log("\nStarting conversation...");
    const introResponse = await conversationManager.startConversation();
    console.log("\nCOACH INTRODUCTION:");
    console.log("-------------------");
    console.log(introResponse);

    // Simulate user responses for each question with follow-ups
    const simulatedUserResponses = [
      "I believe in full transparency, so I would immediately disclose the breach to all affected members and regulators within 24 hours. We would provide complete details on what data was exposed and set up a dedicated support line. I think quick and transparent communication is essential to maintain trust, even though it might cause short-term panic.",
      "You raise a good point about the incomplete investigation. I would still notify everyone quickly but clarify that our investigation is ongoing and we'll provide updates as we learn more. I'd rather err on the side of transparency even with incomplete information.",
      "I agree that our legal department might be concerned. I would work with them to ensure our communications are factual while still being comprehensive. We can acknowledge the breach without admitting fault while still taking responsibility for protecting our members going forward.",
      "For remediation, I would provide comprehensive identity protection services for 5 years to all affected members, establish a $20 million compensation fund for those who experience direct financial harm, and hire a top cybersecurity firm to completely rebuild our security infrastructure. We would also create a member advisory board to provide input on our data protection policies.",
      "The cost is significant, but I believe it's warranted given the sensitivity of healthcare data. These measures are necessary to rebuild trust, and the long-term cost of lost trust would be much higher. We'd fund this through our operational reserves and by temporarily reducing our planned expansion projects.",
      "That's a tough but fair question. I take ultimate responsibility as CEO for this breach. I would personally appear at board meetings, shareholder calls, and media interviews to take responsibility without deflecting blame. I would also tie executive compensation, including my own, to successful implementation of our new security measures. If the board determines I should step down based on this incident, I would respect that decision.",
    ];

    // Process simulated conversation
    console.log("\nSimulating conversation...");
    let responseCounter = 0;

    for (const userResponse of simulatedUserResponses) {
      console.log(`\nUSER RESPONSE ${++responseCounter}:`);
      console.log("---------------");
      console.log(userResponse);

      const assistantResponse = await conversationManager.handleUserInput(
        userResponse
      );

      console.log(`\nCOACH RESPONSE ${responseCounter}:`);
      console.log("----------------");
      console.log(assistantResponse);
    }

    // Evaluate the conversation using our flexible evaluation system
    console.log("\nEvaluating conversation...");
    const transcript = conversationManager.getConversationTranscript();
    const evaluation = await evaluateConversationFlexible(transcript, scenario);

    // Display the results
    console.log("\nEVALUATION RESULTS:");
    console.log("-------------------");
    console.log(`Overall Feedback: ${evaluation.overallFeedback}`);

    console.log("\nQUESTION SCORES:");
    evaluation.questionScores.forEach((score, index) => {
      console.log(`\nQuestion ${index + 1}:`);
      console.log(`Ethical Score: ${score.ethical}/10`);
      console.log(`Strategic Score: ${score.strategic}/10`);
      console.log(`Feedback: ${score.feedback}`);
    });

    console.log("\nDEVELOPMENT RECOMMENDATIONS:");
    evaluation.developmentRecommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    console.log("\nREAL-WORLD COMPARISONS:");
    evaluation.realWorldComparisons.forEach((comparison, index) => {
      console.log(`\nComparison ${index + 1}: ${comparison}`);
    });

    console.log("\nTest completed successfully!");
  } catch (error) {
    console.error("Error in flexible approach test:", error);
  }
}

// Run the test
testFlexibleApproach();
