import image from "@/assets/image.png";
import Vector1 from "@/assets/Vector1.svg";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.svg";

const LandingPage = () => {
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
        <div className="w-34">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
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
            <div className="relative flex min-h-[700px] w-full justify-center text-center lg:w-1/2">
              {/* Centered content */}
               <div className="order-2 flex w-full flex-col gap-4 text-center p-15  lg:order-1">
              <p className="relative z-10 text-[44px]  text-center font-bold text-[#26667f] dark:text-[#26667f]">
                مقرر
              </p>
              <p className="relative z-10 text-[44px] text-center font-bold text-[#26667f] dark:text-[#26667f]">
                بيئات التعلم الإلكترونية
              </p>
              <p className="relative z-10 text-[44px] text-center font-bold text-[#26667f] dark:text-[#26667f]">
                المستوى الرابع
              </p>
              <p className="relative z-10 text-[40px] text-center  text-[#26667f] dark:text-[#26667f]">
                العام الدراسي (٢٠٢٦/٢٠٢٥)
              </p>
            </div>

              {/* Bottom right text */}
              <h3 className="absolute right-5 bottom-5 text-right text-[44px] font-semibold text-[#26667f] dark:text-[#26667f]">
                اطمح، تعلم، تقدم..
              </h3>
            </div>

            {/* Image - Order changes on medium screens */}
            <div className="order-1 mb-8 w-full lg:order-2 lg:mb-0 lg:w-fit">
              <img
                src={image}
                alt="Learning illustration"
                className="relative z-10 mx-auto h-auto w-full max-w-[600px] sm:max-w-[600px] lg:mx-0 lg:w-[700px] lg:pl-10"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
