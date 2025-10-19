import instructionsSmall from "@/assets/instructions/instructions-small.jpg";
import instructionsMedium from "@/assets/instructions/instructions-medium.jpg";
import instructionsLarge from "@/assets/instructions/instructions-large.jpg";
import { getSettingsStorage } from "@/utils/helpers";
import { useEffect, useState } from "react";

const InstructionsPage = () => {
  const [settings, setSettings] = useState(getSettingsStorage());

  // Get the appropriate image based on font size setting, default to medium
  const getInstructionsImage = () => {
    const fontSize = settings?.fontSize || "medium";

    switch (fontSize) {
      case "small":
        return instructionsSmall;
      case "large":
        return instructionsLarge;
      case "medium":
      default:
        return instructionsMedium;
    }
  };

  const instructionsImage = getInstructionsImage();

  // Listen for settings changes
  useEffect(() => {
    const handleStorageChange = () => {
      setSettings(getSettingsStorage());
    };

    // Listen for storage events (changes from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    // Poll for changes (in case changes happen in the same tab)
    const interval = setInterval(() => {
      const newSettings = getSettingsStorage();
      if (JSON.stringify(newSettings) !== JSON.stringify(settings)) {
        setSettings(newSettings);
      }
    }, 50);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [settings]);

  return (
    <div className="h-[calc(100vh-4rem)] w-screen overflow-hidden bg-white p-2">
      <img
        src={instructionsImage}
        alt="التعليمات"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default InstructionsPage;
