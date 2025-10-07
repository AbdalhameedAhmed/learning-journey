import contentImage from "@/assets/contentImage.png";
import examImage from "@/assets/examImage.png";
import goalsImage from "@/assets/goalsImage.png";
import infoImage from "@/assets/infoImage.png";
import HomeCard from "@/components/HomeCard";
import SettingsSlider from "@/components/SettingsSilder";
import { Palette } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/navbar";

const HomePage = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center gap-4 dark:bg-slate-900">
      <Navbar />
      <div className="relative mx-25 mt-12 flex h-full items-center justify-center">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {homeCardItems.map((item, index) => (
            <HomeCard key={index} {...item} />
          ))}
        </div>

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
    </div>
  );
};

export default HomePage;

const homeCardItems = [
  {
    image: infoImage,
    title: "التعليمات",
    to: "/info",
  },
  {
    image: goalsImage,
    title: "الأهداف",
    to: "/goals",
  },
  {
    image: contentImage,
    title: "المحتوى",
    to: "/content",
  },
  {
    image: examImage,
    title: "الامتحان القبلي",
    to: "/exam",
  },
];
