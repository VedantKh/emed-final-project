import { NextRequest, NextResponse } from "next/server";
import { flexibleScenarios } from "@/app/lib/scenarios-flexible";
import { FlexibleConversationManager } from "@/app/lib/conversation-flexible";
import { conversationState } from "@/app/lib/conversation-state";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { scenarioId } = body;

    // Default to the first scenario if not specified
    const selectedScenarioId = scenarioId || "data_breach";

    // Find the scenario
    const scenario =
      flexibleScenarios.find((s) => s.id === selectedScenarioId) ||
      flexibleScenarios[0];

    // Get OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }

    // Initialize the conversation manager
    const conversation = new FlexibleConversationManager(apiKey, scenario);

    // Store in shared state
    conversationState.setConversation(conversation);

    // Start the conversation
    const initialMessage = await conversation.startConversation();

    return NextResponse.json({
      status: "success",
      message: initialMessage,
    });
  } catch (error) {
    console.error("Error starting conversation:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to start conversation" },
      { status: 500 }
    );
  }
}
