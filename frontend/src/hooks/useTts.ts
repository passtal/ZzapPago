import { useEffect, useRef, useState } from "react";
import { requestTtsAudio } from "../api/tts";

type SpeakParams = {
  text: string;
  lang: string;
  slow?: boolean;
};

const SPEECH_LANG_MAP: Record<string, string> = {
  ar: "ar-SA",
  de: "de-DE",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  ja: "ja-JP",
  ko: "ko-KR",
  pt: "pt-PT",
  ru: "ru-RU",
  th: "th-TH",
  vi: "vi-VN",
  zh: "zh-CN",
};

let activeAudio: HTMLAudioElement | null = null;
let activeAudioUrl: string | null = null;

function normalizeSpeechLang(lang: string) {
  return SPEECH_LANG_MAP[lang] ?? lang;
}

function stopActiveAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  if (activeAudioUrl) {
    URL.revokeObjectURL(activeAudioUrl);
    activeAudioUrl = null;
  }
}

export function stopTtsPlayback() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  stopActiveAudio();
}

export default function useTts() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = () => {
    utteranceRef.current = null;
    setIsLoading(false);
    setIsSpeaking(false);
    stopTtsPlayback();
  };

  const playWithGtts = async ({ text, lang, slow }: SpeakParams) => {
    setIsLoading(true);

    const audioBlob = await requestTtsAudio({ text, lang, slow });
    stopActiveAudio();

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    activeAudio = audio;
    activeAudioUrl = audioUrl;

    audio.onplay = () => {
      setIsLoading(false);
      setIsSpeaking(true);
    };

    audio.onended = () => {
      setIsSpeaking(false);
      stopActiveAudio();
    };

    audio.onpause = () => {
      setIsSpeaking(false);
      stopActiveAudio();
    };

    audio.onerror = () => {
      setIsLoading(false);
      setIsSpeaking(false);
      stopActiveAudio();
    };

    try {
      await audio.play();
    } catch (error) {
      setIsLoading(false);
      setIsSpeaking(false);
      stopActiveAudio();
      throw error;
    }
  };

  const speak = async ({ text, lang, slow }: SpeakParams) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    stop();

    const canUseWebSpeech =
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      typeof SpeechSynthesisUtterance !== "undefined";

    if (canUseWebSpeech) {
      try {
        const utterance = new SpeechSynthesisUtterance(trimmedText);
        utterance.lang = normalizeSpeechLang(lang);
        utteranceRef.current = utterance;

        utterance.onstart = () => {
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          utteranceRef.current = null;
        };

        utterance.onerror = async () => {
          setIsSpeaking(false);
          utteranceRef.current = null;

          try {
            await playWithGtts({ text: trimmedText, lang, slow });
          } catch (error) {
            console.warn("TTS fallback failed.", error);
          }
        };

        window.speechSynthesis.speak(utterance);
        return;
      } catch (error) {
        console.warn("Web Speech TTS failed, falling back to gTTS.", error);
      }
    }

    try {
      await playWithGtts({ text: trimmedText, lang, slow });
    } catch (error) {
      console.warn("gTTS playback failed.", error);
    }
  };

  useEffect(() => stop, []);

  return {
    isLoading,
    isSpeaking,
    speak,
    stop,
  };
}
