import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Clock3,
  Languages,
} from "lucide-react";
import { TranslationRecord, getTranslateHistory } from "../api/translate";
import { getLangLabel } from "../utils/languages";
import { createLearningCard, readLearningCard } from "../api/learningCard";

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const getInputTypeLabel = (inputType: string) => {
  const labels: Record<string, string> = {
    text: "텍스트",
    voice: "음성",
    document: "문서",
    website: "웹사이트",
  };

  return labels[inputType] ?? inputType;
};

const INPUT_TYPE_FILTERS: TranslationRecord["input_type"][] = [
  "text",
  "voice",
  "document",
  "website",
];

const getPreviewText = (text: string, maxLength: number = 84) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

const getDateKey = (value: string) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateGroupLabel = (value: string) => {
  const date = new Date(value);
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date();
  const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round(
    (base.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function HistoryPage() {
  const [records, setRecords] = useState<TranslationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<
    TranslationRecord["input_type"] | null
  >(null);
  const [savingCardId, setSavingCardId] = useState<number | null>(null);
  const [savedCardId, setSavedCardId] = useState<number[]>([]);
  const [saveError, setSaveError] = useState<{ id: number; message: string } | null>(null);

  const handleSaveLearningCard = async (record: TranslationRecord) => {
    setSavingCardId(record.id);
    setSaveError(null);

    try {
      const data = await createLearningCard({ translation_id: record.id});
      setSavedCardId((current) => [...current, data.translation_id]);
    } catch (error) {
      setSaveError({ id: record.id, message: "학습 카드를 저장하는 데 실패했습니다." });
    } finally {
      setSavingCardId(null);
    }

  }

  useEffect(() => {
    readLearningCard()
      .then((data) => {
        const savedIds = data.map((card) => card.translation_id);
        setSavedCardId(savedIds);
      })
      .catch(() => {
        console.error("학습 카드 정보를 불러오는 데 실패했습니다.");
      });

    void (async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getTranslateHistory(0, 20);
        setRecords(data);
      } catch {
        setError("번역 내역을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredRecords = useMemo(() => {
    if (!activeFilter) {
      return records;
    }

    return records.filter((record) => record.input_type === activeFilter);
  }, [activeFilter, records]);

  const groupedRecords = useMemo(() => {
    const groups = new Map<string, TranslationRecord[]>();

    filteredRecords.forEach((record) => {
      const key = getDateKey(record.created_at);
      const current = groups.get(key) ?? [];
      current.push(record);
      groups.set(key, current);
    });

    return Array.from(groups.entries())
      .filter(([, items]) => items.length > 0)
      .map(([key, items]) => ({
        key,
        label: getDateGroupLabel(items[0]!.created_at),
        items,
      }));
  }, [filteredRecords]);

  return (
    <div className="mx-auto max-w-[960px] px-4 pt-6">
      {!loading && !error && records.length > 0 && (
        <div className="mb-4 flex items-center justify-center gap-2">
          {INPUT_TYPE_FILTERS.map((inputType) => {
            const isActive = activeFilter === inputType;

            return (
              <button
                key={inputType}
                type="button"
                onClick={() => {
                  setExpandedId(null);
                  setActiveFilter((current) =>
                    current === inputType ? null : inputType
                  );
                }}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                  isActive
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                    : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                }`}
              >
                {getInputTypeLabel(inputType)}
              </button>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-sm text-gray-500 shadow-sm">
          번역 내역을 불러오는 중입니다.
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && records.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-sm text-gray-500 shadow-sm">
          아직 번역 기록이 없습니다.
        </div>
      )}

      {!loading && !error && records.length > 0 && groupedRecords.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-sm text-gray-500 shadow-sm">
          선택한 유형의 번역 기록이 없습니다.
        </div>
      )}

      {!loading && !error && groupedRecords.length > 0 && (
        <div className="space-y-6">
          {groupedRecords.map((group) => (
            <section key={group.key}>
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-gray-900">
                  {group.label}
                </h2>
                <span className="text-xs text-gray-400">
                  {group.items.length}건
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {group.items.map((record, index) => {
                  const isExpanded = expandedId === record.id;

                  return (
                    <article
                      key={record.id}
                      className={index > 0 ? "border-t border-gray-200" : ""}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId((current) =>
                            current === record.id ? null : record.id
                          )
                        }
                        className="w-full px-5 py-4 text-left transition-colors hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full border px-2.5 py-1 text-[11px] font-medium text-gray-500">
                                {getInputTypeLabel(record.input_type)}
                              </span>

                              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                <Languages className="h-3.5 w-3.5" />
                                {getLangLabel(record.source_lang)} →{" "}
                                {getLangLabel(record.target_lang)}
                              </span>

                              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                <Clock3 className="h-3.5 w-3.5" />
                                {formatDate(record.created_at)}
                              </span>
                            </div>

                            <p className="mb-1 whitespace-pre-wrap text-[16px] font-medium leading-relaxed text-gray-900">
                              {getPreviewText(record.translated_text, 96)}
                            </p>
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-500">
                              {getPreviewText(record.source_text, 110)}
                            </p>
                          </div>

                          <span className="mt-1 rounded-lg p-2 text-gray-400">
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-white px-5 py-5">
                          <div className="grid gap-4 md:grid-cols-2">
                            <section className="rounded-lg bg-white px-4 py-4">
                              <p className="mb-2 text-xs font-semibold text-gray-500">
                                원문
                              </p>
                              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                                {record.source_text}
                              </p>
                            </section>

                            <section className="rounded-lg bg-white px-4 py-4">
                              <p className="mb-2 text-xs font-semibold text-emerald-700">
                                번역
                              </p>
                              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                                {record.translated_text}
                              </p>
                            </section>
                            <section>
                              <button
                                onClick={() => void handleSaveLearningCard(record)}
                                disabled={savingCardId === record.id || savedCardId.includes(record.id)}
                                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {savingCardId === record.id
                                  ? "저장 중..."
                                  : savedCardId.includes(record.id)
                                  ? "저장 완료"
                                  : "학습 카드로 저장"}
                              </button>
                              {saveError && saveError.id === record.id && (
                                <div className="mt-2 text-sm text-red-600">
                                  {saveError.message}
                                </div>
                              )}
                            </section>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
