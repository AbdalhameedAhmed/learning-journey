import { useLogout } from "@/hooks/auth/useLogout";
import { ChartColumn, NotepadText, LogOut } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

export default function Sidebar({
  setActiveView,
}: {
  setActiveView: Dispatch<SetStateAction<"dashboard" | "detail" | "exams">>;
}) {
  const { logout } = useLogout();
  
  const menuItemClass =
    "flex items-center p-3 text-white gap-1 transition-colors duration-200 cursor-pointer rounded-lg bg-blue-600 hover:bg-blue-700";

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800 p-4 shadow-xl">
      <div className="mb-8 text-2xl font-semibold text-white">لوحة التحكم</div>

      <nav className="space-y-2">
        {/* Menu Item: Student Progress */}
        <div
          className={menuItemClass}
          onClick={() => setActiveView("dashboard")}
        >
          <ChartColumn size={16} />
          تقدم الطلاب
        </div>

        <div className={menuItemClass} onClick={() => setActiveView("exams")}>
          <NotepadText size={16} />
          تقارير اﻹختبارات
        </div>
      </nav>

      <div className="flex-grow"></div>

      <div className={menuItemClass + " mt-auto"} onClick={() => logout()}>
        <LogOut size={16} />
        تسجيل الخروج
      </div>
    </div>
  );
}
