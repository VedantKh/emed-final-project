import { NextRequest, NextResponse } from "next/server";
import { evaluateConversationFlexible } from "@/app/lib/evaluation-flexible";
import { flexibleScenarios } from "@/app/lib/scenarios-flexible";
import { conversationState } from "@/app/lib/conversation-state";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get the active conversation from shared state
    const activeConversation = conversationState.getConversation();

    // Check if we have an active conversation
    if (!activeConversation) {
      return NextResponse.json(
        {
          error:
            "No active conversation to evaluate. Please start a new conversation first.",
        },
        { status: 400 }
      );
    }

    // Check if the conversation is complete
    if (!activeConversation.isComplete()) {
      return NextResponse.json(
        {
          error:
            "Conversation is not yet complete. Please finish all questions before evaluating.",
        },
        { status: 400 }
      );
    }

    // Get the conversation transcript
    const transcript = activeConversation.getConversationTranscript();

    // Get the scenario ID from the active conversation
    const scenarioId = activeConversation
      .getConversationHistory()[0]
      ?.content.includes("data_breach")
      ? "data_breach"
      : activeConversation
          .getConversationHistory()[0]
          ?.content.includes("pandemic_response")
      ? "pandemic_response"
      : "pharma_pricing";

    // Find the scenario
    const scenario =
      flexibleScenarios.find((s) => s.id === scenarioId) ||
      flexibleScenarios[0];

    // Evaluate the conversation
    const evaluation = await evaluateConversationFlexible(transcript, scenario);

    return NextResponse.json({
      status: "success",
      evaluation,
    });
  } catch (error) {
    console.error("Error evaluating conversation:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to evaluate conversation" },
      { status: 500 }
    );
  }
}
