import { Copy, Volume2, Star, Share2 } from "lucide-react";
import { getLangLabel } from "../../utils/languages";
import { useState } from "react";

interface Props {
  value: string;
  isTranslating: boolean;
  lang: string;
}

export default function TranslateOutput({ value, isTranslating, lang }: Props) {
  const [copied, setCopied] = useState(false);
  const [starred, setStarred] = useState(false);

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSpeak = () => {
    if (!value) return;
    const utterance = new SpeechSynthesisUtterance(value);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col bg-gray-50/50">
      {/* 출력 영역 */}
      <div className="min-h-[220px] p-5">
        {isTranslating ? (
          <div className="flex items-center gap-2.5 text-gray-400">
            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-500" />
            <span className="text-[15px]">번역 중...</span>
          </div>
        ) : value ? (
          <p className="whitespace-pre-wrap text-[17px] leading-relaxed text-gray-800">
            {value}
          </p>
        ) : (
          <p className="text-[17px] text-gray-400">번역 결과가 여기에 표시됩니다</p>
        )}
      </div>

      {/* 하단 액션 바 */}
      <div className="flex items-center gap-1 border-t border-gray-200 px-4 py-3">
        {/* TTS 듣기 */}
        <button
          onClick={handleSpeak}
          disabled={!value}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
          title={`${getLangLabel(lang)} 듣기`}
        >
          <Volume2 className="h-5 w-5" />
        </button>

        {/* 복사 */}
        <button
          onClick={handleCopy}
          disabled={!value}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
          title={copied ? "복사됨!" : "복사"}
        >
          <Copy className={`h-5 w-5 ${copied ? "text-emerald-500" : ""}`} />
        </button>

        {/* 즐겨찾기 */}
        <button
          onClick={() => value && setStarred(!starred)}
          disabled={!value}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
          title="즐겨찾기"
        >
          <Star
            className={`h-5 w-5 ${starred ? "fill-amber-400 text-amber-400" : ""}`}
          />
        </button>

        {/* 공유 / 내보내기 */}
        <button
          disabled={!value}
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
          title="내보내기"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
