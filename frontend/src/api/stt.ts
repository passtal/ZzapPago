import axios from 'axios'

const api  = axios.create({baseURL: "/api/v1"});

export interface STTResponse {
    text: string;
    language: string | null;
}

export async function postSTT(
    audioBlob: Blob,
    language?: string
) : Promise<STTResponse> {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    if (language) {
        formData.append("language", language);
    }

    const {data} = await api.post<STTResponse>("/stt/", formData, {
        headers: {"Content-Type": "multipart/form-data"},
    });
    return data;
}