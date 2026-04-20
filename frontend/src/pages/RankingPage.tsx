import { useEffect, useState } from "react";
import { Trophy, Medal, Hash, Languages, Gamepad2 } from "lucide-react";
import { getRankings, type RankingResponse } from "../api/ranking";

const getRankBadge = (index: number) => {
  if (index === 0) return { emoji: "🥇", color: "text-yellow-500" };
  if (index === 1) return { emoji: "🥈", color: "text-gray-400" };
  if (index === 2) return { emoji: "🥉", color: "text-amber-600" };
  return null;
};

export default function RankingPage() {
  const [rankings, setRankings] = useState<RankingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getRankings(50);
        setRankings(data);
      } catch {
        setError("랭킹 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-[960px] px-4 pt-6 pb-10">
      <div className="mb-5 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-emerald-500" />
        <h1 className="text-[24px] font-semibold text-gray-900">랭킹</h1>
      </div>

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-sm text-gray-500 shadow-sm">
          랭킹 정보를 불러오는 중입니다.
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 shadow-sm">
          {error}
        </div>
      )}

      {!loading && !error && rankings.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-8 text-sm text-gray-500 shadow-sm">
          아직 랭킹 데이터가 없습니다.
        </div>
      )}

      {!loading && !error && rankings.length > 0 && (
        <>
          {/* 상위 3명 하이라이트 */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            {rankings.slice(0, 3).map((r, i) => {
              const badge = getRankBadge(i);
              return (
                <div
                  key={r.id}
                  className={`relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm ${
                    i === 0
                      ? "border-yellow-300 ring-2 ring-yellow-100"
                      : "border-gray-200"
                  }`}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-2xl">{badge?.emoji}</span>
                    <span className="text-lg font-bold text-gray-900 truncate">
                      {r.nickname}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-emerald-600">
                    {r.total_score.toLocaleString()}
                    <span className="ml-1 text-sm font-medium text-gray-400">점</span>
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Languages className="h-3.5 w-3.5" />
                      번역 {r.translate_count}회
                    </span>
                    <span className="flex items-center gap-1">
                      <Gamepad2 className="h-3.5 w-3.5" />
                      퀴즈 {r.quiz_score}점
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 전체 순위 테이블 */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">
                전체 순위
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {rankings.map((r, i) => {
                const badge = getRankBadge(i);
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50"
                  >
                    {/* 순위 */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                      {badge ? (
                        <span className="text-lg">{badge.emoji}</span>
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-500">
                          {i + 1}
                        </span>
                      )}
                    </div>

                    {/* 닉네임 */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {r.nickname}
                      </p>
                    </div>

                    {/* 점수 상세 */}
                    <div className="hidden items-center gap-4 text-xs text-gray-500 sm:flex">
                      <span className="flex items-center gap-1">
                        <Languages className="h-3.5 w-3.5" />
                        {r.translate_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="h-3.5 w-3.5" />
                        {r.quiz_score}
                      </span>
                    </div>

                    {/* 총점 */}
                    <div className="text-right">
                      <span className="text-base font-bold text-emerald-600">
                        {r.total_score.toLocaleString()}
                      </span>
                      <span className="ml-0.5 text-xs text-gray-400">점</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
