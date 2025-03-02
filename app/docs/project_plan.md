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

   - A simple interface where the user selects a crisis scenario and then interacts primarily through voice.
   - Displays the scenario background and provides visual feedback for audio processing.
   - Shows the a summary of the most recent question the agent has asked.
   - Once conversation is complete, displays a button to generate evaluation.
   - Cool animation while loading
   - After evaluation is processed, displays a comprehensive feedback document with scores based on the rubric.

2. **WebRTC Audio Implementation:**

   - Set up **WebRTC peer connection** to the Realtime API for handling audio streams.
   - Configure local audio tracks for microphone input.
   - Set up remote audio playback for model responses.
   - Implement data channel for sending and receiving Realtime API events.

3. **Realtime Session & Conversation Management:**

   - **Session parameters** set to include both audio and text output.
   - Configure **voice settings** to use an appropriate voice for executive coaching.
   - Set up **VAD parameters** to optimize for natural conversation flow.
   - Handle audio streaming with appropriate events (`input_audio_buffer.append` for WebSocket or WebRTC media tracks).
   - Listen for audio-related events like `response.audio.delta` and `input_audio_buffer.speech_started/stopped`.
   - Store complete conversation transcript for post-conversation evaluation.

4. **Case Study Loader:**

   - Upon selection, load the relevant text file into the conversation context or keep it in memory to help shape generation.
   - Use `session.instructions` to inject scenario details and guide the model's role as an executive coach.

5. **Post-Conversation Evaluation System:**

   - After conversation completion, send the full transcript to OpenAI o3 mini.
   - Include the specific crisis rubric as context for the evaluation.
   - Generate comprehensive scoring across ethical and strategic dimensions.
   - Include real-world case snippets of how actual CEOs handled similar situations.
   - Return structured evaluation results to display to the user.

6. **Follow-up Query Logic:**

   - After each user answer, the model issues up to 3 follow-up queries (if relevant).
   - Then either user proceeds to finalize answer or jumps to the next question.

7. **Final Summary/Grading:**
   - After conversation completion, analyze the transcript using o3 mini.
   - Generate a comprehensive evaluation report with scores for each question.
   - Provide an overall "rubric" with detailed feedback on ethical and strategic dimensions.
   - Include real-world case examples with outcomes for comparison.
   - Display the evaluation report to the user after processing is complete.

## Project Phases & Tasks

### [Done] Phase 1: **Scenario Design & Content Creation**

- [x] **Identify 3 crises**:
  - **Pandemic Response Crisis**: Managing coverage policies, telehealth expansion, and provider network strain during a major infectious disease outbreak (e.g., COVID-19)
  - **Data Breach & Privacy Crisis**: Responding to a major cybersecurity incident exposing 2.3M members' protected health information and payment details
  - **Pharmaceutical Pricing Crisis**: Navigating public backlash after denying coverage for a breakthrough but extremely expensive cancer treatment
- [x] **Draft scenario texts within app/scenarios**:
  - [x] Pandemic Response Crisis scenario created with detailed metrics, stakeholders, and timeline pressures
  - [x] Data Breach & Privacy Crisis scenario created with detailed metrics, stakeholders, and timeline pressures
  - [x] Pharmaceutical Pricing Crisis scenario created with detailed metrics, stakeholders, and timeline pressures
  - Always use concrete, real-world examples and NEVER use hypothetical placeholders like "City A" or "Company B" in prompts. Always refer to actual companies, cities, technologies, or other entities by their real names.
  - Include relevant industry data, regulatory considerations (HIPAA, ACA requirements), and market context
  - Present realistic financial implications, member impact statistics, and media/public reaction details
- [x] **Establish question sets for each scenario (crossout only when all are complete)**:
  - [x] Pandemic Response Crisis
  - [x] Data Breach & Privacy Crisis
  - [x] Pharmaceutical Pricing Crisis
  - For each scenario, create 3 complex decision points with multiple viable approaches.
  - Frame each question in very simple language, targeting smart 9th graders with your language
  - Design 3 open ended follow-up questions

### Phase 2: **Scoring & Rubric Implementation**

- [ ] **Create custom rubrics for each crisis scenario following detailed instructions below (crossout only when all are complete)**:
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
  - [ ] **Pandemic Response Crisis**: Develop specific ethical and strategic evaluation criteria focused on public health considerations, care access, provider support, and telehealth innovation
  - [ ] **Data Breach & Privacy Crisis**: Create tailored rubric emphasizing data security protocols, transparency in breach notification, regulatory compliance (HIPAA), and member protection measures
  - [ ] **Pharmaceutical Pricing Crisis**: Design specialized criteria addressing affordability, treatment access, formulary management, and balancing financial stewardship with patient needs
- [ ] **Develop sample benchmark answers for each question in each crisis**:
  - [ ] **Pandemic Response Crisis**:
    - Create 2 low-scoring example responses (1-3 range for both dimensions)
    - Develop 2 medium-scoring example responses (4-6 range)
    - Craft 2 high-scoring example responses (7-10 range)
  - [ ] **Data Breach & Privacy Crisis**:
    - Create 2 low-scoring example responses (1-3 range for both dimensions)
    - Develop 2 medium-scoring example responses (4-6 range)
    - Craft 2 high-scoring example responses (7-10 range)
  - [ ] **Pharmaceutical Pricing Crisis**:
    - Create 2 low-scoring example responses (1-3 range for both dimensions)
    - Develop 2 medium-scoring example responses (4-6 range)
    - Craft 2 high-scoring example responses (7-10 range)
- [ ] **Compile real-world CEO crisis response examples**:
  - For each example, create a concise snippet (150-200 words) that includes:
      - Brief context of the crisis
      - Key decisions made by the CEO
      - Outcomes and consequences (both positive and negative)
      - Lessons learned that can be applied to similar situations
  - [ ] **Pandemic Response Crisis**: For each question, research and document 1 example of how a real life healthcare CEO dealt with a very similar crisis and the results from the decisions they made
  - [ ] **Data Breach & Privacy Crisis**: For each question, research and document 1 example of how a real life healthcare CEO dealt with a very similar crisis and the results from the decisions they made
  - [ ] **Pharmaceutical Pricing Crisis**: For each question, research and document 1 example of how a real life healthcare CEO dealt with a very similar crisis and the results from the decisions they made
- [ ] **Implement post-conversation evaluation system**:
  - Create API endpoint to process conversation transcript with o3 mini
  - Design prompt template that includes:
    - Full conversation transcript
    - Crisis-specific rubric
    - Scoring schema for ethical and strategic dimensions
    - Instructions to evaluate each question response
    - Real-world case snippet for comparison
  - Structure the evaluation output to include:
    - Scores for each question (ethical and strategic dimensions)
    - Rationale for each score
    - Specific improvement suggestions
    - Relevant real-world CEO response example with outcomes
    - Overall performance summary
  - Implement UI component to display evaluation results
- [ ] **Design evaluation report format**:
  - Create template for displaying scores and feedback
  - Include question-by-question breakdown
  - Provide overall average scores for both dimensions
  - Generate personalized strengths and areas for improvement
  - Include visual representation of scores (if UI supports)
  - Design section for displaying real-world CEO response examples

### Phase 3: **Realtime API Audio Setup**

- [ ] **WebRTC Implementation**:
  - Set up WebRTC peer connection to the Realtime API
  - Configure local audio tracks for microphone input
  - Set up remote audio playback for model responses
  - Implement data channel for sending/receiving events
- [ ] **Initialize session** with audio and text modalities
  - Configure `session.update` to set voice and VAD parameters
  - Set appropriate instructions for the executive coaching role
- [ ] **Audio conversation flow**:
  - Set up event listeners for audio-related events
  - Implement visual feedback for audio processing
  - Configure real-time transcription display
  - Store complete transcript for post-conversation evaluation
- [ ] **Error handling**:
  - Implement event listeners for `error` events from the server
  - Handle audio connection issues and fallbacks

### Phase 4: **Question & Follow-up Handling**

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

### Phase 5: **UI/UX Integration**

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

### Phase 6: **Final Integration & Polishing**

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

**By the end of Phase 6,** the agent should provide an engaging, voice-driven experience in navigating high-stakes healthcare crises, challenging users' thought processes through natural conversation. The post-conversation evaluation using o3 mini will provide thorough feedback on ethical and strategic decision-making without interrupting the flow of the conversation, enhanced by real-world examples of how actual CEOs handled similar situations. This plan sets out all major tasks and dependencies to achieve that goal.
