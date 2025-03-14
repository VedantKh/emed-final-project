import { FlexibleConversationManager } from "./conversation-flexible";

// A simple in-memory store for the active conversation
// In a production environment, you would use a more robust solution
// like Redis or a database for persistent session storage
class ConversationStateManager {
  private activeConversation: FlexibleConversationManager | null = null;

  setConversation(conversation: FlexibleConversationManager) {
    this.activeConversation = conversation;
  }

  getConversation(): FlexibleConversationManager | null {
    return this.activeConversation;
  }

  clearConversation() {
    this.activeConversation = null;
  }
}

// Singleton instance to share state across API routes
export const conversationState = new ConversationStateManager();
