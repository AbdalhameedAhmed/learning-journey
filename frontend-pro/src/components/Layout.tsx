import { Palette } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import SettingsSlider from "./SettingsSilder";

const Layout = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center gap-4 dark:bg-slate-900">
      <Navbar />
      <Outlet />

      <button
        className="fixed bottom-4 left-4 z-10 cursor-pointer rounded-full border-2 border-gray-400 bg-white p-2 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg dark:bg-slate-800"
        onClick={toggleSettings}
      >
        <Palette size={44} className="text-[#5c5858] dark:text-white" />
      </button>

      <SettingsSlider
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default Layout;
