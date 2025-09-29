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
    <div className="w-full">
      <header className="bg-primary relative flex items-center justify-between px-4 py-2 text-white">
        {" "}
        <form
          onSubmit={handleSearch}
          className="absolute left-1/2 flex -translate-x-1/2 transform items-center overflow-hidden rounded-lg bg-white"
        >
          <input
            type="text"
            placeholder="بحث"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1 text-black outline-none"
          />
          <button type="submit" className="bg-primary p-2">
            <Search className="h-4 w-4 text-white" />
          </button>
        </form>
        <div className="text-right">
          <h1 className="text-lg font-bold">رحلة تعلّم</h1>
          <p className="text-xs">Learn Journey</p>
        </div>
      </header>
      <nav className="mt-8 flex items-center justify-center gap-12 text-sm font-bold text-purple-900">
        <div className="flex items-center gap-1">
          <Home className="h-5 w-5 text-black" />
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "bg-primary rounded-md px-3 py-1 text-white"
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
              ? "bg-primary rounded-md px-3 py-1 text-white"
              : "hover:text-orange-600"
          }
        >
          التعليمات
        </NavLink>
        <NavLink
          to="/goals"
          className={({ isActive }) =>
            isActive
              ? "bg-primary rounded-md px-3 py-1 text-white"
              : "hover:text-orange-600"
          }
        >
          الأهداف
        </NavLink>

        <NavLink
          to="/content-map"
          className={({ isActive }) =>
            isActive
              ? "bg-primary rounded-md px-3 py-1 text-white"
              : "hover:text-orange-600"
          }
        >
          خريطة المحتوى
        </NavLink>
        <NavLink
          to="/course"
          className={({ isActive }) =>
            isActive
              ? "bg-primary rounded-md px-3 py-1 text-white"
              : "hover:text-orange-600"
          }
        >
          الكورس
        </NavLink>
      </nav>
    </div>
  );
}
