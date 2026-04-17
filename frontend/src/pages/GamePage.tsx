import { useEffect, useState } from "react";
import { LearningCardResponse, readLearningCard } from "../api/learningCard";
import MatchGame from "../components/game/MatchGame";
import SwipeGame from "../components/game/SwipeGame";

type GameMode = "swipe" | "match";

export default function GamePage() {
  const [mode, setMode] = useState<GameMode>("match");
  const [cards, setCards] = useState<LearningCardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGameCards = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await readLearningCard(0, 12, false);
      setCards(data);
    } catch {
      setError("게임 카드를 불러오는 도중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGameCards();
  }, []);

  return (
    <div className="mx-auto max-w-[960px] px-4 pt-6">
      <div className="mb-4">
        <h1 className="text-[24px] font-semibold text-gray-900">미니게임</h1>
      </div>

      {!loading && !error && cards.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("match")}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
              mode === "match"
                ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            짝맞추기
          </button>

          <button
            type="button"
            onClick={() => setMode("swipe")}
            className={`rounded-full border px-4 py-2 text-[13px] font-medium transition-colors ${
              mode === "swipe"
                ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
            }`}
          >
            암기 판별
          </button>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-sm text-gray-500 shadow-sm">
          게임 카드를 불러오는 중입니다.
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && cards.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-sm text-gray-500 shadow-sm">
          게임에 쓸 학습 카드가 없습니다.
        </div>
      )}

      {!loading && !error && cards.length > 0 && (
        <>{mode === "match" ? <MatchGame cards={cards} /> : <SwipeGame />}</>
      )}
    </div>
  );
}
