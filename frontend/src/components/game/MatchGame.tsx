import { useEffect, useMemo, useState } from "react";
import { Clock3, RotateCcw, ShieldAlert, Sparkles, X } from "lucide-react";
import { LearningCardResponse } from "../../api/learningCard";

interface MatchGameProps {
  cards: LearningCardResponse[];
}

type MatchTile = {
  id: string;
  pairId: number;
  text: string;
  side: "question" | "answer";
};

const GAME_PAIR_COUNT = 6;
const MISMATCH_PENALTY_MS = 1000;

// 셔플 함수
function shuffleTiles<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }

  return shuffled;
}

// 게임 카드 생성 함수
function buildMatchTiles(cards: LearningCardResponse[]): MatchTile[] {
  const tiles = cards
    .map((card) => [
      {
        id: `${card.id}-question`,
        pairId: card.id,
        text: card.source_text,
        side: "question" as const,
      },
      {
        id: `${card.id}-answer`,
        pairId: card.id,
        text: card.translated_text,
        side: "answer" as const,
      },
    ])
    .flat();

  return shuffleTiles(tiles);
}

const formatSeconds = (value: number) => `${value}초`;

// 짝맞추기 게임 컴포넌트
export default function MatchGame({ cards }: MatchGameProps) {
  const [tiles, setTiles] = useState<MatchTile[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [penaltyTime, setPenaltyTime] = useState(0);
  const [isResultOpen, setIsResultOpen] = useState(false);

  // 게임 초기화 함수
  const resetGame = () => {
    const gameCards = cards.slice(0, GAME_PAIR_COUNT);

    setTiles(buildMatchTiles(gameCards));
    setSelectedIds([]);
    setMatchedPairIds([]);
    setLocked(false);
    setStartAt(null);
    setEndAt(null);
    setNow(Date.now());
    setPenaltyTime(0);
    setIsResultOpen(false);
  };

	const totalPairCount = useMemo(() => tiles.length / 2, [tiles]);
	const matchedCount = matchedPairIds.length;
	const progressPercent =
		totalPairCount === 0 ? 0 : Math.round((matchedCount / totalPairCount) * 100);

	const elapsedTime = startAt === null ? 0 : (endAt ?? now) - startAt;
	const elapsedSeconds = Math.floor(elapsedTime / 1000);
	const penaltySeconds = Math.floor(penaltyTime / 1000);
	const finalSeconds = elapsedSeconds + penaltySeconds;
	const isFinished =
		totalPairCount > 0 && matchedPairIds.length === totalPairCount;

	const isTileSelected = (tile: MatchTile) => selectedIds.includes(tile.id);
	const isTileMatched = (tile: MatchTile) => matchedPairIds.includes(tile.pairId);

	// 타일 클릭 핸들러
	const handleTileClick = (tile: MatchTile) => {
		if (locked) return;
		if (selectedIds.includes(tile.id)) return;
		if (matchedPairIds.includes(tile.pairId)) return;
		if (selectedIds.length === 2) return;

		if (startAt === null) {
		const started = Date.now();
		setStartAt(started);
		setNow(started);
		}

		setSelectedIds((prev) => [...prev, tile.id]);
	};

	// 카드가 바뀌면 게임 다시 시작
	useEffect(() => {
		resetGame();
	}, [cards]);

	// 타일 2개 선택 후 비교 로직
	useEffect(() => {
		if (selectedIds.length !== 2) return;

		const [firstId, secondId] = selectedIds;
		const firstTile = tiles.find((tile) => tile.id === firstId);
		const secondTile = tiles.find((tile) => tile.id === secondId);

		if (!firstTile || !secondTile) return;

		setLocked(true);

		const isMatch =
		firstTile.pairId === secondTile.pairId &&
		firstTile.side !== secondTile.side;

		if (isMatch) {
		setMatchedPairIds((prev) => [...prev, firstTile.pairId]);
		setSelectedIds([]);
		setLocked(false);
		return;
		}

		const timeoutId = window.setTimeout(() => {
		setSelectedIds([]);
		setLocked(false);
		setPenaltyTime((prev) => prev + MISMATCH_PENALTY_MS);
		}, 600);

		return () => window.clearTimeout(timeoutId);
	}, [selectedIds, tiles]);

	// 타이머 업데이트
	useEffect(() => {
		if (startAt === null || endAt !== null) return;

		const intervalId = window.setInterval(() => {
		setNow(Date.now());
		}, 1000);

		return () => window.clearInterval(intervalId);
	}, [startAt, endAt]);

	// 게임 종료 로직
	useEffect(() => {
		if (totalPairCount === 0 || endAt !== null) return;

		if (matchedPairIds.length === totalPairCount) {
		setEndAt(Date.now());
		setIsResultOpen(true);
		}
	}, [matchedPairIds, totalPairCount, endAt]);

	return (
		<section className="space-y-3 pb-10 md:space-y-4 md:pb-14">
		{/* 상단 요약 패널 */}
		<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
			<div className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 md:px-5">
			<div>
				<h2 className="text-base font-semibold text-gray-900">짝맞추기</h2>
			</div>

			<button
				type="button"
				onClick={resetGame}
				className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
			>
				<RotateCcw className="h-4 w-4" />
				다시 섞기
			</button>
			</div>

			<div className="border-t border-gray-200 px-4 py-3 md:px-5">
			<div className="mb-2 flex items-center justify-between text-xs">
				<span className="font-medium text-gray-700">
				{`진행 ${matchedCount} / ${totalPairCount}`}
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
					<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
					<Clock3 className="h-4 w-4" />
					</span>
					<div>
					<p className="text-[11px] font-medium text-gray-500">
						경과 시간
					</p>
					<p className="text-sm font-semibold text-gray-900">
						{formatSeconds(elapsedSeconds)}
					</p>
					</div>
				</div>
				</div>

				<div className="rounded-xl bg-gray-50 px-3 py-3">
				<div className="flex items-center gap-2">
					<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500">
					<ShieldAlert className="h-4 w-4" />
					</span>
					<div>
					<p className="text-[11px] font-medium text-gray-500">페널티</p>
					<p className="text-sm font-semibold text-gray-900">
						{`+${formatSeconds(penaltySeconds)}`}
					</p>
					</div>
				</div>
				</div>

				<div className="rounded-xl bg-gray-50 px-3 py-3">
				<div className="flex items-center gap-2">
					<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-500">
					<Sparkles className="h-4 w-4" />
					</span>
					<div>
					<p className="text-[11px] font-medium text-gray-500">상태</p>
					<p className="text-sm font-semibold text-gray-900">
						{isFinished ? "완료" : locked ? "비교 중..." : "진행 중"}
					</p>
					</div>
				</div>
				</div>
			</div>
			</div>
		</div>

		{/* 게임 카드 영역 */}
		<div className="grid gap-3 pb-2 sm:grid-cols-2 lg:grid-cols-4">
			{tiles.map((tile) => {
			const isSelected = isTileSelected(tile);
			const isMatched = isTileMatched(tile);

			return (
				<button
				key={tile.id}
				type="button"
				onClick={() => handleTileClick(tile)}
				disabled={locked || isMatched}
				className={`min-h-[176px] rounded-xl border px-4 py-4 text-left transition-colors disabled:cursor-not-allowed ${
					isMatched
					? "border-emerald-500 bg-emerald-50"
					: isSelected
						? "border-blue-400 bg-blue-50"
						: tile.side === "question"
						? "border-gray-200 bg-white hover:border-gray-300"
						: "border-purple-200 bg-purple-50/50 hover:border-purple-300"
				}`}
				>
				<p className="mb-3 text-[11px] font-semibold text-gray-500">
					{tile.side === "question" ? "원문" : "번역"}
				</p>
				<p className="break-words text-sm leading-6 text-gray-800">
					{tile.text}
				</p>
				</button>
			);
			})}
		</div>

		{/* 게임 종료 결과 모달 */}
		{isResultOpen && (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
			<div className="w-full max-w-[420px] rounded-2xl bg-white shadow-xl">
				<div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
				<div>
					<h3 className="text-lg font-semibold text-gray-900">게임 완료</h3>
					<p className="mt-1 text-sm text-gray-500">
					모든 짝을 맞췄습니다.
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
				<div className="rounded-xl bg-gray-50 px-4 py-4">
					<p className="text-xs font-medium text-gray-500">경과 시간</p>
					<p className="mt-1 text-lg font-semibold text-gray-900">
					{formatSeconds(elapsedSeconds)}
					</p>
				</div>

				<div className="rounded-xl bg-gray-50 px-4 py-4">
					<p className="text-xs font-medium text-gray-500">페널티</p>
					<p className="mt-1 text-lg font-semibold text-gray-900">
					{`+${formatSeconds(penaltySeconds)}`}
					</p>
				</div>

				<div className="rounded-xl bg-emerald-50 px-4 py-4">
					<p className="text-xs font-medium text-emerald-700">최종 기록</p>
					<p className="mt-1 text-2xl font-semibold text-gray-900">
					{formatSeconds(finalSeconds)}
					</p>
				</div>
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
					onClick={resetGame}
					className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
				>
					다시 하기
				</button>
				</div>
			</div>
			</div>
		)}
		</section>
	);
}
