import { LANGUAGES } from "../../utils/languages";
import { ChevronDown } from "lucide-react";

interface Props {
  value: string;
  onChange: (code: string) => void;
  label: string;
}

export default function LanguageSelector({ value, onChange, label }: Props) {
  return (
    <div className="relative inline-flex items-center gap-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none cursor-pointer bg-transparent py-1 pr-7 text-[15px] font-semibold text-gray-800 transition-colors hover:text-emerald-600 focus:outline-none"
      >
        {LANGUAGES.map(({ code, label: langLabel }) => (
          <option key={code} value={code}>
            {langLabel}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-gray-400" />
    </div>
  );
}
