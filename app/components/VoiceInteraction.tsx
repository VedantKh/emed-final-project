"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { WebRTCService, WebRTCConfig } from "../lib/webrtc-service";

interface VoiceInteractionProps {
  onTranscriptUpdate: (transcript: string) => void;
  onError: (error: string) => void;
}

export default function VoiceInteraction({
  onTranscriptUpdate,
  onError,
}: VoiceInteractionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const webRTCServiceRef = useRef<WebRTCService | null>(null);

  // Initialize WebRTC service
  useEffect(() => {
    const initializeWebRTC = async () => {
      try {
        const config: WebRTCConfig = {
          apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
          model: "gpt-4o-realtime-preview",
          voiceId: "alloy", // Default voice ID
        };

        webRTCServiceRef.current = new WebRTCService(config);
        await webRTCServiceRef.current.initialize();
        await webRTCServiceRef.current.connect();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing WebRTC:", error);
        onError(
          "Failed to initialize audio system. Please check your permissions."
        );
      }
    };

    initializeWebRTC();

    return () => {
      // Cleanup
      webRTCServiceRef.current?.disconnect();
    };
  }, [onError]);

  // Start recording
  const startRecording = async () => {
    if (!webRTCServiceRef.current || !isInitialized) {
      onError("Audio system not initialized");
      return;
    }

    try {
      setIsProcessing(true);
      await webRTCServiceRef.current.startRecording(onTranscriptUpdate);
      setIsListening(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      onError("Failed to start recording. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    if (!webRTCServiceRef.current || !isInitialized) {
      onError("Audio system not initialized");
      return;
    }

    try {
      setIsProcessing(true);
      await webRTCServiceRef.current.stopRecording();
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
      onError("Failed to stop recording. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: Implement actual muting through WebRTC service
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <button
        onClick={isListening ? stopRecording : startRecording}
        disabled={isProcessing || !isInitialized}
        className={`p-3 rounded-full ${
          isListening
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white disabled:opacity-50`}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      <button
        onClick={toggleMute}
        disabled={!isInitialized}
        className={`p-3 rounded-full ${
          isMuted ? "bg-gray-500" : "bg-green-500"
        } text-white disabled:opacity-50`}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <div className="flex-1">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ${
              isSpeaking ? "bg-blue-500" : "bg-gray-300"
            }`}
            style={{ width: isSpeaking ? "100%" : "0%" }}
          />
        </div>
      </div>

      {isProcessing && (
        <div className="text-sm text-gray-500">Processing...</div>
      )}

      {!isInitialized && (
        <div className="text-sm text-yellow-500">
          Initializing audio system...
        </div>
      )}
    </div>
  );
}
