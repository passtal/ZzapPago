export default function ParrotLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 머리+몸 실루엣 */}
      <path
        d="M18 3C12 3 7 7.5 7 13c0 3.5 1.8 6.5 4.5 8.2L10 30c-.3 1 .4 2 1.4 2h13.2c1 0 1.7-1 1.4-2l-1.5-8.8C27.2 19.5 29 16.5 29 13c0-5.5-5-10-11-10z"
        fill="#1ec800"
      />
      {/* 흰 얼굴 */}
      <ellipse cx="18" cy="13.5" rx="6.5" ry="5.5" fill="white" />
      {/* 왼눈 */}
      <circle cx="15" cy="12.5" r="2" fill="#333" />
      <circle cx="15.6" cy="11.9" r="0.6" fill="white" />
      {/* 오른눈 */}
      <circle cx="21" cy="12.5" r="2" fill="#333" />
      <circle cx="21.6" cy="11.9" r="0.6" fill="white" />
      {/* 부리 */}
      <path d="M16.5 16 L18 19 L19.5 16Z" fill="#ff8a00" />
    </svg>
  );
}
