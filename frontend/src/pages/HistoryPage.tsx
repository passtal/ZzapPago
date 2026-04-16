import { useState, useEffect } from "react"
import { TranslationRecord, getTranslateHistory } from "../api/translate"

const formatDate = (value: string) => {
  const date = new Date(value)
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value))
}

export default function HistoryPage() {
  const [records, setRecords] = useState<TranslationRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")


  const loadHistory = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await getTranslateHistory()
      setRecords(data)
    } catch (error) {
      setError("번역 내역을 불러오는 데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadHistory(); }, []);

  return (
	  <div className="mx-auto max-w-[960px] px-4 pt-6">
      <h1>번역 내역</h1>
      {loading && <p>로딩 중...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && records.length === 0 && (
        <p>번역 내역이 없습니다.</p>
      )}

      {!loading && !error && records.length > 0 && (
        <table className="border rounded p-4 mb-3">
          <thead>
            <tr>
              <th className="border p-2">입력 유형</th>
              <th className="border p-2">원본 언어</th>
              <th className="border p-2">대상 언어</th>
              <th className="border p-2">원본 텍스트</th>
              <th className="border p-2">번역된 텍스트</th>
              <th className="border p-2">번역 시간</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{record.input_type}</td>
                <td className="border p-2">{record.source_lang}</td>
                <td className="border p-2">{record.target_lang}</td>
                <td className="border p-2">{record.source_text}</td>
                <td className="border p-2">{record.translated_text}</td>
                <td className="border p-2">{formatDate(record.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

  )
}