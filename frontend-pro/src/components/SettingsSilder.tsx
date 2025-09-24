import { originalCssValues } from "@/constants/cssConstants";
import {
  deleteSettingsStorage,
  getSettingsStorage,
  setSettingsStorage,
} from "@/utils/helpers";
import clsx from "clsx";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

interface SettingsSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsSlider = ({ isOpen, onClose }: SettingsSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [isInitialized, setIsInitialized] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useLayoutEffect(() => {
    const savedSettings = getSettingsStorage();

    if (savedSettings) {
      setPrimaryColor(savedSettings.primaryColor);
      setTextColor(savedSettings.textColor);
      setFontSize(savedSettings.fontSize);
      setTheme(savedSettings.theme);

      document.documentElement.style.setProperty(
        "--color-primary",
        savedSettings.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--color-text",
        savedSettings.textColor,
      );
      document.documentElement.style.setProperty(
        "--text-text-size",
        savedSettings.fontSize,
      );

      if (savedSettings.theme === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else {
      setPrimaryColor(originalCssValues.primary);
      setTextColor(originalCssValues.text);
      setFontSize(originalCssValues.fontSize);
      setTheme(originalCssValues.theme);
    }

    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && primaryColor && textColor && fontSize) {
      setSettingsStorage({ primaryColor, textColor, fontSize, theme });
    }
  }, [primaryColor, textColor, fontSize, theme, isInitialized]);

  const handlePrimaryColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isInitialized) return;

    const newColor = event.target.value;
    setPrimaryColor(newColor);
    document.documentElement.style.setProperty("--color-primary", newColor);
  };

  const handleTextColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isInitialized) return;

    const newColor = event.target.value;
    setTextColor(newColor);
    document.documentElement.style.setProperty("--color-text", newColor);
  };

  const handleFontSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!isInitialized) return;

    const newSize = event.target.value;
    setFontSize(newSize);
    document.documentElement.style.setProperty("--text-text-size", newSize);
  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!isInitialized) return;

    const newTheme = event.target.value as "light" | "dark";
    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const resetChanges = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!isInitialized) return;

    deleteSettingsStorage();

    document.documentElement.style.setProperty(
      "--color-primary",
      originalCssValues.primary,
    );
    document.documentElement.style.setProperty(
      "--color-text",
      originalCssValues.text,
    );
    document.documentElement.style.setProperty(
      "--text-text-size",
      originalCssValues.fontSize,
    );

    document.documentElement.classList.remove("dark");

    setPrimaryColor(originalCssValues.primary);
    setTextColor(originalCssValues.text);
    setFontSize(originalCssValues.fontSize);
    setTheme(originalCssValues.theme);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sliderRef.current &&
        !sliderRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isInitialized) {
    return (
      <div
        ref={sliderRef}
        className={clsx(
          "fixed top-0 left-0 z-40 h-screen w-96 max-w-96 transform bg-white p-4 shadow-xl transition-transform duration-300 ease-in-out",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          },
        )}
      >
        <div className="flex h-full items-center justify-center">
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {isOpen && <div onClick={onClose}></div>}

      <div
        ref={sliderRef}
        className={clsx(
          "fixed top-0 left-0 z-40 h-screen w-96 max-w-96 transform bg-white p-4 shadow-xl transition-transform duration-300 ease-in-out",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          },
        )}
      >
        <h2 className="mb-6 text-2xl font-bold">الإعدادات</h2>

        {/* Site Color */}
        <div className="mb-4">
          <label htmlFor="site-color" className="text-text font-medium">
            لون الموقع
          </label>
          <input
            type="color"
            id="site-color"
            name="site-color"
            className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm"
            value={primaryColor}
            onChange={handlePrimaryColorChange}
          />
        </div>

        {/* Font Color */}
        <div className="mb-4">
          <label htmlFor="font-color" className="text-text font-medium">
            لون الخط
          </label>
          <input
            type="color"
            id="font-color"
            name="font-color"
            className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm"
            value={textColor}
            onChange={handleTextColorChange}
          />
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label htmlFor="font-size" className="text-text font-medium">
            حجم الخط
          </label>
          <select
            id="font-size"
            name="font-size"
            className="sm: mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:outline-none"
            value={fontSize}
            onChange={handleFontSizeChange}
          >
            <option value="14px">صغير </option>
            <option value="22px">عادي</option>
            <option value="30px">كبير</option>
          </select>
        </div>

        {/* Theme */}
        <div className="mb-4">
          <label htmlFor="theme" className="text-text font-medium">
            الوضع
          </label>
          <select
            id="theme"
            name="theme"
            className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:outline-none"
            value={theme}
            onChange={handleThemeChange}
          >
            <option value="light">فاتح</option>
            <option value="dark">داكن</option>
          </select>
        </div>

        {/* Reset Changes */}
        <button
          onClick={resetChanges}
          className="my-4 w-full rounded-md border border-gray-300 bg-white py-2 text-gray-700 shadow-sm transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
        >
          اعادة تعيين التغيرات
        </button>
      </div>
    </>
  );
};

export default SettingsSlider;
