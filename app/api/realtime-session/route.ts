import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Get API key from server environment
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured on server" },
        { status: 500 }
      );
    }

    // Create a session via the OpenAI REST API
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview",
        voice: "alloy"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Failed to create realtime session: ${errorData.error?.message || response.statusText}` },
        { status: response.status }
      );
    }

    const sessionData = await response.json();
    return NextResponse.json(sessionData);
  } catch (error) {
    console.error("Error creating realtime session:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create realtime session" },
      { status: 500 }
    );
  }
} 