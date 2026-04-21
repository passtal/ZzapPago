import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
});

export interface TtsRequest {
  text: string;
  lang: string;
  slow?: boolean;
}

export async function requestTtsAudio(req: TtsRequest): Promise<Blob> {
  const { data } = await api.post("/tts/speak", req, {
    responseType: "blob",
  });
  return data;
}
