import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, RotateCcw, Sparkles, X } from "lucide-react";
import { LearningCardResponse, updateLearningCard } from "../../api/learningCard";
import { QuizScoreResponse, saveBestQuizScore } from "../../api/quizScore";
import { getLangLabel } from "../../utils/languages";

interface SwipeGameProps {
  cards: LearningCardResponse[];
  onRefreshCards?: () => Promise<void> | void;
}

type SwipeDecision = "review" | "memorized";

type SwipeRecord = {
  cardId: number;
  decision: SwipeDecision;
};

const GAME_CARD_COUNT = 10;
const SWIPE_THRESHOLD = 90;
const CLICK_DRAG_TOLERANCE = 8;
const DEFAULT_SCORE_NICKNAME = "guest";

function shuffleCards<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }

  return shuffled;
}

function buildSwipeDeck(cards: LearningCardResponse[]) {
  return shuffleCards(cards).slice(0, GAME_CARD_COUNT);
}

function formatElapsed(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;
  return `${minutes}:${String(remainSeconds).padStart(2, "0")}`;
}

function calculateSwipeScore(total: number, memorizedCount: number) {
  if (total === 0) return 0;
  return Math.round((memorizedCount / total) * 100);
}

function getScoreNickname() {
  const savedNickname = window.localStorage.getItem("nickname")?.trim();
  return savedNickname || DEFAULT_SCORE_NICKNAME;
}

export default function SwipeGame({ cards, onRefreshCards }: SwipeGameProps) {
  const [deck, setDeck] = useState<LearningCardResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [records, setRecords] = useState<SwipeRecord[]>([]);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [hasSavedScore, setHasSavedScore] = useState(false);
  const [bestScoreResult, setBestScoreResult] = useState<QuizScoreResponse | null>(null);
  const [scoreSaveWarning, setScoreSaveWarning] = useState<string | null>(null);
  const scoreSaveStartedRef = useRef(false);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerDeltaRef = useRef(0);
  const suppressClickRef = useRef(false);
  const ignoreNextClickRef = useRef(false);

  const resetGame = () => {
    setDeck(buildSwipeDeck(cards));
    setCurrentIndex(0);
    setRecords([]);
    setStartedAt(Date.now());
    setFinishedAt(null);
    setNow(Date.now());
    setDragX(0);
    setIsDragging(false);
    setIsCardFlipped(false);
    setPendingSyncCount(0);
    setSyncWarning(null);
    setIsResultOpen(false);
    setHasSavedScore(false);
    setBestScoreResult(null);
    setScoreSaveWarning(null);
    pointerStartXRef.current = null;
    pointerDeltaRef.current = 0;
    suppressClickRef.current = false;
    ignoreNextClickRef.current = false;
    scoreSaveStartedRef.current = false;
  };

  useEffect(() => {
    resetGame();
  }, [cards]);

  useEffect(() => {
    if (finishedAt !== null) return;

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [finishedAt]);

  const totalCount = deck.length;
  const completedCount = records.length;
  const memorizedCount = useMemo(() => records.filter((record) => record.decision === "memorized").length, [records]);
  const reviewCount = completedCount - memorizedCount;
  const progressPercent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const currentCard = deck[currentIndex] ?? null;
  const elapsedSeconds = Math.floor(((finishedAt ?? now) - startedAt) / 1000);
  const swipeScore = calculateSwipeScore(totalCount, memorizedCount);
  const isFinished = totalCount > 0 && completedCount === totalCount;
  const deckPreview = deck.slice(currentIndex + 1, currentIndex + 3);
  const swipeHint = dragX >= 24 ? "memorized" : dragX <= -24 ? "review" : null;

  const bestScoreText = bestScoreResult ? `${bestScoreResult.score}점` : hasSavedScore ? "확인 중..." : "-";

  const bestScoreMessage = bestScoreResult ? bestScoreResult.is_new_best ? "최고 점수를 갱신했습니다." : swipeScore === bestScoreResult.score ? "기존 최고 점수와 같아 기록은 유지됩니다." : "기존 최고 점수가 더 높아 기록은 유지됩니다." : null;

  const syncCardState = ( card: LearningCardResponse, nextIsMemorized: boolean ) => {
    if (card.is_memorized === nextIsMemorized) return;

    setPendingSyncCount((prev) => prev + 1);

    updateLearningCard(card.id, { is_memorized: nextIsMemorized })
      .catch((error) => {
        console.warn("Learning card sync failed.", error);
        setSyncWarning(
          "일부 카드의 암기 상태를 저장하지 못했습니다."
        );
      })
      .finally(() => {
        setPendingSyncCount((prev) => Math.max(0, prev - 1));
      });
  };

  const handleDecision = (decision: SwipeDecision) => {
    if (!currentCard) return;

    const nextIndex = currentIndex + 1;
    const nextIsMemorized = decision === "memorized";

    setRecords((prev) => [...prev, { cardId: currentCard.id, decision }]);
    setCurrentIndex(nextIndex);
    setDragX(0);
    setIsDragging(false);
    setIsCardFlipped(false);
    pointerStartXRef.current = null;
    pointerDeltaRef.current = 0;
    suppressClickRef.current = false;
    ignoreNextClickRef.current = true;

    syncCardState(currentCard, nextIsMemorized);

    if (nextIndex >= deck.length) {
      setFinishedAt(Date.now());
      setIsResultOpen(true);
    }
  };

  const releaseSwipe = () => {
    if (pointerDeltaRef.current >= SWIPE_THRESHOLD) {
      handleDecision("memorized");
      return;
    }

    if (pointerDeltaRef.current <= -SWIPE_THRESHOLD) {
      handleDecision("review");
      return;
    }

    setDragX(0);
    setIsDragging(false);
    pointerStartXRef.current = null;
    pointerDeltaRef.current = 0;
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!currentCard) return;

    event.preventDefault();
    pointerStartXRef.current = event.clientX;
    pointerDeltaRef.current = 0;
    suppressClickRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || pointerStartXRef.current === null) return;

    const nextDragX = event.clientX - pointerStartXRef.current;
    pointerDeltaRef.current = nextDragX;

    if (Math.abs(nextDragX) > CLICK_DRAG_TOLERANCE) {
      suppressClickRef.current = true;
    }

    setDragX(nextDragX);
  };

  const handlePointerEnd = () => {
    if (!isDragging) return;
    releaseSwipe();
  };

  const handleCardClick = () => {
    if (ignoreNextClickRef.current) {
      ignoreNextClickRef.current = false;
      return;
    }

    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }

    if (!currentCard) return;
    setIsCardFlipped((prev) => !prev);
  };

  useEffect(() => {
    if ( !isFinished || finishedAt === null || hasSavedScore || scoreSaveStartedRef.current ) {
      return;
    }

    scoreSaveStartedRef.current = true;
    setHasSavedScore(true);

    saveBestQuizScore({
      nickname: getScoreNickname(),
      quiz_type: "swipe",
      score: swipeScore,
    })
      .then((result) => {
        setBestScoreResult(result);
      })
      .catch((error) => {
        console.warn("점수 저장 실패.", error);
        setScoreSaveWarning( "점수 저장에 실패했습니다. 결과는 계속 확인할 수 있습니다." );
      });
  }, [finishedAt, hasSavedScore, isFinished, swipeScore]);

  const handleRestart = async () => {
    setIsResultOpen(false);

    if (!onRefreshCards) {
      resetGame();
      return;
    }

    try {
      await onRefreshCards();
    } catch (error) {
      console.warn("스와이프 카드 새로고침 실패.", error);
      resetGame();
    }
  };

  return (
    <section className="space-y-3 pb-10 md:space-y-4 md:pb-14">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 md:px-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              암기 판별
            </h2>
          </div>

          <button
            type="button"
            onClick={resetGame}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
            새 라운드
          </button>
        </div>

        <div className="border-t border-gray-200 px-4 py-3 md:px-5">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-gray-700">
              {`진행 ${completedCount} / ${totalCount}`}
            </span>
            <span className="text-gray-500">{`${progressPercent}%`}</span>
          </div>

          <div className="h-2 rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 px-3 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                  <Clock3 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-medium text-gray-500">
                    경과 시간
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatElapsed(elapsedSeconds)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 px-3 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-medium text-gray-500">
                    암기 완료
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {memorizedCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 px-3 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[11px] font-medium text-gray-500">
                    현재 점수
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {`${swipeScore}점`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {pendingSyncCount > 0 && (
            <p className="mt-3 text-xs font-medium text-gray-500">
              {`카드 상태 동기화 중... (${pendingSyncCount})`}
            </p>
          )}
        </div>
      </div>

      {currentCard ? (
        <div className="relative mx-auto flex min-h-[460px] max-w-[760px] items-center justify-center px-4 py-6">
          <div className="absolute inset-y-10 left-0 hidden w-40 items-center md:flex">
            <div
              className={`w-full rounded-3xl border-2 border-dashed px-4 py-8 text-center transition-all ${
                swipeHint === "review"
                  ? "border-red-400 bg-red-50 text-red-600"
                  : "border-red-200 bg-white/70 text-red-300"
              }`}
            >
              <ArrowLeft className="mx-auto mb-3 h-5 w-5" />
              <p className="text-sm font-semibold">왼쪽</p>
              <p className="mt-1 text-xs">뜻을 모르겠어요</p>
            </div>
          </div>

          <div className="absolute inset-y-10 right-0 hidden w-40 items-center md:flex">
            <div
              className={`w-full rounded-3xl border-2 border-dashed px-4 py-8 text-center transition-all ${
                swipeHint === "memorized"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                  : "border-emerald-200 bg-white/70 text-emerald-300"
              }`}
            >
              <ArrowRight className="mx-auto mb-3 h-5 w-5" />
              <p className="text-sm font-semibold">오른쪽</p>
              <p className="mt-1 text-xs">뜻을 알고 있어요</p>
            </div>
          </div>

          {deckPreview
            .slice()
            .reverse()
            .map((card, index) => (
              <div
                key={card.id}
                className="absolute inset-x-10 top-10 mx-auto h-[340px] max-w-[420px] rounded-[28px] border border-gray-200 bg-white shadow-sm"
                style={{
                  transform: `translateY(${(index + 1) * 12}px) scale(${1 - index * 0.04})`,
                  opacity: 0.55 - index * 0.15,
                }}
              />
            ))}

          <div
            className="relative h-[340px] w-full max-w-[420px]"
            style={{ perspective: "1400px" }}
          >
            <div
              onClick={handleCardClick}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onDragStart={(event) => event.preventDefault()}
              draggable={false}
              className={`relative h-full w-full select-none rounded-[28px] transition-transform duration-300 ${
                isCardFlipped
                  ? isDragging
                    ? "cursor-grabbing"
                    : "cursor-grab"
                  : "cursor-pointer"
              }`}
              style={{
                touchAction: "none",
                userSelect: "none",
                WebkitUserSelect: "none",
                transform: `translateX(${dragX}px) rotate(${dragX / 18}deg) rotateY(${isCardFlipped ? 180 : 0}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="absolute inset-0 select-none rounded-[28px] border border-gray-200 bg-white p-6 shadow-lg"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
                    {`${getLangLabel(currentCard.target_lang)} 카드`}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {`${currentIndex + 1} / ${totalCount}`}
                  </span>
                </div>

                <div className="rounded-2xl bg-emerald-50 px-4 py-5">
                  <p className="mb-2 text-xs font-semibold text-emerald-700">
                    번역문
                  </p>
                  <p className="whitespace-pre-wrap text-base leading-7 text-gray-800">
                    {currentCard.translated_text}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-gray-50 px-4 py-4">
                  <p className="text-sm font-medium text-gray-700">
                    뜻이 떠오르면 카드를 눌러 정답을 확인하세요.
                  </p>
                </div>
              </div>

              <div
                className="absolute inset-0 select-none rounded-[28px] border border-gray-200 bg-white p-6 shadow-lg"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-500">
                    정답
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {`${getLangLabel(currentCard.source_lang)} 원문`}
                  </span>
                </div>

                <div className="rounded-2xl bg-blue-50 px-4 py-5">
                  <p className="mb-2 text-xs font-semibold text-blue-700">
                    원문
                  </p>
                  <p className="whitespace-pre-wrap text-base leading-7 text-gray-800">
                    {currentCard.source_text}
                  </p>
                </div>

                <div className="mt-5 rounded-2xl bg-gray-50 px-4 py-4">
                  <p className="mb-2 text-xs font-semibold text-gray-500">
                    방금 본 번역문
                  </p>
                  <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                    {currentCard.translated_text}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs font-semibold">
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center text-sm text-gray-500 shadow-sm">
          현재 진행 중인 카드가 없습니다. 새 라운드로 다시 시작하세요.
        </div>
      )}
      {syncWarning && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
          {syncWarning}
        </p>
      )}

      {isResultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-[420px] rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  게임 완료
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  라운드가 끝났습니다. 이번 결과를 확인하세요.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsResultOpen(false)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 px-5 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 px-4 py-4">
                  <p className="text-xs font-medium text-gray-500">
                    경과 시간
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {formatElapsed(elapsedSeconds)}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 px-4 py-4">
                  <p className="text-xs font-medium text-gray-500">
                    복습 필요
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {reviewCount}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-emerald-50 px-4 py-4">
                  <p className="text-xs font-medium text-emerald-700">
                    암기 완료
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {memorizedCount}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 px-4 py-4">
                  <p className="text-xs font-medium text-blue-700">
                    이번 점수
                  </p>
                  <p className="mt-1 text-xl font-semibold text-gray-900">
                    {`${swipeScore}점`}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 px-4 py-4">
                <p className="text-xs font-medium text-gray-500">
                  최고 점수
                </p>
                <p className="mt-1 text-xl font-semibold text-gray-900">
                  {bestScoreText}
                </p>
              </div>

              {bestScoreMessage && (
                <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                  {bestScoreMessage}
                </p>
              )}

              {scoreSaveWarning && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                  {scoreSaveWarning}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsResultOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                닫기
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
              >
                <Check className="h-4 w-4" />
                다시 하기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
