import registerImg from "@/assets/Image4.svg";
import { useRegister } from "@/hooks/auth/useRegister";
import { UserRole } from "@schemas/User";
import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [apiError, setApiError] = useState("");
  const { register, isPending } = useRegister();

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    };
    let hasError = false;

    if (!validateEmail(email)) {
      newErrors.email = "من فضلك أدخل بريد إلكتروني صحيح";
      hasError = true;
    }
    if (!firstName.trim()) {
      newErrors.firstName = "الاسم الأول مطلوب";
      hasError = true;
    }
    if (!lastName.trim()) {
      newErrors.lastName = "الاسم الأخير مطلوب";
      hasError = true;
    }
    if (password.length < 6) {
      newErrors.password = "كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل";
      hasError = true;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "كلمة المرور وتأكيدها غير متطابقين";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    try {
      setApiError("");

      register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        confirm_password: confirmPassword,
        role: UserRole.PRO,
      });
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail || "حدث خطأ أثناء التسجيل، حاول مرة أخرى.";
      setApiError(errorMsg);
    }
  };

  const labelRight = "right-16 sm:right-12";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-[#002538]">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-right shadow-2xl sm:p-10 md:max-w-3xl dark:bg-[#0c1e2b]">
        <p className="dark:text-primary mb-4 text-center text-2xl leading-relaxed font-semibold text-[#febc34] sm:mb-6">
          مرحباً بكم في منصة رحلة تعلم
          <br /> الآن يمكنكم التسجيل إلى المنصة
        </p>

        <div className="mb-4 flex justify-center sm:mb-6">
          <img src={registerImg} alt="register" className="w-40 sm:w-64" />
        </div>

        {apiError && (
          <p className="mb-3 text-center text-red-600 dark:text-red-400">
            {apiError}
          </p>
        )}

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="relative">
            <div className="dark:bg-text flex items-center rounded-full bg-[#febc34] px-3 py-2 sm:px-4 sm:py-3">
              <FaEnvelope className="ml-2 text-black sm:ml-3 dark:text-white" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm text-black outline-none sm:text-lg dark:text-white"
              />
              <label
                className={`absolute ${labelRight} pointer-events-none text-black transition-all duration-300 dark:text-white ${email ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}
              >
                البريد الالكتروني
              </label>
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 sm:text-sm dark:text-red-400">
                {errors.email}
              </p>
            )}
          </div>

          {/* First name input */}
          <div className="relative">
            <div className="dark:bg-text flex items-center rounded-full bg-[#febc34] px-3 py-2 sm:px-4 sm:py-3">
              <FaUser className="ml-2 text-black sm:ml-3 dark:text-white" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 bg-transparent text-sm text-black outline-none sm:text-lg dark:text-white"
              />
              <label
                className={`absolute ${labelRight} pointer-events-none text-black transition-all duration-300 dark:text-white ${firstName ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}
              >
                الاسم الأول
              </label>
            </div>
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600 sm:text-sm dark:text-red-400">
                {errors.firstName}
              </p>
            )}
          </div>

          {/* Last name input */}
          <div className="relative">
            <div className="dark:bg-text flex items-center rounded-full bg-[#febc34] px-3 py-2 sm:px-4 sm:py-3">
              <FaUser className="ml-2 text-black sm:ml-3 dark:text-white" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 bg-transparent text-sm text-black outline-none sm:text-lg dark:text-white"
              />
              <label
                className={`absolute ${labelRight} pointer-events-none text-black transition-all duration-300 dark:text-white ${lastName ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}
              >
                الاسم الأخير
              </label>
            </div>
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600 sm:text-sm dark:text-red-400">
                {errors.lastName}
              </p>
            )}
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="dark:bg-text flex items-center rounded-full bg-[#febc34] px-3 py-2 sm:px-4 sm:py-3">
              <FaLock className="ml-2 text-black sm:ml-3 dark:text-white" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm text-black outline-none sm:text-lg dark:text-white"
              />
              <button
                type="button"
                tabIndex={-1}
                className="ml-2 text-black dark:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              <label
                className={`absolute ${labelRight} pointer-events-none text-black transition-all duration-300 dark:text-white ${password ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}
              >
                كلمة المرور
              </label>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 sm:text-sm dark:text-red-400">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm password input */}
          <div className="relative">
            <div className="dark:bg-text flex items-center rounded-full bg-[#febc34] px-3 py-2 sm:px-4 sm:py-3">
              <FaLock className="ml-2 text-black sm:ml-3 dark:text-white" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm text-black outline-none sm:text-lg dark:text-white"
              />
              <button
                type="button"
                tabIndex={-1}
                className="ml-2 text-black dark:text-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              <label
                className={`absolute ${labelRight} pointer-events-none text-black transition-all duration-300 dark:text-white ${confirmPassword ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}
              >
                تأكيد كلمة المرور
              </label>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600 sm:text-sm dark:text-red-400">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-col items-center sm:mt-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-1/2 cursor-pointer rounded-full bg-[#002538] py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 sm:w-1/3 sm:py-3 sm:text-lg dark:bg-[#0c1e2b]"
            >
              {isPending ? "جاري التسجيل..." : "تسجيل"}
            </button>

            <div className="mt-3 text-center text-sm sm:mt-4 sm:text-base">
              <p className="mt-1 text-black sm:mt-2 dark:text-white">
                لديك حساب بالفعل؟{" "}
                <Link
                  to="/login"
                  className="dark:text-primary mt-5 font-semibold text-[#002538]"
                >
                  الدخول الآن
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
