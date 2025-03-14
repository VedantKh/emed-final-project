import { NextRequest, NextResponse } from "next/server";
import { conversationState } from "@/app/lib/conversation-state";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Get the active conversation from shared state
    const activeConversation = conversationState.getConversation();

    // Check if we have an active conversation
    if (!activeConversation) {
      return NextResponse.json(
        {
          error:
            "No active conversation. Please start a new conversation first.",
        },
        { status: 400 }
      );
    }

    // Process the user message
    try {
      const response = await activeConversation.handleUserInput(message);

      // Check if the conversation is complete
      const isComplete = activeConversation.isComplete();

      return NextResponse.json({
        status: "success",
        message: response,
        isComplete,
      });
    } catch (processingError) {
      console.error("Error processing user input:", processingError);
      return NextResponse.json(
        { error: "Failed to process your message. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing message:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to process message" },
      { status: 500 }
    );
  }
}
