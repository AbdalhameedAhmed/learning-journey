import contentSmall from "@/assets/content/content-small.jpg";
import contentMedium from "@/assets/content/content-medium.jpg";
import contentLarge from "@/assets/content/content-large.jpg";
import { getSettingsStorage } from "@/utils/helpers";
import { useEffect, useState } from "react";

const ContentPage = () => {
  const [settings, setSettings] = useState(getSettingsStorage());

  // Get the appropriate image based on font size setting, default to medium
  const getContentImage = () => {
    const fontSize = settings?.fontSize || "medium";

    switch (fontSize) {
      case "small":
        return contentSmall;
      case "large":
        return contentLarge;
      case "medium":
      default:
        return contentMedium;
    }
  };

  const contentImage = getContentImage();

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
        src={contentImage}
        alt="الاهداف"
        className="h-full w-full object-contain"
      />
    </div>
  );
};

export default ContentPage;
