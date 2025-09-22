import { useEffect, useRef, useState, type ChangeEvent } from "react";
import clsx from "clsx";

interface SettingsSliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsSlider = ({ isOpen, onClose }: SettingsSliderProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const originalColors = useRef({
    primary: "",
    text: "",
  });

  const originalFontSize = useRef("");
  const [fontSize, setFontSize] = useState(() => originalFontSize.current);

  const [primaryColor, setPrimaryColor] = useState(
    () => originalColors.current.primary,
  );
  const [textColor, setTextColor] = useState(() => originalColors.current.text);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    originalColors.current.primary = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary");
    originalColors.current.text = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--color-text");
    originalFontSize.current = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--text-text-size");

    setPrimaryColor(originalColors.current.primary);
    setTextColor(originalColors.current.text);
    setFontSize(originalFontSize.current);
  }, []);

  const handlePrimaryColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setPrimaryColor(newColor);
    document.documentElement.style.setProperty("--color-primary", newColor);
  };
  const handleTextColorChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value;
    setTextColor(newColor);
    document.documentElement.style.setProperty("--color-text", newColor);
  };

  const handleFontSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newSize = event.target.value;
    setFontSize(newSize);
    document.documentElement.style.setProperty("--text-text-size", newSize);
    console.log(document.documentElement.style);
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value;
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const resetChanges = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setPrimaryColor(originalColors.current.primary);
    setTextColor(originalColors.current.text);
    setFontSize(originalFontSize.current);
    setTheme("light");

    // Also reset the CSS variables
    document.documentElement.style.setProperty(
      "--color-primary",
      originalColors.current.primary,
    );
    document.documentElement.style.setProperty(
      "--color-text",
      originalColors.current.text,
    );
    document.documentElement.style.setProperty(
      "--text-text-size",
      originalFontSize.current,
    );
    document.documentElement.classList.remove("dark");
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
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

  return (
    <>
      {isOpen && <div onClick={onClose}></div>}
      {/* Sidebar */}
      <div
        ref={sidebarRef}
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
            className="sm: mt-1 w-full rounded-md border-gray-300 shadow-sm focus:outline-none"
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
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:outline-none"
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
