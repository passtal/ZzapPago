import { Volume2, ClipboardList, Mic } from "lucide-react";
import { getLangLabel } from "../../utils/languages";

const MAX_CHARS = 3000;

interface Props {
  value: string;
  onChange: (value: string) => void;
  onTranslate: () => void;
  isTranslating: boolean;
  lang: string;
}

export default function TranslateInput({
  value,
  onChange,
  onTranslate,
  isTranslating,
  lang,
}: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onTranslate();
    }
  };

  const handleSpeak = () => {
    if (!value) return;
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col">
      {/* 입력 영역 */}
      <div className="relative min-h-[220px] p-5">
        <textarea
          value={value}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              onChange(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="번역할 내용을 입력하세요"
          rows={7}
          maxLength={MAX_CHARS}
          className="w-full resize-none bg-transparent text-[17px] leading-relaxed text-gray-800 placeholder-gray-400 focus:outline-none"
        />

        {/* 글자수 카운터 */}
        <div className="absolute bottom-3 right-5 text-xs text-gray-400">
          {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </div>
      </div>

      {/* 하단 액션 바 */}
      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-1">
          {/* TTS 듣기 */}
          <button
            onClick={handleSpeak}
            disabled={!value}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
            title={`${getLangLabel(lang)} 듣기`}
          >
            <Volume2 className="h-5 w-5" />
          </button>

          {/* 사전 / 문장 목록 (placeholder) */}
          <button
            disabled={!value}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
            title="사전"
          >
            <ClipboardList className="h-5 w-5" />
          </button>
        </div>

        {/* 번역하기 버튼 */}
        <button
          onClick={onTranslate}
          disabled={!value.trim() || isTranslating}
          className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isTranslating ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              번역 중...
            </span>
          ) : (
            "번역하기"
          )}
        </button>
      </div>
    </div>
  );
}
