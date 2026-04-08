export const LANGUAGES = [
  { code: "ko", label: "한국어" },
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "zh", label: "中文" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "th", label: "ภาษาไทย" },
  { code: "ru", label: "Русский" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"];

export function getLangLabel(code: string): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? code;
}
