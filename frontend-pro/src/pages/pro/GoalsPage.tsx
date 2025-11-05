import goalsSmall from "@/assets/goals/goals-small.jpg";
import goalsMedium from "@/assets/goals/goals-medium.jpg";
import goalsLarge from "@/assets/goals/goals-large.jpg";
import { getSettingsStorage } from "@/utils/helpers";
import { useEffect, useState } from "react";

const GoalsPage = () => {
  const [settings, setSettings] = useState(getSettingsStorage());

  // Get the appropriate image based on font size setting, default to medium
  const getGoalsImage = () => {
    const fontSize = settings?.fontSize || "medium";

    switch (fontSize) {
      case "small":
        return goalsSmall;
      case "large":
        return goalsLarge;
      case "medium":
      default:
        return goalsMedium;
    }
  };

  const goalsImage = getGoalsImage();

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
        src={goalsImage}
        alt="الأهداف"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default GoalsPage;
