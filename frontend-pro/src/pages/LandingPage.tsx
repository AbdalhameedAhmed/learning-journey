import { useState, useEffect } from "react";
import Image4 from "../assets/Image4.svg";
import Vector1 from "../assets/Vector1.svg";
import { User, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on system preference or localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      setDarkMode(systemPrefersDark);
    }
  }, []);

  // Apply dark mode class to document root and save preference
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Background shapes data
  const backgroundShapes = [
    // Circles
    {
      type: "circle",
      size: "w-4 h-4",
      color: "bg-blue-300 dark:bg-blue-600",
      top: "10%",
      left: "5%",
      animation: "animate-float1",
    },
    {
      type: "circle",
      size: "w-6 h-6",
      color: "bg-purple-300 dark:bg-purple-600",
      top: "20%",
      left: "90%",
      animation: "animate-float2",
    },
    {
      type: "circle",
      size: "w-3 h-3",
      color: "bg-green-300 dark:bg-green-600",
      top: "70%",
      left: "15%",
      animation: "animate-float3",
    },
    {
      type: "circle",
      size: "w-5 h-5",
      color: "bg-yellow-300 dark:bg-yellow-600",
      top: "85%",
      left: "80%",
      animation: "animate-float4",
    },
    {
      type: "circle",
      size: "w-8 h-8",
      color: "bg-red-300 dark:bg-red-600",
      top: "40%",
      left: "95%",
      animation: "animate-float5",
    },
    {
      type: "circle",
      size: "w-2 h-2",
      color: "bg-indigo-300 dark:bg-indigo-600",
      top: "60%",
      left: "3%",
      animation: "animate-float6",
    },

    // Rectangles
    {
      type: "rectangle",
      size: "w-12 h-3",
      color: "bg-orange-300 dark:bg-orange-600",
      top: "15%",
      left: "70%",
      animation: "animate-float7",
    },
    {
      type: "rectangle",
      size: "w-8 h-2",
      color: "bg-pink-300 dark:bg-pink-600",
      top: "55%",
      left: "85%",
      animation: "animate-float8",
    },
    {
      type: "rectangle",
      size: "w-10 h-4",
      color: "bg-teal-300 dark:bg-teal-600",
      top: "30%",
      left: "10%",
      animation: "animate-float9",
    },
    {
      type: "rectangle",
      size: "w-6 h-1",
      color: "bg-cyan-300 dark:bg-cyan-600",
      top: "75%",
      left: "25%",
      animation: "animate-float10",
    },
    {
      type: "rectangle",
      size: "w-14 h-2",
      color: "bg-amber-300 dark:bg-amber-600",
      top: "45%",
      left: "60%",
      animation: "animate-float11",
    },
    {
      type: "rectangle",
      size: "w-5 h-3",
      color: "bg-lime-300 dark:bg-lime-600",
      top: "90%",
      left: "40%",
      animation: "animate-float12",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-gray-800 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
      {/* Animated Background Shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {backgroundShapes.map((shape, index) => (
          <div
            key={index}
            className={`absolute opacity-40 dark:opacity-30 rounded-${shape.type === "circle" ? "full" : "lg"} ${shape.size} ${shape.color} ${shape.animation}`}
            style={{
              top: shape.top,
              left: shape.left,
            }}
          />
        ))}
      </div>

      <header className="bg-primary dark:bg-dark-primary relative z-10 flex max-h-[76px] min-h-[76px] items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center rounded-full border-2 border-gray-800 bg-white p-2 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>

          <div className="text-right">
            <h1 className="text-lg font-bold text-gray-800 sm:text-xl dark:text-gray-900">
              رحلة تعلم
            </h1>
            <p className="text-xs text-gray-700 sm:text-sm dark:text-gray-800">
              Learn Journey
            </p>
          </div>
        </div>

        <Link
          to="/login"
          className="relative z-10 flex items-center gap-2 rounded-lg border-2 border-gray-800 bg-white px-4 py-2 font-semibold text-gray-800 transition-colors hover:bg-gray-50 sm:px-6 sm:py-3 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          <User size={18} className="sm:size-5" />
          تسجيل دخول
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Background Wave */}
        <img
          src={Vector1}
          alt="Background wave"
          className="absolute top-0 w-full opacity-40 dark:opacity-20"
        />

        {/* Content Container */}
        <div className="relative z-10 px-4 pt-20 sm:px-6 lg:pt-40">
          <div className="flex w-full flex-col items-center justify-between lg:flex-row">
            {/* Text Content - Order changes on medium screens */}
            <div className="order-2 w-full space-y-10 pt-10 pb-10 text-center lg:order-1 lg:w-auto lg:space-y-20 lg:pt-25 lg:pr-50 lg:pb-50 lg:text-right">
              {/* Main Text */}
              <div className="space-y-6 lg:space-y-10">
                <p className="relative z-10 pb-2 text-xl text-gray-700 sm:text-2xl lg:text-3xl dark:text-gray-300">
                  ابدأ اليوم رحلة تعملك فكل إنجاز صغير يقودك لنجاح أكبر ....
                </p>
                <h2 className="relative z-10 text-2xl leading-tight font-bold text-gray-800 sm:text-3xl lg:text-5xl dark:text-white">
                  إطمح ، تعلم ، تقدم
                </h2>
              </div>
            </div>

            {/* Image - Order changes on medium screens */}
            <div className="order-1 mb-8 w-full lg:order-2 lg:mb-0 lg:w-fit">
              <img
                src={Image4}
                alt="Learning illustration"
                className="relative z-10 mx-auto h-auto w-full max-w-[500px] sm:max-w-[600px] lg:mx-0 lg:w-[600px] lg:pl-10"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Add custom animations to your CSS or Tailwind config */}
      <style jsx>{`
        @keyframes float1 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float2 {
          0%,
          100% {
            transform: translateX(0px) scale(1);
          }
          50% {
            transform: translateX(15px) scale(1.1);
          }
        }
        @keyframes float3 {
          0%,
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          33% {
            transform: translate(10px, -15px) rotate(120deg);
          }
          66% {
            transform: translate(-5px, 10px) rotate(240deg);
          }
        }
        @keyframes float4 {
          0%,
          100% {
            transform: translateY(0px) skew(0deg);
          }
          50% {
            transform: translateY(15px) skew(10deg);
          }
        }
        @keyframes float5 {
          0%,
          100% {
            transform: translate(0px, 0px) rotate(0deg);
          }
          25% {
            transform: translate(5px, -10px) rotate(90deg);
          }
          50% {
            transform: translate(10px, 5px) rotate(180deg);
          }
          75% {
            transform: translate(-5px, 10px) rotate(270deg);
          }
        }
        @keyframes float6 {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.5) rotate(180deg);
          }
        }
        .animate-float1 {
          animation: float1 8s ease-in-out infinite;
        }
        .animate-float2 {
          animation: float2 6s ease-in-out infinite;
        }
        .animate-float3 {
          animation: float3 10s ease-in-out infinite;
        }
        .animate-float4 {
          animation: float4 7s ease-in-out infinite;
        }
        .animate-float5 {
          animation: float5 9s ease-in-out infinite;
        }
        .animate-float6 {
          animation: float6 5s ease-in-out infinite;
        }
        .animate-float7 {
          animation: float1 11s ease-in-out infinite;
        }
        .animate-float8 {
          animation: float2 8s ease-in-out infinite;
        }
        .animate-float9 {
          animation: float3 12s ease-in-out infinite;
        }
        .animate-float10 {
          animation: float4 6s ease-in-out infinite;
        }
        .animate-float11 {
          animation: float5 10s ease-in-out infinite;
        }
        .animate-float12 {
          animation: float6 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
