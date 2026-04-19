import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

export interface QuizScoreCreateRequest {
	nickname: string;
	quiz_type: string;
	score: number;
}

export interface QuizScoreResponse {
  id: number;
  nickname: string;
  quiz_type: string;
  score: number;
  played_at: string;
  is_new_best: boolean;
}

export async function saveBestQuizScore(req: QuizScoreCreateRequest): Promise<QuizScoreResponse> {
	const {data} = await api.post<QuizScoreResponse>("/quiz-score/create", req);
	return data;
}
