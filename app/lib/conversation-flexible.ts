import { OpenAI } from "openai";
import { FlexibleScenario } from "./scenarios-flexible";

interface ConversationState {
  scenarioId: string;
  currentQuestionIndex: number;
  followupCount: number;
  conversationHistory: Array<{
    role: "system" | "assistant" | "user";
    content: string;
  }>;
  hasAskedMainQuestion: boolean;
  isConversationComplete: boolean;
}

/**
 * Manages a conversation with simplified language for accessibility
 */
export class FlexibleConversationManager {
  private openai: OpenAI;
  private scenario: FlexibleScenario;
  private state: ConversationState;

  constructor(apiKey: string, scenario: FlexibleScenario) {
    this.openai = new OpenAI({ apiKey });
    this.scenario = scenario;
    this.state = {
      scenarioId: scenario.id,
      currentQuestionIndex: 0,
      followupCount: 0,
      conversationHistory: [],
      hasAskedMainQuestion: false,
      isConversationComplete: false,
    };

    // Initialize the conversation with a system message
    this.initializeConversation();
  }

  private initializeConversation() {
    // Create a simplified system message that sets the context in accessible language
    const systemMessage = {
      role: "system" as const,
      content: `You're a friendly coach helping someone practice making tough decisions as if they were a healthcare company CEO. The situation they're dealing with is: "${
        this.scenario.title
      }: ${this.scenario.contextParams.incidentType}".

Your job is to ask them questions about what they would do in this challenging situation, follow up based on their answers, and help them think about both the ethical choices (what's right for people) and business choices (what's good for the company).

IMPORTANT CONTEXT:
- They're pretending to run ${this.scenario.contextParams.organizationProfile}
- They're facing a situation where: ${this.scenario.contextParams.incidentType}
- Key facts they need to consider:
  - ${this.scenario.contextParams.criticalFactors.join("\n  - ")}

Be friendly and conversational - like a helpful mentor, not a professor. Talk like you would to a smart high school student.

Here's how your conversation should flow:
1. Start by introducing the situation and asking the first main question
2. Listen to their answer
3. Ask 1-3 follow-up questions to help them think deeper about their choices
4. Once you've had a good discussion, move to the next main question
5. After all questions are covered, wrap up the conversation

Remember to keep your language simple - avoid jargon and complicated terms. Make this an engaging conversation about real-world leadership challenges.`,
    };

    this.state.conversationHistory.push(systemMessage);
  }

  /**
   * Starts the conversation with an accessible introduction
   */
  public async startConversation(): Promise<string> {
    // Create a prompt for the introduction that uses simpler language
    const introductionPrompt = {
      role: "user" as const,
      content: `Hi there! I want you to introduce this decision-making exercise to me.

First, introduce yourself as a friendly coach who's going to help me practice making decisions like a healthcare CEO would.

Briefly explain that I'll be pretending to run ${
        this.scenario.contextParams.organizationProfile
      } and I'm facing this problem: ${this.scenario.contextParams.incidentType}

Include these important facts about the situation (but explain them simply):
- ${this.scenario.contextParams.criticalFactors.join("\n- ")}

Then ask me the first main question: "${
        this.scenario.decisionPoints[0].mainQuestion
      }"

Keep your language friendly and straightforward - like you're talking to a smart high school student. Avoid using complicated business jargon.`,
    };

    this.state.conversationHistory.push(introductionPrompt);

    // Generate the introduction and first question
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: this.state.conversationHistory,
      max_tokens: 800,
      temperature: 0.7,
    });

    const assistantResponse = response.choices[0].message.content || "";

    // Add the assistant's response to the conversation history
    this.state.conversationHistory.push({
      role: "assistant",
      content: assistantResponse,
    });

    this.state.hasAskedMainQuestion = true;

    return assistantResponse;
  }

  /**
   * Processes user input and generates the next assistant response
   */
  public async handleUserInput(userInput: string): Promise<string> {
    // Add the user's message to the conversation history
    this.state.conversationHistory.push({
      role: "user",
      content: userInput,
    });

    // If the conversation is complete, just process normally without any special instructions
    if (this.state.isConversationComplete) {
      return this.generateStandardResponse();
    }

    // Check if we need to move to the next question, ask a follow-up, or conclude
    if (this.state.hasAskedMainQuestion) {
      if (this.state.followupCount < 3) {
        // Ask a follow-up question based on the user's response
        return this.generateFollowupQuestion(userInput);
      } else {
        // Move to the next main question or conclude
        return this.moveToNextQuestionOrConclude();
      }
    } else {
      // Standard response if we're in an undefined state
      return this.generateStandardResponse();
    }
  }

  /**
   * Generates an accessible follow-up question based on the user's response
   */
  private async generateFollowupQuestion(userInput: string): Promise<string> {
    // Create a simplified instruction for generating a follow-up
    const followupInstruction = {
      role: "user" as const,
      content: `Based on what I just said, ask me ONE follow-up question that helps me think deeper about my decision. Make your question focus on one of these areas:

1. How my decision might affect different people (patients, employees, the public)
2. Trade-offs between doing what's right and what's profitable
3. How others might react to my decision
4. Practical challenges that might come up when implementing my idea

Ask a single, clear question directly related to what I just said. Use simple, conversational language that a high school student would understand. Don't summarize my answer - just ask your follow-up question.`,
    };

    // Add this instruction as a separate message
    const messages = [...this.state.conversationHistory, followupInstruction];

    // Generate the follow-up question
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const assistantResponse = response.choices[0].message.content || "";

    // Add only the real assistant response to history (not the instruction)
    this.state.conversationHistory.push({
      role: "assistant",
      content: assistantResponse,
    });

    // Increment follow-up count
    this.state.followupCount++;

    return assistantResponse;
  }

  /**
   * Moves to the next question or concludes the conversation with accessible language
   */
  private async moveToNextQuestionOrConclude(): Promise<string> {
    this.state.currentQuestionIndex++;
    this.state.followupCount = 0;

    // Check if there are more questions
    if (this.state.currentQuestionIndex < this.scenario.decisionPoints.length) {
      // Move to the next question with conversational language
      const nextQuestion =
        this.scenario.decisionPoints[this.state.currentQuestionIndex];

      const transitionInstruction = {
        role: "user" as const,
        content: `Thank me for my thoughts on this topic. Then, in a friendly way, transition to the next main question: "${nextQuestion.mainQuestion}" 

Remember to use simple, conversational language that a high school student would understand.`,
      };

      // Add this instruction temporarily for generation
      const messages = [
        ...this.state.conversationHistory,
        transitionInstruction,
      ];

      // Generate the transition and next question
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 400,
        temperature: 0.7,
      });

      const assistantResponse = response.choices[0].message.content || "";

      // Add only the actual response to history
      this.state.conversationHistory.push({
        role: "assistant",
        content: assistantResponse,
      });

      this.state.hasAskedMainQuestion = true;

      return assistantResponse;
    } else {
      // Conclude the conversation with accessible language
      const conclusionInstruction = {
        role: "user" as const,
        content: `Thank me for completing all the questions in this exercise. Let me know that we're done with the simulation and that my answers will be evaluated. Keep it friendly and encouraging - like you're talking to a high school student who just finished a challenging project.`,
      };

      const messages = [
        ...this.state.conversationHistory,
        conclusionInstruction,
      ];

      // Generate the conclusion
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages,
        max_tokens: 300,
        temperature: 0.7,
      });

      const assistantResponse = response.choices[0].message.content || "";

      // Add the conclusion to history
      this.state.conversationHistory.push({
        role: "assistant",
        content: assistantResponse,
      });

      this.state.isConversationComplete = true;

      return assistantResponse;
    }
  }

  /**
   * Generates a standard response with accessible language
   */
  private async generateStandardResponse(): Promise<string> {
    // Generate a response based on the conversation history
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: this.state.conversationHistory,
      max_tokens: 400,
      temperature: 0.7,
    });

    const assistantResponse = response.choices[0].message.content || "";

    // Add the response to history
    this.state.conversationHistory.push({
      role: "assistant",
      content: assistantResponse,
    });

    return assistantResponse;
  }

  /**
   * Returns the full conversation transcript
   */
  public getConversationTranscript(): string {
    // Filter out system messages and format as a readable transcript
    const transcript = this.state.conversationHistory
      .filter((msg) => msg.role !== "system")
      .map((msg) => {
        const role = msg.role === "assistant" ? "Coach" : "You";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");

    return transcript;
  }

  /**
   * Returns the raw conversation history
   */
  public getConversationHistory() {
    return this.state.conversationHistory;
  }

  /**
   * Checks if the conversation is complete
   */
  public isComplete(): boolean {
    return this.state.isConversationComplete;
  }
}
