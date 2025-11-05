import instructionsSmall from "@/assets/instructions/instructions-small.jpg";
import instructionsSmall2 from "@/assets/instructions/instructions-small2.jpg";
import instructionsMedium from "@/assets/instructions/instructions-medium.jpg";
import instructionsMedium2 from "@/assets/instructions/instructions-medium2.jpg";
import instructionsLarge from "@/assets/instructions/instructions-large.jpg";
import instructionsLarge2 from "@/assets/instructions/instructions-large2.jpg";
import { getSettingsStorage } from "@/utils/helpers";
import { useEffect, useState } from "react";

const InstructionsPage = () => {
  const [settings, setSettings] = useState(getSettingsStorage());

  // Get images based on font size setting
  const getInstructionsImages = () => {
    const fontSize = settings?.fontSize || "medium";

    switch (fontSize) {
      case "small":
        return [instructionsSmall, instructionsSmall2];
      case "large":
        return [instructionsLarge, instructionsLarge2];
      case "medium":
      default:
        return [instructionsMedium, instructionsMedium2];
    }
  };

  const instructionsImages = getInstructionsImages();

  // Listen for settings changes
  useEffect(() => {
    const handleStorageChange = () => {
      setSettings(getSettingsStorage());
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(() => {
      const newSettings = getSettingsStorage();
      if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
        setSettings(newSettings);
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [settings]);

  return (
    <div className="h-[calc(100vh-4rem)] w-screen  bg-white p-2 flex flex-col gap-4 items-center ">
      {/* Wrap both images together as one "page" */}
      <div className=" flex flex-col items-center gap-2">
        {instructionsImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`التعليمات ${index + 1}`}
            className="w-[85%] object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default InstructionsPage;
