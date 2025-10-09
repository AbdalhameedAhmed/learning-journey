import { originalCssValues, sizeValues } from "@/constants/cssConstants";
import {
  deleteSettingsStorage,
  getSettingsStorage,
  setSettingsStorage,
} from "@/utils/helpers";
import type { FontSize } from "@schemas/Settings";
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
  const [darkPrimaryColor, setDarkPrimaryColor] = useState("");

  const [textColor, setTextColor] = useState("");
  const [darkTextColor, setDarkTextColor] = useState("");

  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useLayoutEffect(() => {
    const savedSettings = getSettingsStorage();

    if (savedSettings) {
      setPrimaryColor(savedSettings.primaryColor);
      setDarkPrimaryColor(savedSettings.darkPrimaryColor);
      setTextColor(savedSettings.textColor);
      setDarkTextColor(savedSettings.darkTextColor);
      setFontSize(savedSettings.fontSize);
      setTheme(savedSettings.theme);

      document.documentElement.style.setProperty(
        "--color-primary",
        savedSettings.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--color-dark-primary",
        savedSettings.darkPrimaryColor,
      );
      document.documentElement.style.setProperty(
        "--color-text",
        savedSettings.textColor,
      );
      document.documentElement.style.setProperty(
        "--color-dark-text",
        savedSettings.darkTextColor,
      );
      document.documentElement.style.setProperty(
        "--text-text-size",
        sizeValues[savedSettings.fontSize],
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
    if (
      isInitialized &&
      primaryColor &&
      textColor &&
      fontSize &&
      darkPrimaryColor &&
      darkTextColor
    ) {
      setSettingsStorage({
        primaryColor,
        textColor,
        fontSize,
        theme,
        darkPrimaryColor,
        darkTextColor,
      });
      console.log({
        theme,
        primaryColor,
        textColor,
        fontSize,
        darkPrimaryColor,
        darkTextColor,
      });
    }
  }, [
    primaryColor,
    textColor,
    fontSize,
    theme,
    isInitialized,
    darkPrimaryColor,
    darkTextColor,
  ]);

  const handlePrimaryColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isInitialized) return;

    const newColor = event.target.value;
    console.log(theme);

    if (theme === "dark") {
      setDarkPrimaryColor(newColor);
      document.documentElement.style.setProperty(
        "--color-dark-primary",
        newColor,
      );
    } else {
      setPrimaryColor(newColor);
      document.documentElement.style.setProperty("--color-primary", newColor);
    }
  };

  const handleTextColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isInitialized) return;

    const newColor = event.target.value;
    if (theme === "dark") {
      setDarkTextColor(newColor);
      document.documentElement.style.setProperty("--color-dark-text", newColor);
    } else {
      setTextColor(newColor);
      document.documentElement.style.setProperty("--color-text", newColor);
    }
  };

  const handleFontSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!isInitialized) return;

    const newSize = event.target.value as FontSize;

    // Update the CSS variable - this will automatically update both normal and smaller text
    document.documentElement.style.setProperty(
      "--text-text-normal",
      sizeValues[newSize],
    );

    setFontSize(newSize);
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
      "--color-dark-primary",
      originalCssValues.darkPrimary,
    );
    document.documentElement.style.setProperty(
      "--color-text",
      originalCssValues.text,
    );
    document.documentElement.style.setProperty(
      "--color-dark-text",
      originalCssValues.darkText,
    );
    document.documentElement.style.setProperty(
      "--text-text-size",
      originalCssValues.fontSize,
    );

    document.documentElement.classList.remove("dark");

    setPrimaryColor(originalCssValues.primary);
    setDarkPrimaryColor(originalCssValues.darkPrimary);
    setTextColor(originalCssValues.text);
    setDarkTextColor(originalCssValues.darkText);
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
          "fixed top-0 left-0 z-40 h-screen w-96 max-w-96 transform bg-white p-4 shadow-xl transition-transform duration-300 ease-in-out dark:bg-slate-800",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          },
        )}
      >
        <h2 className="mb-6 text-2xl font-bold dark:text-white">الإعدادات</h2>

        {/* Site Color */}
        <div className="mb-4">
          <label
            htmlFor="site-color"
            className="text-text dark:text-dark-text font-medium"
          >
            لون الموقع
          </label>
          <input
            type="color"
            id="site-color"
            name="site-color"
            className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm"
            value={theme == "dark" ? darkPrimaryColor : primaryColor}
            onChange={handlePrimaryColorChange}
          />
        </div>

        {/* Font Color */}
        <div className="mb-4">
          <label
            htmlFor="font-color"
            className="text-text dark:text-dark-text font-medium"
          >
            لون الخط
          </label>
          <input
            type="color"
            id="font-color"
            name="font-color"
            className="mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm"
            value={theme == "dark" ? darkTextColor : textColor}
            onChange={handleTextColorChange}
          />
        </div>

        {/* Font Size */}
        <div className="mb-4">
          <label
            htmlFor="font-size"
            className="text-text dark:text-dark-text font-medium"
          >
            حجم الخط
          </label>
          <select
            id="font-size"
            name="font-size"
            className="sm: text-text dark:text-dark-text mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:outline-none dark:shadow-white"
            value={fontSize}
            onChange={handleFontSizeChange}
          >
            <option value="small" className="text-black">
              صغير{" "}
            </option>
            <option value="medium" className="text-black">
              متوسط
            </option>
            <option value="large" className="text-black">
              كبير
            </option>
          </select>
        </div>

        {/* Theme */}
        <div className="mb-4">
          <label
            htmlFor="theme"
            className="text-text dark:text-dark-text font-medium"
          >
            الوضع
          </label>
          <select
            id="theme"
            name="theme"
            className="text-text dark:text-dark-text mt-1 h-10 w-full rounded-md border-gray-300 shadow-sm focus:outline-none dark:shadow-white"
            value={theme}
            onChange={handleThemeChange}
          >
            <option value="light" className="text-black">
              فاتح
            </option>
            <option value="dark" className="text-black">
              داكن
            </option>
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
