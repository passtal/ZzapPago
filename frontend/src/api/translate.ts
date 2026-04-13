import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

export interface TranslateRequest {
  source_lang: string;
  target_lang: string;
  text: string;
}

export interface TranslateResponse {
  source_lang: string;
  target_lang: string;
  source_text: string;
  translated_text: string;
}

export interface TranslationRecord {
  id: number;
  source_lang: string;
  target_lang: string;
  source_text: string;
  translated_text: string;
  input_type: "text" | "voice" | "document" | "website";
  latitude: number | null;
  longitude: number | null;
  country_code: string | null;
  created_at: string;
}

export async function postTranslate(
  req: TranslateRequest
): Promise<TranslateResponse> {
  const { data } = await api.post<TranslateResponse>("/translate/", req);
  return data;
}

export async function getTranslateHistory(skip: number = 0, limit: number = 10): Promise<TranslationRecord[]> {
  const { data } = await api.get<TranslationRecord[]>("/translate/history", {
    params: { skip, limit },
  });
  return data;
}