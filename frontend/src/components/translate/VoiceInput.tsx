import { useEffect, useState } from 'react';
import { Mic, Square, Loader2 } from "lucide-react";
import useVoiceRecorder from '../../hooks/useVoiceRecorder';
import { postSTT } from '../../api/stt';

interface Props {
    lang : string;
    onTranscribed : (text : string) => void;
}

export default function VoiceInput({lang, onTranscribed} : Props) {
    const {isRecording, audioBlob, startRecording, stopRecording,reset} =
        useVoiceRecorder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!audioBlob) return;

        const process = async () => {
            setIsProcessing(true);
            setError(null);
            try {
                const res = await postSTT(audioBlob, lang);
                onTranscribed(res.text);
            } catch {
                setError("음성 인식에 실패했습니다. 다시 시도해주세요.")
            } finally {
                setIsProcessing(false);
                reset();
            }
        };
        process();
    }, [audioBlob]);

    const handleToggle = async () => {
        if (isRecording) {
            stopRecording();
        } else {
            setError(null);
            try {
                await startRecording();
            } catch (error) {
                setError("마이크 접근 권한을 설정해주세요.")
            }
        }
    };

    // ↓↓↓↓↓↓↓↓ 버튼 예시 코드 ↓↓↓↓↓↓↓↓ (copilot 작성)
    return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 p-5">
      {/* 녹음 버튼 */}
      <button
        onClick={handleToggle}
        disabled={isProcessing}
        className={`flex h-20 w-20 items-center justify-center rounded-full transition-all ${
          isRecording
            ? "animate-pulse bg-red-500 text-white shadow-lg shadow-red-200"
            : isProcessing
              ? "bg-gray-200 text-gray-400"
              : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200"
        }`}
      >
        {isProcessing ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : isRecording ? (
          <Square className="h-7 w-7" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </button>

      {/* 상태 텍스트 */}
      <p className="text-sm text-gray-500">
        {isProcessing
          ? "음성을 분석하고 있습니다..."
          : isRecording
            ? "듣고 있습니다... 버튼을 눌러 중지"
            : "버튼을 눌러 음성 입력 시작"}
      </p>

      {/* 에러 메시지 */}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}