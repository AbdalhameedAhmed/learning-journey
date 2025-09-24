import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import loginImg from "../../components/assets/Login.png";
import { loginUser, getCurrentUser } from "@/services/auth";
import { setAccessToken, setRefreshToken } from "@/utils/helpers";
import { UserRole } from "../../../../schemas/User";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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
      setLoading(true);
      setApiError("");

      const tokens = await loginUser({ email, password });
      setAccessToken(tokens.tokens.access_token);
      setRefreshToken(tokens.tokens.refresh_token);

      const user = await getCurrentUser();
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === UserRole.PRO) {
        navigate("/");
      } else {
        navigate("/dashboard");
      }

    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail || "فشل تسجيل الدخول، حاول مرة أخرى.";
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const labelRight = "right-16 sm:right-12"; 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md md:max-w-3xl text-right">
        <p className="text-2xl text-center font-semibold text-[#febc34] mb-4 sm:mb-6 leading-relaxed">
            قم بتسجيل الدخول للوصول إلى حسابك
        </p>

        <div className="flex justify-center mb-4 sm:mb-6">
          <img src={loginImg} alt="login" className="w-40 sm:w-64" />
        </div>

        {apiError && <p className="text-red-600 text-center mb-3">{apiError}</p>}

        <form className="space-y-6 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="relative">
            <div className="flex items-center bg-[#febc34] rounded-full px-3 py-2 sm:px-4 sm:py-3">
              <FaUser className="text-black ml-2 sm:ml-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-black text-sm sm:text-lg"
              />
              <label
                className={`absolute ${labelRight} text-black transition-all duration-300 pointer-events-none ${
                  email ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"
                }`}
              >
                البريد الإلكتروني
              </label>
            </div>
            {errors.email && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="flex items-center bg-[#febc34] rounded-full px-3 py-2 sm:px-4 sm:py-3">
              <FaLock className="text-black ml-2 sm:ml-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-black text-sm sm:text-lg"
              />
              <button
                type="button"
                className="ml-2 text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              <label
                className={`absolute ${labelRight} text-black transition-all duration-300 pointer-events-none ${
                  password ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"
                }`}
              >
                كلمة المرور
              </label>
            </div>
            {errors.password && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.password}</p>}
          </div>

          <div className="flex justify-center mt-4 sm:mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 sm:w-1/3 bg-[#002538] text-white rounded-full py-2 sm:py-3 text-sm sm:text-lg font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "جاري الدخول..." : "دخول"}
            </button>
          </div>
        </form>

        <div className="text-center mt-3 sm:mt-4 text-sm sm:text-base">
          <Link to="/forgot-password" className="text-black hover:underline">
            هل نسيت كلمة المرور ؟
          </Link>
          <p className="mt-1 sm:mt-2">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="text-[#002538] font-semibold">
              سجل الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
