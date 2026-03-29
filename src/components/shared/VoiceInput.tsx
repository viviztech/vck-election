"use client";

import { useRef, useState } from "react";

interface Props {
  onResult: (text: string) => void;
  lang?: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export function VoiceInput({ onResult, lang = "ta-IN" }: Props) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  function toggle() {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SR();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={listening ? "Stop voice input" : "Voice input (Tamil)"}
      className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border transition ${
        listening
          ? "bg-red-500 border-red-500 text-white animate-pulse"
          : "border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50"
      }`}
    >
      🎤
    </button>
  );
}
