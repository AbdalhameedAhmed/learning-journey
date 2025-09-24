import { useState } from "react";
import { Search, Home } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", search);
  };

  return (
    <div>
      {/* ---------------- NAVBAR ---------------- */}
      <header
        className="text-white px-4 py-2 flex items-center justify-between relative"
        style={{ backgroundColor: "#FFB732" }}
      >
        {/* Center: Search */}
        <form
          onSubmit={handleSearch}
          className="absolute left-1/2 transform -translate-x-1/2 flex items-center bg-white rounded-lg overflow-hidden"
        >
          <input
            type="text"
            placeholder="بحث"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 text-black outline-none"
          />
          <button type="submit" className="bg-[#FFB732] p-2">
            <Search className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Right: Logo/Title */}
        <div className="text-right">
          <h1 className="font-bold text-lg">رحلة تعلّم</h1>
          <p className="text-xs">Learn Journey</p>
        </div>
      </header>

      {/* ---------------- TABS SECTION ---------------- */}
      <nav className="flex justify-center gap-12 mt-8 text-sm font-bold text-purple-900">
        {/* Home link with icon close to text */}
        <div className="flex items-center gap-1">
          <Home className="w-5 h-5 text-black" />
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "px-3 py-1 rounded-md bg-[#FFB732] text-white"
                : "hover:text-orange-600"
            }
          >
            الصفحة الرئيسية
          </NavLink>
        </div>

        <NavLink
          to="/instructions"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 rounded-md bg-[#FFB732] text-white"
              : "hover:text-orange-600"
          }
        >
          التعليمات
        </NavLink>

        <NavLink
          to="/goals"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 rounded-md bg-[#FFB732] text-white"
              : "hover:text-orange-600"
          }
        >
          الأهداف
        </NavLink>

        <NavLink
          to="/content-map"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 rounded-md bg-[#FFB732] text-white"
              : "hover:text-orange-600"
          }
        >
          خريطة المحتوى
        </NavLink>

        <NavLink
          to="/course"
          className={({ isActive }) =>
            isActive
              ? "px-3 py-1 rounded-md bg-[#FFB732] text-white"
              : "hover:text-orange-600"
          }
        >
          الكورس
        </NavLink>
      </nav>
    </div>
  );
}
