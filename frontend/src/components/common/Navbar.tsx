import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  History,
  Trophy,
  Gamepad2,
  User,
  BookOpen,
  Menu,
  X,
} from "lucide-react";
const navItems = [
  { path: "/", label: "번역", icon: null },
  { path: "/history", label: "번역 내역", icon: History },
  { path: "/learning-cards", label: "학습 카드", icon: BookOpen },
  { path: "/ranking", label: "랭킹", icon: Trophy },
  { path: "/game", label: "미니게임", icon: Gamepad2 },
  { path: "/mypage", label: "마이페이지", icon: User },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* 로고 */}
        <Link to="/" className="flex items-center">
          <span className="text-[22px] font-bold tracking-tight text-[#1ec800]">짭파고</span>
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-emerald-600"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            );
          })}
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* 모바일 드롭다운 */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 pb-4 md:hidden">
          {navItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-emerald-600"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
