import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, Languages } from "lucide-react";
import {
  LearningCardResponse,
  readLearningCard,
  updateLearningCard,
} from "../api/learningCard";
import { getLangLabel } from "../utils/languages";

const CARD_FILTERS = [
  { label: "암기 전", value: false },
  { label: "암기 완료", value: true },
] as const;

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const getPreviewText = (text: string, maxLength: number = 120) => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
};

export default function LearningCardsPageView() {
  const [cards, setCards] = useState<LearningCardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [memorizedFilter, setMemorizedFilter] = useState<boolean | null>(null);
  const [updatingCardId, setUpdatingCardId] = useState<number | null>(null);
  const [updateError, setUpdateError] = useState<{
    id: number;
    message: string;
  } | null>(null);

  const loadLearningCards = async (filter: boolean | null) => {
    setLoading(true);
    setError("");

    try {
      const data = await readLearningCard(0, 20, filter ?? undefined);
      setCards(data);
    } catch {
      setError(
        "학습 카드를 불러오는 도중 오류가 발생했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLearningCards(memorizedFilter);
  }, [memorizedFilter]);

  const memorizedCount = useMemo(() => {
    return cards.filter((card) => card.is_memorized).length;
  }, [cards]);

  const handleToggleMemorized = async (card: LearningCardResponse) => {
    const nextIsMemorized = !card.is_memorized;
    setUpdatingCardId(card.id);
    setUpdateError(null);

    try {
      const updatedCard = await updateLearningCard(card.id, {
        is_memorized: nextIsMemorized,
      });

      setCards((current) => {
        const nextCards = current.map((item) =>
          item.id === card.id ? updatedCard : item
        );

        if (
          memorizedFilter !== null &&
          updatedCard.is_memorized !== memorizedFilter
        ) {
          return nextCards.filter((item) => item.id !== card.id);
        }

        return nextCards;
      });
    } catch {
      setUpdateError({
        id: card.id,
        message:
          "암기 상태를 변경하는 도중 오류가 발생했습니다.",
      });
    } finally {
      setUpdatingCardId(null);
    }
  };

  return (
    <div className="mx-auto max-w-[960px] px-4 pt-6">

      {!loading && !error && (
        <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="flex flex-wrap items-center gap-2">
            {CARD_FILTERS.map((filter) => {
              const isActive = memorizedFilter === filter.value;

              return (
                <button
                  key={filter.label}
                  type="button"
                  onClick={() =>
                    setMemorizedFilter((current) =>
                      current === filter.value ? null : filter.value
                    )
                  }
                  className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-medium transition-all ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                      : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-xs font-medium text-gray-500">
                {"암기 완료"}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {memorizedCount} / {cards.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-sm text-gray-500 shadow-sm">
          {
            "학습 카드를 불러오는 중입니다."
          }
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && cards.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-sm text-gray-500 shadow-sm">
          {memorizedFilter === null
            ? "저장된 학습 카드가 없습니다."
            : memorizedFilter
              ? "암기 완료된 카드가 없습니다."
              : "암기 전 카드가 없습니다."}
        </div>
      )}

      {!loading && !error && cards.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                    <BookOpen className="h-3.5 w-3.5" />
                    {`Card #${card.id}`}
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-2.5 py-1 text-[11px] font-medium text-gray-500">
                    <Languages className="h-3.5 w-3.5" />
                    {getLangLabel(card.source_lang)} to{" "}
                    {getLangLabel(card.target_lang)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => void handleToggleMemorized(card)}
                  disabled={updatingCardId === card.id}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    card.is_memorized
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      : "border-gray-300 text-gray-500 hover:border-emerald-400 hover:text-emerald-600"
                  }`}
                >
                  {updatingCardId === card.id
                    ? "변경 중..."
                    : card.is_memorized
                      ? "암기 완료"
                      : "암기 전"}
                </button>
              </div>

              <div className="space-y-4 px-5 py-5">
                <section>
                  <p className="mb-2 text-xs font-semibold text-gray-500">
                    {"원문"}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                    {getPreviewText(card.source_text)}
                  </p>
                </section>

                <section className="rounded-xl bg-gray-50 px-4 py-4">
                  <p className="mb-2 text-xs font-semibold text-emerald-700">
                    {"번역"}
                  </p>
                  <p className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                    {getPreviewText(card.translated_text)}
                  </p>
                </section>
              </div>

              <div className="border-t border-gray-200 px-5 py-3 text-xs text-gray-400">
                <span>{formatDate(card.created_at)}</span>
              </div>

              {updateError && updateError.id === card.id && (
                <div className="px-5 pb-4 text-sm text-red-600">
                  {updateError.message}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
