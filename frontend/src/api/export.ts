import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

export interface ExportRequest {
  translation_id: number;
  format: "pdf" | "word" | "img";
}

export interface ExportResponse {
  id: number;
  translation_id: number;
  format: string;
  file_path: string;
  created_at: string;
}

export async function createExport(req: ExportRequest): Promise<ExportResponse> {
  const { data } = await api.post<ExportResponse>("/exports/", req);
  return data;
}

export function getExportDownloadUrl(exportId: number): string {
  return `/api/v1/exports/download/${exportId}`;
}
