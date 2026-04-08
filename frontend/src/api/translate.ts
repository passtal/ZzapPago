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

export async function postTranslate(
  req: TranslateRequest
): Promise<TranslateResponse> {
  const { data } = await api.post<TranslateResponse>("/translate/", req);
  return data;
}
