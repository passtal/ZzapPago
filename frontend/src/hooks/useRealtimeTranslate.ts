import { useCallback, useEffect, useRef, useState } from "react";

interface UseRealtimeTranslateOptions {
  sourceLang: string;
  targetLang: string;
  debounceMs?: number;
}

export default function useRealtimeTranslate({
  sourceLang,
  targetLang,
  debounceMs = 500,
}: UseRealtimeTranslateOptions) {
  const [translatedText, setTranslatedText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const ws = new WebSocket(`${protocol}//${host}/ws/translate`);

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.translated_text !== undefined) {
          setTranslatedText(data.translated_text);
        }
      } catch {
        // ignore parse errors
      }
    };

    wsRef.current = ws;

    return () => {
      ws.close();
      wsRef.current = null;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const sendText = useCallback(
    (text: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      if (!text.trim()) {
        setTranslatedText("");
        return;
      }

      timerRef.current = setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              text,
              source_lang: sourceLang,
              target_lang: targetLang,
            })
          );
        }
      }, debounceMs);
    },
    [sourceLang, targetLang, debounceMs]
  );

  return { translatedText, isConnected, sendText };
}
