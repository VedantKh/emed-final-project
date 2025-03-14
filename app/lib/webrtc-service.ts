import OpenAI from "openai";

export interface WebRTCConfig {
  apiKey: string;
  model: string;
  voiceId: string;
}

export class WebRTCService {
  private config: WebRTCConfig;
  private openai: OpenAI;
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private localStream: MediaStream | null = null;

  constructor(config: WebRTCConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: this.config.apiKey,
      dangerouslyAllowBrowser: true, // Only use this in development!
    });
  }

  async initialize(): Promise<void> {
    // Create audio element for playback
    this.audioElement = document.createElement('audio');
    this.audioElement.autoplay = true;
    document.body.appendChild(this.audioElement);
    
    // Initialize WebRTC peer connection
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    
    // Set up event handlers
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.peerConnection) return;
    
    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("ICE candidate:", event.candidate);
      }
    };
    
    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      console.log("Connection state:", this.peerConnection?.connectionState);
    };
    
    // Handle remote tracks (audio from OpenAI)
    this.peerConnection.ontrack = (event) => {
      if (this.audioElement && event.streams && event.streams[0]) {
        this.audioElement.srcObject = event.streams[0];
      }
    };
  }

  async connect(): Promise<void> {
    try {
      // Create a data channel for JSON communication
      if (this.peerConnection) {
        this.dataChannel = this.peerConnection.createDataChannel("openai-events");
        
        // Setup data channel event handlers
        this.dataChannel.onopen = () => console.log("Data channel open");
        this.dataChannel.onclose = () => console.log("Data channel closed");
        this.dataChannel.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("Received data:", data);
        };
      }
      
      // Create session using our server-side API route
      const response = await fetch('/api/realtime-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // No need to send API key here - it's used on the server side
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create session: ${errorData.error || response.statusText}`);
      }
      
      const session = await response.json();
      console.log("Created session:", session);
      
      // Use the session details to complete WebRTC setup
      // This would include setting up the connection with ICE servers from the session
      
      // For development, let's mock this part to allow the flow to continue
      console.log("WebRTC connection established (mock for development)");
    } catch (error) {
      console.error("Error connecting to OpenAI Realtime API:", error);
      throw error;
    }
  }

  async startRecording(onTranscriptUpdate: (transcript: string) => void): Promise<void> {
    try {
      // Request microphone access
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Add tracks to peer connection
      if (this.peerConnection && this.localStream) {
        this.localStream.getAudioTracks().forEach(track => {
          this.peerConnection?.addTrack(track, this.localStream!);
        });
      }
      
      // Let OpenAI know we're starting to record (mock for development)
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        this.dataChannel.send(JSON.stringify({
          type: "input_audio_buffer.clear"
        }));
      } else {
        console.log("Simulating data channel message: input_audio_buffer.clear");
      }
      
      // Set up a simple transcript simulation for dev purposes
      // This would be replaced with actual transcription from the API
      let transcript = 'User: ';
      const words = [
        'Hello', 'I', 'am', 'testing', 'the', 'voice', 'interface',
        'How', 'are', 'you', 'today', '?', 'This', 'is', 'a', 'simulation'
      ];
      
      let wordIndex = 0;
      const simulateTranscriptUpdate = () => {
        if (wordIndex < words.length) {
          transcript += ' ' + words[wordIndex];
          onTranscriptUpdate(transcript);
          wordIndex++;
          setTimeout(simulateTranscriptUpdate, 500);
        }
      };
      
      simulateTranscriptUpdate();
      
    } catch (error) {
      console.error("Error starting recording:", error);
      throw error;
    }
  }

  async stopRecording(): Promise<void> {
    // Stop local microphone stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    // Send stop recording message (mock for development)
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({
        type: "input_audio_buffer.commit"
      }));
      
      // Request AI response
      this.dataChannel.send(JSON.stringify({
        type: "response.create",
        response: {
          modalities: ["audio", "text"]
        }
      }));
    } else {
      console.log("Simulating data channel messages for stopping recording");
    }
  }

  disconnect(): void {
    // Close data channel
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }
    
    // Close peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Stop all tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    
    // Remove audio element
    if (this.audioElement) {
      document.body.removeChild(this.audioElement);
      this.audioElement = null;
    }
  }
}
