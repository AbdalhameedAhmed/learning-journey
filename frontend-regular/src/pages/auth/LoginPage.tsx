import image from "@/assets/image.png";
import { useLogin } from "@/hooks/auth/useLogin";
import { UserRole } from "@schemas/User";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState("");

  const { login, isPending } = useLogin();

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { email: "", password: "" };

    if (!validateEmail(email)) {
      newErrors.email = "من فضلك أدخل بريد إلكتروني صحيح";
      hasError = true;
    }
    if (!password.trim()) {
      newErrors.password = "كلمة المرور مطلوبة";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      setApiError("");
      login({ email, password, role: UserRole.REGULAR });
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail || "فشل تسجيل الدخول، حاول مرة أخرى.";
      setApiError(errorMsg);
    }
  };

  const labelRight = "right-16 sm:right-12";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-[#002538]">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-right shadow-2xl sm:p-10 md:max-w-3xl dark:bg-[#0c1e2b]">
        <p className="text-primary mb-4 text-center text-2xl leading-relaxed font-semibold sm:mb-6">
          قم بتسجيل الدخول للوصول إلى حسابك
        </p>

        <div className="mb-4 flex justify-center sm:mb-6">
          <img src={image} alt="login" className="w-40 sm:w-64" />
        </div>

        {apiError && (
          <p className="mb-3 text-center text-red-600">{apiError}</p>
        )}

        <form className="space-y-6 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="relative">
            <div className="bg-primary dark:bg-dark-primary flex items-center rounded-full px-3 py-2 sm:px-4 sm:py-3">
              <FaUser className="dark:text-dark-text ml-2 text-black sm:ml-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm text-black outline-none sm:text-lg dark:text-white"
              />
              <label
                className={`absolute ${labelRight} dark:text-dark-text pointer-events-none text-black transition-all duration-300 ${
                  email
                    ? "-top-2 text-xs sm:text-sm"
                    : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"
                }`}
              >
                البريد الإلكتروني
              </label>
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 sm:text-sm">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="bg-primary dark:bg-dark-primary flex items-center rounded-full px-3 py-2 sm:px-4 sm:py-3">
              <FaLock className="dark:text-dark-text ml-2 text-black sm:ml-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm text-black outline-none sm:text-lg dark:text-white"
              />
              <button
                type="button"
                tabIndex={-1}
                className="ml-2 text-black dark:text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              <label
                className={`absolute ${labelRight} pointer-events-none text-black transition-all duration-300 dark:text-white ${
                  password
                    ? "-top-2 text-xs sm:text-sm"
                    : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"
                }`}
              >
                كلمة المرور
              </label>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 sm:text-sm">
                {errors.password}
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-center sm:mt-6">
            <button
              type="submit"
              disabled={isPending}
              className="dark:bg-text bg-primary w-1/2 cursor-pointer rounded-full py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 sm:w-1/3 sm:py-3 sm:text-lg"
            >
              {isPending ? "جاري الدخول..." : "دخول"}
            </button>
          </div>
        </form>

        <div className="mt-3 text-center text-sm sm:mt-4 sm:text-base">
          <p className="mt-1 text-black sm:mt-2 dark:text-white">
            ليس لديك حساب؟{" "}
            <Link
              to="/register"
              className="dark:text-primary font-semibold text-[#002538]"
            >
              سجل الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
