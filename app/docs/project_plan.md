# Emed Realtime Agent Project Plan

## Overview

This project aims to build an interactive Realtime agent for simulating crisis-management decisions a CEO of a large health insurance company might face. The agent will provide scenario-based role-play, ask the user a sequence of complex decisions, probe their rationale with follow-up questions, and finally grade their responses on strategic and ethical dimensions. The plan uses [OpenAI's Realtime API](https://platform.openai.com/docs/guides/realtime-model-capabilities) with voice as the primary interaction method, enabling a natural, conversational experience that challenges users to think deeply about healthcare leadership decisions.

## Requirements & Agent Scope

1. **Scenarios (Case Studies):**

   - At least three **case studies** (e.g., pandemic outbreak, major PR crisis, severe internal conflict) that the CEO might handle.
   - Each scenario includes background text or "case study text file" to be loaded in as context tokens.

2. **Voice-Driven Question & Answer Flow:**

   - Each scenario will generate **three questions** about complex decisions.
   - The user answers each question verbally; the agent may pose **up to 3 direct follow-up** interrogative questions to challenge or clarify.
   - After the user is done, the agent smoothly transitions to the next question.
   - Voice interaction is the primary mode of communication, creating a more immersive and natural experience.

3. **Post-Conversation Ethical & Strategic Scoring:**

   - After the conversation is complete, the full transcript will be analyzed by OpenAI o3 mini.
   - Each answer will be evaluated for _ethical_ considerations and _strategic_ soundness based on the specific crisis rubric.
   - A comprehensive evaluation report will be generated once the conversation has concluded.
   - The evaluation will include real-world case snippets showing how actual CEOs handled similar crises and their outcomes.

4. **Realtime Session Management with Audio:**

   - Use the **Realtime API** to maintain a stateful connection with audio capabilities.
   - Implement **WebRTC** for client-side applications to handle voice input/output with low latency.
   - Manage the conversation with audio inputs and outputs, leveraging the model's ability to process and generate speech in real-time.

5. **User Experience (UX) Goals:**

   - Create a natural, conversational experience that feels like speaking with a real executive coach or mentor who is an ex-CEO experienced in the healthcare insurance industry.
   - Enable smooth transitions between setting the scene, asking questions, clarifying or challenging answers, and providing feedback.
   - Allow the user to "move on" verbally at any point or dive deeper with follow-ups.
   - Provide visual feedback for audio processing (e.g., voice activity indicators).

6. **Voice Interaction Implementation:**
   - Implement **WebRTC** for browser-based applications to handle bidirectional audio streams.
   - Configure **Voice Activity Detection (VAD)** to automatically detect when the user has finished speaking.
   - Use the model's voice capabilities to create a consistent, professional tone appropriate for executive-level discussions.
   - Provide text transcription alongside audio for accessibility and reference.

## Architecture Outline

1. **UI Layer:**

   - Next.js frontend with a clean, professional interface for healthcare executives
   - WebRTC integration for real-time voice streaming to/from the browser
   - Audio visualization components for voice activity indication
   - Results dashboard for displaying evaluation scores and feedback
   - Test interface at `/test` for demonstrating the flexible prompting system

2. **API Layer:**

   - Next.js API routes for handling real-time communication setup
   - WebSocket connections managed through the Realtime API
   - Endpoint for transcript evaluation and scoring
   - Session management using secure server-side storage

3. **Core Logic Layer:**

   - Session manager to handle conversation flow and state
   - **New: Flexible prompting system** that leverages LLM knowledge instead of extensive static content files
   - Evaluation engine for post-conversation analysis
   - Scenario management with content loading
   - Speaker detection and turn management

4. **Data Layer:**
   - Scenario content files (descriptions, questions, rubrics, examples)
   - **New: Minimal scenario templates** that provide key parameters rather than extensive content
   - Conversation transcripts and evaluations
   - User authentication (in future versions)

## Prompting Approaches

The project implements two complementary prompting approaches:

### 1. Traditional Content-Rich Prompting

- Uses extensive markdown files for scenario descriptions, questions, rubrics, and examples
- Provides fine-grained control over the simulation content
- Allows for carefully crafted evaluation criteria and benchmark examples
- Requires significant content creation and maintenance effort

### 2. New Flexible Knowledge-Based Prompting

- **Leverages the LLM's internal knowledge** about healthcare, crisis management, and executive leadership
- Uses lightweight JSON templates with key parameters instead of extensive content files
- Dynamically generates detailed scenarios, follow-up questions, and evaluation criteria
- Significantly reduces content creation requirements while maintaining simulation quality
- Test interface available at `/test` route

The flexible approach offers several advantages:

- Reduced content creation burden (80-90% less content to write)
- More dynamic conversation flow with contextually relevant follow-ups
- Up-to-date real-world examples drawn from the model's knowledge
- Easier expansion to new scenarios

## Project Phases & Tasks

### [Done] Phase 1: **Scenario Design & Content Creation**

- [x] **Identify 3 crises**:
  - **Pandemic Response Crisis**: Managing coverage policies, telehealth expansion, and provider network strain during a major infectious disease outbreak (e.g., COVID-19)
  - **Data Breach & Privacy Crisis**: Responding to a major cybersecurity incident exposing 2.3M members' protected health information and payment details
  - **Pharmaceutical Pricing Crisis**: Navigating public backlash after denying coverage for a breakthrough but extremely expensive cancer treatment
- [x] **Draft scenario texts within app/scenarios/descriptions**:
  - [x] Pandemic Response Crisis scenario created with detailed metrics, stakeholders, and timeline pressures
  - [x] Data Breach & Privacy Crisis scenario created with detailed metrics, stakeholders, and timeline pressures
  - [x] Pharmaceutical Pricing Crisis scenario created with detailed metrics, stakeholders, and timeline pressures
  - Always use concrete, real-world examples and NEVER use hypothetical placeholders like "City A" or "Company B" in prompts. Always refer to actual companies, cities, technologies, or other entities by their real names.
  - Include relevant industry data, regulatory considerations (HIPAA, ACA requirements), and market context
  - Present realistic financial implications, member impact statistics, and media/public reaction details
- [x] **Establish question sets for each scenario in app/scenarios/questions (crossout only when all are complete)**:
  - [x] Pandemic Response Crisis
  - [x] Data Breach & Privacy Crisis
  - [x] Pharmaceutical Pricing Crisis
  - For each scenario, create 3 complex decision points with multiple viable approaches.
  - Frame each question in very simple language, targeting smart 9th graders with your language
  - Design 3 open ended follow-up questions

### Phase 2: **Scoring & Rubric Implementation**

- [x] **Create custom rubrics for each crisis scenario in app/scenarios/rubrics following detailed instructions below (crossout only when all are complete)**:
  - **Ethical dimension (range 1–10)**:
    - 1-3: Decisions that prioritize company interests at significant expense to stakeholders
    - 4-6: Decisions that balance company and stakeholder interests with some compromises
    - 7-10: Decisions that demonstrate exceptional ethical leadership, transparency, and stakeholder care
    - **Strategic dimension (range 1–10)**:
      - 1-3: Short-term thinking with potential long-term negative consequences
      - 4-6: Balanced approach with reasonable risk management and business continuity
      - 7-10: Forward-thinking solutions that address immediate concerns while positioning for future advantage
    - **Scoring criteria to include**:
      - Transparency and communication approach
      - Stakeholder impact consideration (members, providers, employees)
      - Regulatory compliance and legal risk management
      - Financial sustainability and business continuity
      - Reputation management and brand protection
      - Innovation and adaptability in crisis response
  - [x] **Pandemic Response Crisis**: Develop specific ethical and strategic evaluation criteria focused on public health considerations, care access, provider support, and telehealth innovation
  - [x] **Data Breach & Privacy Crisis**: Create tailored rubric emphasizing data security protocols, transparency in breach notification, regulatory compliance (HIPAA), and member protection measures
  - [x] **Pharmaceutical Pricing Crisis**: Design specialized criteria addressing affordability, treatment access, formulary management, and balancing financial stewardship with patient needs
- [x] **Develop sample benchmark answers for each question in each crisis in app/scenarios/examples**:
  - [x] **Pandemic Response Crisis**:
    - Create a low-scoring example response (1-3 range for both dimensions)
    - Develop a medium-scoring example response (4-6 range)
    - Craft a high-scoring example response (7-10 range)
    - (For later, make more examples of mixed score, high ethics, low strategy; low ethics, high strategy)
  - [x] **Data Breach & Privacy Crisis**:
    - Create a low-scoring example response (1-3 range for both dimensions)
    - Develop a medium-scoring example response (4-6 range)
    - Craft a high-scoring example response (7-10 range)
    - (For later, make more examples of mixed score, high ethics, low strategy; low ethics, high strategy)
  - [x] **Pharmaceutical Pricing Crisis**:
    - Create a low-scoring example response (1-3 range for both dimensions)
    - Develop a medium-scoring example response (4-6 range)
    - Craft a high-scoring example response (7-10 range)
    - (For later, make more examples of mixed score, high ethics, low strategy; low ethics, high strategy)
- [ ] **Compile real-world CEO crisis response examples**:
  - For each example, create a concise snippet (150-200 words) that includes:
    - Brief context of the crisis
    - Key decisions made by the CEO
    - Outcomes and consequences (both positive and negative)
    - Lessons learned that can be applied to similar situations
  - [x] **Pandemic Response Crisis**: For each question, research and document 1 example of how a real life healthcare CEO dealt with a very similar crisis and the results from the decisions they made
  - [x] **Data Breach & Privacy Crisis**: For each question, research and document 1 example of how a real life healthcare CEO dealt with a very similar crisis and the results from the decisions they made
  - [x] **Pharmaceutical Pricing Crisis**: For each question, research and document 1 example of how a real life healthcare CEO dealt with a very similar crisis and the results from the decisions they made

### [Partially Complete] Phase 3: **Post-Conversation Evaluation System**

- [x] **Step 1: Create Evaluation API Endpoint Structure**:

  - Create basic API endpoint file at `app/api/evaluate.js`
  - Implement skeleton function that accepts conversation transcript
  - Add basic validation for required parameters
  - Test endpoint with simple mock data to ensure it returns a 200 response

- [x] **Step 2: Scenario Content Loading**:

  - Create utility function to load scenario-specific content (rubric, examples)
  - Implement function to fetch the appropriate rubric based on scenario ID
  - Add function to retrieve relevant benchmark examples
  - Test content loading with each scenario type

- [x] **Step 3: Basic Prompt Template Construction**:

  - Create a simple prompt template that includes the conversation transcript
  - Add the scenario-specific rubric to the prompt
  - Include basic instructions for evaluation criteria
  - Test prompt generation with sample conversations

- [x] **Step 4: Initial OpenAI Integration**:

  - Implement API call to OpenAI
  - Configure appropriate model settings (temperature, tokens)
  - Process API response and basic error handling
  - Test end-to-end with sample conversation

- [x] **Step 5: Enhanced Prompt Engineering**:

  - Refine prompt template to include specific scoring instructions
  - Add structure for ethical and strategic dimension evaluations
  - Include real-world case snippets in the prompt
  - Test prompt effectiveness with various conversation scenarios

- [x] **Step 6: Response Parsing and Structuring**:

  - Implement logic to parse responses
  - Extract scores for each question (ethical and strategic dimensions)
  - Structure feedback in a consistent format
  - Test parsing with various response formats

- [x] **Step 7: Evaluation Report Generation**:

  - Create structured format for the evaluation report
  - Design the layout for scores, feedback, and real-world examples
  - Implement function to populate the report structure
  - Test report generation with different evaluation outcomes

- [x] **Step 8: API Response Formatting**:

  - Finalize the API response structure
  - Include scores, detailed feedback, and improvement suggestions
  - Add real-world CEO examples for comparison
  - Test the complete API flow with full conversation transcripts

- [x] **Step 9: Error Handling and Edge Cases**:

  - Implement robust error handling for API failures
  - Add fallback mechanisms for missing content
  - Create graceful degradation for partial evaluations
  - Test with intentionally problematic inputs

- [x] **Step 10: Performance Optimization**:
  - Measure and optimize API response time
  - Implement caching for static content (rubrics, examples)
  - Add request throttling if needed
  - Test with realistic conversation lengths to ensure acceptable performance

### [Complete] Phase 3.5: **Flexible Prompting System Implementation**

- [x] **Step 1: Design Flexible Scenario Templates**:

  - Create lightweight JSON structure for scenario definitions
  - Define key parameters that capture essential scenario context
  - Implement minimal but specific decision points
  - Test template structure with existing scenarios

- [x] **Step 2: Implement Knowledge-Leveraging Conversation Manager**:

  - Design flexible conversation manager class
  - Implement dynamic question flow with contextual follow-ups
  - Create system that leverages LLM knowledge without extensive content
  - Test conversation flow with sample interactions

- [x] **Step 3: Build Flexible Evaluation System**:

  - Create evaluation prompt that relies on LLM knowledge
  - Implement structured output generation for consistent feedback
  - Design system to dynamically generate real-world comparisons
  - Test with sample conversations to ensure quality feedback

- [x] **Step 4: Develop Web-Based Test Interface**:

  - Create test route at `/test` for demonstration
  - Implement conversation UI with message history
  - Add evaluation display components
  - Test complete user flow from conversation to evaluation

- [x] **Step 5: Create API Backend for Test Interface**:

  - Implement start conversation endpoint
  - Create message handling endpoint
  - Build evaluation endpoint
  - Implement state management between API calls
  - Test API flow end-to-end

- [x] **Step 6: Documentation and Testing Instructions**:
  - Update project plan with flexible prompting system details
  - Create comprehensive testing instructions document
  - Document advantages compared to traditional approach
  - Test following the instructions to verify clarity

### [Complete] Phase 3.6: **Error Handling Improvements**

- [x] **Step 1: Identify and Fix Message Sending Errors**:

  - Fixed error handling in the test page message sending functionality
  - Added proper error display to show users what went wrong during conversation
  - Improved API endpoint error handling for both start and message routes
  - Implemented better JSON response parsing for error messages

- [x] **Step 2: UI Enhancements for Error Feedback**:

  - Added error display component to show error messages to users
  - Implemented error state clearing when starting new operations
  - Enhanced the scenario selection UI to allow users to choose different scenarios
  - Improved visual feedback for error states

- [x] **Step 3: API Route Error Handling**:

  - Added additional validation for required parameters in API requests
  - Implemented nested try-catch blocks for better error isolation
  - Enhanced error reporting with more specific error messages
  - Added additional logging for easier debugging

- [x] **Step 4: Testing and Verification**:
  - Tested the error handling with various scenarios
  - Verified proper error display in the UI
  - Confirmed error states are properly cleared when operations are retried
  - Ensured conversation state is properly managed across API calls

### Phase 4: **Realtime API Audio Setup**

- [x] **WebRTC Implementation**:
  - Set up WebRTC peer connection to the Realtime API
  - Configure local audio tracks for microphone input
  - Set up remote audio playback for model responses
  - Implement data channel for sending/receiving events
- [x] **Initialize session** with audio and text modalities
  - Configure `session.update` to set voice and VAD parameters
  - Set appropriate instructions for the executive coaching role
- [x] **Audio conversation flow**:
  - Set up event listeners for audio-related events
  - Implement visual feedback for audio processing
  - Configure real-time transcription display
  - Store complete transcript for post-conversation evaluation
- [x] **Error handling**:
  - Implement event listeners for `error` events from the server
  - Handle audio connection issues and fallbacks

### Phase 5: **Question & Follow-up Handling**

- [ ] **Voice-driven Q&A flow**:
  - After scenario introduction, have the agent verbally ask the first question
  - Capture user's spoken response, process through the Realtime API
  - Generate appropriate follow-up questions based on user's verbal response
- [ ] **Adaptive conversation logic**:
  - Implement verbal commands for "move on" or similar transitions
  - Track follow-up count to ensure a maximum of 3 follow-ups
  - Handle interruptions and overlapping speech gracefully
- [ ] **Transcript storage**:
  - Capture and store the complete conversation transcript
  - Include question prompts, user responses, and follow-up exchanges
  - Format transcript appropriately for post-conversation evaluation

### Phase 6: **UI/UX Integration**

- [ ] **Design voice-centric interface**:
  - Crisis selection drop-down or list
  - Audio visualization for voice activity
  - Real-time transcription display
  - Minimal controls for audio settings
  - Add "Generate Evaluation" button for post-conversation analysis
- [ ] **Audio feedback components**:
  - Visual indicators for when the agent is listening
  - Indication when the agent is processing or speaking
  - Option to mute/unmute or pause the conversation
- [ ] **Evaluation display components**:
  - Design evaluation results view
  - Create visual representation of scores
  - Format detailed feedback in an easily digestible way
  - Design section for displaying real-world CEO response examples
  - Include comparison between user's approach and real-world examples
- [ ] **Accessibility considerations**:
  - Ensure text transcription is available alongside audio
  - Provide visual cues for audio status
  - Consider fallback to text-only mode if needed

### Phase 7: **Final Integration & Polishing**

- [ ] **Refine Voice Interaction**:
  - Test and optimize VAD settings for natural conversation flow
  - Ensure the agent's voice and tone are appropriate for executive coaching
  - Fine-tune prompt instructions for natural follow-up queries
- [ ] **Validate Scenario Flow**:
  - Walk through each crisis end-to-end; test all questions verbally
  - Test transcript capture and storage
  - Verify post-conversation evaluation with o3 mini
  - Confirm real-world CEO examples are relevant and insightful
- [ ] **Performance & Load Testing**:
  - Confirm Realtime audio sessions remain stable
  - Test in various network conditions
  - Ensure event handling covers edge cases
  - Verify evaluation processing time is acceptable

## Future Considerations

- **Additional Crises:** Expand to more scenarios or sub-scenarios.
- **Voice Customization:** Allow users to select different voices for the agent to match preferences.
- **Evaluation Comparison:** Enable comparison of multiple users' evaluations for training purposes.
- **Expanded Real-World Examples:** Build a larger database of CEO crisis responses for more tailored comparisons.

---

## Project Completion Status

The project is approximately **70% complete**. Here's the breakdown:

- ✅ **Phase 1: Scenario Design & Content Creation** - 100% complete
- ✅ **Phase 2: Scoring & Rubric Implementation** - 100% complete
- ✅ **Phase 3: Post-Conversation Evaluation System** - 100% complete
- ✅ **Phase 3.5: Flexible Prompting System Implementation** - 100% complete
- ✅ **Phase 3.6: Error Handling Improvements** - 100% complete
- ✅ **Phase 4: Realtime API Audio Setup** - 100% complete
- ❌ **Phase 5: Question & Follow-up Handling** - 0% complete
- ❌ **Phase 6: UI/UX Integration** - 0% complete
- ❌ **Phase 7: Final Integration & Polishing** - 0% complete

The project now has two complementary approaches implemented:

1. The traditional content-rich approach with extensive prompt files
2. The new flexible knowledge-based approach that leverages LLM capabilities

The flexible prompting system (Phase 3.5) is fully functional and can be tested at the `/test` route, providing a text-based simulation of the full experience. This represents a significant advancement in our approach, reducing content creation needs by 80-90% while maintaining high-quality interactions.
