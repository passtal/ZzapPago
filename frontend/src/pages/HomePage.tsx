import { useState } from "react";
import LanguageSelector from "../components/translate/LanguageSelector";
import TranslateInput from "../components/translate/TranslateInput";
import TranslateOutput from "../components/translate/TranslateOutput";
import VoiceInput from "../components/translate/VoiceInput";
import { postTranslate } from "../api/translate";
import useRealtimeTranslate from "../hooks/useRealtimeTranslate";
import useGeoLocation from "../hooks/useGeoLocation";
import { ArrowRightLeft, Type, Mic, FileText, Globe, Zap, MapPin } from "lucide-react";

const INPUT_TABS = [
  { id: "text", label: "텍스트", icon: Type },
  { id: "realtime", label: "실시간", icon: Zap },
  { id: "voice", label: "음성", icon: Mic },
  { id: "document", label: "문서", icon: FileText },
  { id: "website", label: "웹사이트", icon: Globe },
] as const;

export default function HomePage() {
  const [sourceLang, setSourceLang] = useState("ko");
  const [targetLang, setTargetLang] = useState("en");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("text");

  const { translatedText: realtimeOutput, isConnected, sendText } = useRealtimeTranslate({
    sourceLang,
    targetLang,
  });

  const { location: geoLocation, loading: geoLoading, error: geoError, detectLocation } = useGeoLocation();

  const handleDetectLocation = async () => {
    const result = await detectLocation();
    if (result?.langCode) {
      // 감지된 언어를 출발어로 설정
      setSourceLang(result.langCode);
    }
  };

  const handleSwapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await postTranslate({
        source_lang: sourceLang,
        target_lang: targetLang,
        text: inputText,
        latitude: geoLocation?.latitude,
        longitude: geoLocation?.longitude,
        country_code: geoLocation?.countryCode,
      });
      setOutputText(res.translated_text);
    } catch {
      setOutputText("[번역 실패] 서버에 연결할 수 없습니다.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateWith = async (text: string) => {
    if (!text.trim()) return;
    setIsTranslating(true);
    try {
      const res = await postTranslate({
        source_lang: sourceLang,
        target_lang: targetLang,
        text,
        latitude: geoLocation?.latitude,
        longitude: geoLocation?.longitude,
        country_code: geoLocation?.countryCode,
      });
      setOutputText(res.translated_text);
    } catch (error) {
      setOutputText("[번역 실패] 서버에 연결할 수 없습니다.")
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="mx-auto max-w-[960px] px-4 pt-6">
      {/* 히어로 로고 */}
      <div className="mb-6 flex flex-col items-center">
        <img src="/logo.png" alt="짭파고" className="h-28 w-auto" />
      </div>

      {/* 입력 모드 탭 */}
      <div className="mb-4 flex items-center justify-center gap-2">
        {INPUT_TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
              activeTab === id
                ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* 메인 번역 카드 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* 언어 선택 바 */}
        <div className="flex items-center border-b border-gray-200">
          <div className="flex flex-1 items-center px-5 py-3">
            <LanguageSelector
              value={sourceLang}
              onChange={setSourceLang}
              label="출발어"
            />
            <button
              onClick={handleDetectLocation}
              disabled={geoLoading}
              className="ml-2 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-emerald-500 disabled:opacity-50"
              title="위치 기반 언어 감지"
            >
              <MapPin className={`h-3.5 w-3.5 ${geoLoading ? "animate-pulse" : ""} ${geoLocation ? "text-emerald-500" : ""}`} />
              {geoLoading ? "감지 중..." : geoLocation?.countryCode ?? "위치 감지"}
            </button>
          </div>

          <button
            onClick={handleSwapLangs}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-gray-100 hover:text-emerald-500"
            title="언어 교환"
          >
            <ArrowRightLeft className="h-[18px] w-[18px]" />
          </button>

          <div className="flex flex-1 items-center justify-end px-5 py-3">
            <LanguageSelector
              value={targetLang}
              onChange={setTargetLang}
              label="도착어"
            />
          </div>
        </div>

        {/* 좌우 번역 패널 */}
        <div className="grid md:grid-cols-2 md:divide-x md:divide-gray-200">
          {activeTab === "voice" ? (
            <VoiceInput 
              lang={sourceLang}
              onTranscribed={(text) => {
                setInputText(text);
                setActiveTab("text");
                handleTranslateWith(text);
              }}
            />
          ) : activeTab === "realtime" ? (
            <>
              <div className="flex flex-col">
                <div className="relative min-h-[220px] p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-400"}`} />
                    <span className="text-xs text-gray-400">
                      {isConnected ? "실시간 연결됨" : "연결 끊김"}
                    </span>
                  </div>
                  <textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      sendText(e.target.value);
                    }}
                    placeholder="입력하면 실시간으로 번역됩니다"
                    rows={7}
                    maxLength={3000}
                    className="w-full resize-none bg-transparent text-[17px] leading-relaxed text-gray-800 placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </div>
              <TranslateOutput
                value={realtimeOutput}
                isTranslating={false}
                lang={targetLang}
              />
            </>
          ) : (
            <>
              <TranslateInput
                value={inputText}
                onChange={setInputText}
                onTranslate={handleTranslate}
                isTranslating={isTranslating}
                lang={sourceLang}
              />
              <TranslateOutput
                value={outputText}
                isTranslating={isTranslating}
                lang={targetLang}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
