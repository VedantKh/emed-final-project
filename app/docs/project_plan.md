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

3. **Ethical & Strategic Scoring:**

   - Each answer (or potential approach) should be evaluated for _ethical_ considerations and _strategic_ soundness.
   - The agent will produce a final rubric or grading summary once all questions have been addressed.

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
   - Once conversation is complete, a clear document with feedback and a score is returned based on the rubric.

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

4. **Case Study Loader:**

   - Upon selection, load the relevant text file into the conversation context or keep it in memory to help shape generation.
   - Use `session.instructions` to inject scenario details and guide the model's role as an executive coach.

5. **Scoring & Rubric (Function Calling Option):**

   - Provide a tool/function like `score_answer(ethicalFactors, strategicFactors)` to assign final scores.
   - The model can call this function, or the logic can be triggered on the client side once a question is answered.
   - Results returned to the model as a `function_call_output` conversation item.

6. **Follow-up Query Logic:**

   - After each user answer, the model issues up to 3 follow-up queries (if relevant).
   - Then either user proceeds to finalize answer or jumps to the next question.

7. **Final Summary/Grading:**
   - Summarize user responses for each question, referencing the stored ethical and strategic scores.
   - Provide an overall "rubric" at the end, delivered both verbally and in text form.

## Project Phases & Tasks

### Phase 1: **Scenario Design & Content Creation**

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
- [ ] **Establish question sets for each scenario (crossout only when all are complete)**:
  - [x] Pandemic Response Crisis
  - [x] Data Breach & Privacy Crisis
  - [ ] Pharmaceutical Pricing Crisis
  - For each scenario, create 3 complex decision points with multiple viable approaches.
  - Frame each question in very simple language, targeting smart 9th graders with your language
  - Design 3 open ended follow-up questions

### Phase 2: **Scoring & Rubric Implementation**

- [ ] **Define scoring schema**:
  - Ethical dimension (range 1–5, for example)
  - Strategic dimension (range 1–5)
- [ ] **Implement function calling**:
  - Add `score_answer` function in `session.tools` or `response.create` -> `tools`
  - Let the model pass arguments (e.g., user's final response text, scenario context)
  - Return numeric or descriptive score
- [ ] **Summarize final rubric**:
  - Tally and structure the final summary
  - Have the agent verbally deliver the overall rating and feedback
  - Also display text summary for reference

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

### Phase 5: **UI/UX Integration**

- [ ] **Design voice-centric interface**:
  - Crisis selection drop-down or list
  - Audio visualization for voice activity
  - Real-time transcription display
  - Minimal controls for audio settings
- [ ] **Audio feedback components**:
  - Visual indicators for when the agent is listening
  - Indication when the agent is processing or speaking
  - Option to mute/unmute or pause the conversation
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
  - Check scoring calls and final summary
  - Test with different speaking styles and accents
- [ ] **Performance & Load Testing**:
  - Confirm Realtime audio sessions remain stable
  - Test in various network conditions
  - Ensure event handling covers edge cases
- [ ] **User Acceptance & Feedback**:
  - Gather feedback on voice interaction quality
  - Assess question complexity and scoring accuracy
  - Adjust instructions or voice parameters as needed

## Future Considerations

- **Additional Crises:** Expand to more scenarios or sub-scenarios.
- **Voice Customization:** Allow users to select different voices for the agent to match preferences.

---

**By the end of Phase 6,** the agent should provide an engaging, voice-driven experience in navigating high-stakes healthcare crises, challenging users' thought processes through natural conversation while offering thorough feedback on ethical and strategic decision-making. This plan sets out all major tasks and dependencies to achieve that goal.
