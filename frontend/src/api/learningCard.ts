import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

export interface LearningCardCreateRequest {
	translation_id: number;
}

export interface LearningCardUpdateRequest {
  is_memorized: boolean;
}

export interface LearningCardResponse {
  id: number;
  translation_id: number;
  source_lang: string;
  target_lang: string;
  source_text: string;
  translated_text: string;
  is_memorized: boolean;
  created_at: string;
}

export async function createLearningCard(req: LearningCardCreateRequest): Promise<LearningCardResponse> {
	const {data} = await api.post<LearningCardResponse>("/learning-cards/create", req);
	return data;
}

export async function readLearningCard(skip = 0, limit = 20, is_memorized?: boolean): Promise<LearningCardResponse[]> {
	const {data} = await api.get<LearningCardResponse[]>("/learning-cards/", {
		params: { skip, limit, is_memorized }
	});
	return data;
}

export async function updateLearningCard(cardId: number, req: LearningCardUpdateRequest): Promise<LearningCardResponse> {
  const { data } = await api.patch<LearningCardResponse>(`/learning-cards/${cardId}`, req);
  return data;
}
