import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

export interface RankingResponse {
  id: number;
  nickname: string;
  total_score: number;
  translate_count: number;
  quiz_score: number;
  updated_at: string;
}

export async function getRankings(limit: number = 50): Promise<RankingResponse[]> {
  const { data } = await api.get<RankingResponse[]>("/rankings/", {
    params: { limit },
  });
  return data;
}

export async function updateRankingTranslate(nickname: string): Promise<RankingResponse> {
  const { data } = await api.post<RankingResponse>(`/rankings/translate/${encodeURIComponent(nickname)}`);
  return data;
}
