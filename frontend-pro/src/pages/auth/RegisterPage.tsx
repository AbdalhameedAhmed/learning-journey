import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom"; 
import registerImg from "../../components/assets/Register.png";
import { registerUser } from "@/services/auth";
import { UserRole } from "../../../../schemas/User";

export default function RegisterPage() {
  const navigate = useNavigate();

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
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [apiError, setApiError] = useState("");

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { email: "", firstName: "", lastName: "", password: "", confirmPassword: "" };
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
      setLoading(true);
      setApiError("");
      setSuccessMsg("");

      await registerUser({
        email,
        password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
        role: UserRole.PRO,
      });

      setSuccessMsg("تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.");
      setEmail(""); setFirstName(""); setLastName(""); setPassword(""); setConfirmPassword("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } }).response?.data
          ?.detail || "حدث خطأ أثناء التسجيل، حاول مرة أخرى.";
      setApiError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const labelRight = "right-16 sm:right-12"; 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#002538] px-4">
      <div className="bg-white dark:bg-[#0c1e2b] shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md md:max-w-3xl text-right">
        <p className="text-2xl font-semibold text-[#febc34] dark:text-[#ffb732] mb-4 sm:mb-6 leading-relaxed">
          مرحباً بكم في منصة رحلة تعلم، الآن يمكنكم التسجيل للدخول إلى المنصة
        </p>

        <div className="flex justify-center mb-4 sm:mb-6">
          <img src={registerImg} alt="register" className="w-40 sm:w-64" />
        </div>

        {successMsg && <p className="text-green-600 dark:text-green-400 text-center mb-3">{successMsg}</p>}
        {apiError && <p className="text-red-600 dark:text-red-400 text-center mb-3">{apiError}</p>}

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="relative">
            <div className="flex items-center bg-[#febc34] dark:bg-[#35389b] rounded-full px-3 py-2 sm:px-4 sm:py-3">
              <FaEnvelope className="text-black dark:text-white ml-2 sm:ml-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent outline-none text-black dark:text-white text-sm sm:text-lg"
              />
              <label className={`absolute ${labelRight} text-black dark:text-white transition-all duration-300 pointer-events-none ${email ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
                البريد الالكتروني
              </label>
            </div>
            {errors.email && <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1">{errors.email}</p>}
          </div>

          {/* First name input */}
          <div className="relative">
            <div className="flex items-center bg-[#febc34] dark:bg-[#35389b] rounded-full px-3 py-2 sm:px-4 sm:py-3">
              <FaUser className="text-black dark:text-white ml-2 sm:ml-3" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="flex-1 bg-transparent outline-none text-black dark:text-white text-sm sm:text-lg"
              />
              <label className={`absolute ${labelRight} text-black dark:text-white transition-all duration-300 pointer-events-none ${firstName ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
                الاسم الأول
              </label>
            </div>
            {errors.firstName && <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* Last name input */}
          <div className="relative">
            <div className="flex items-center bg-[#febc34] dark:bg-[#35389b] rounded-full px-3 py-2 sm:px-4 sm:py-3">
              <FaUser className="text-black dark:text-white ml-2 sm:ml-3" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="flex-1 bg-transparent outline-none text-black dark:text-white text-sm sm:text-lg"
              />
              <label className={`absolute ${labelRight} text-black dark:text-white transition-all duration-300 pointer-events-none ${lastName ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
                الاسم الأخير
              </label>
            </div>
            {errors.lastName && <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* Password input */}
          <div className="relative">
            <div className="flex items-center bg-[#febc34] dark:bg-[#35389b] rounded-full px-3 py-2 sm:px-4 sm:py-3">
              <FaLock className="text-black dark:text-white ml-2 sm:ml-3" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-black dark:text-white text-sm sm:text-lg"
              />
              <button type="button" className="ml-2 text-black dark:text-white" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              <label className={`absolute ${labelRight} text-black dark:text-white transition-all duration-300 pointer-events-none ${password ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
                كلمة المرور
              </label>
            </div>
            {errors.password && <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm password input */}
          <div className="relative">
            <div className="flex items-center bg-[#febc34] dark:bg-[#35389b] rounded-full px-3 py-2 sm:px-4 sm:py-3">
              <FaLock className="text-black dark:text-white ml-2 sm:ml-3" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent outline-none text-black dark:text-white text-sm sm:text-lg"
              />
              <button type="button" className="ml-2 text-black dark:text-white" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
              <label className={`absolute ${labelRight} text-black dark:text-white transition-all duration-300 pointer-events-none ${confirmPassword ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
                تأكيد كلمة المرور
              </label>
            </div>
            {errors.confirmPassword && <p className="text-red-600 dark:text-red-400 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex flex-col items-center mt-4 sm:mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 sm:w-1/3 bg-[#002538] dark:bg-[#0c1e2b] text-white rounded-full py-2 sm:py-3 text-sm sm:text-lg font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? "جاري التسجيل..." : "تسجيل"}
            </button>

            <Link to="/login" className="mt-5 text-3xl sm:text-base text-black dark:text-white hover:underline">
              سجل الآن
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
















// import { useState } from "react";
// import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
// import { useNavigate, Link } from "react-router-dom"; 
// import registerImg from "../../components/assets/Register.png";
// import { registerUser } from "@/services/auth";
// import { UserRole } from "../../../../schemas/User";

// export default function RegisterPage() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [errors, setErrors] = useState({
//     email: "",
//     firstName: "",
//     lastName: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   const [apiError, setApiError] = useState("");

//   const validateEmail = (value: string) =>
//     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const newErrors = { email: "", firstName: "", lastName: "", password: "", confirmPassword: "" };
//     let hasError = false;

//     if (!validateEmail(email)) {
//       newErrors.email = "من فضلك أدخل بريد إلكتروني صحيح";
//       hasError = true;
//     }
//     if (!firstName.trim()) {
//       newErrors.firstName = "الاسم الأول مطلوب";
//       hasError = true;
//     }
//     if (!lastName.trim()) {
//       newErrors.lastName = "الاسم الأخير مطلوب";
//       hasError = true;
//     }
//     if (password.length < 6) {
//       newErrors.password = "كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل";
//       hasError = true;
//     }
//     if (password !== confirmPassword) {
//       newErrors.confirmPassword = "كلمة المرور وتأكيدها غير متطابقين";
//       hasError = true;
//     }

//     setErrors(newErrors);
//     if (hasError) return;

//     try {
//       setLoading(true);
//       setApiError("");
//       setSuccessMsg("");

//       await registerUser({
//         email,
//         password,
//         confirm_password: confirmPassword,
//         first_name: firstName,
//         last_name: lastName,
//         role: UserRole.PRO,
//       });

//       setSuccessMsg("تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.");
//       setEmail(""); setFirstName(""); setLastName(""); setPassword(""); setConfirmPassword("");

//       setTimeout(() => navigate("/login"), 2000);
//     } catch (err: unknown) {
//       const errorMsg =
//         (err as { response?: { data?: { detail?: string } } }).response?.data
//           ?.detail || "حدث خطأ أثناء التسجيل، حاول مرة أخرى.";
//       setApiError(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const labelRight = "right-16 sm:right-12"; 

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md md:max-w-3xl text-right">
//         <p className="text-2xl font-semibold text-[#febc34] mb-4 sm:mb-6 leading-relaxed">
//           مرحباً بكم في منصة رحلة تعلم، الآن يمكنكم التسجيل للدخول إلى المنصة
//         </p>

//         <div className="flex justify-center mb-4 sm:mb-6">
//           <img src={registerImg} alt="register" className="w-40 sm:w-64" />
//         </div>

//         {successMsg && <p className="text-green-600 text-center mb-3">{successMsg}</p>}
//         {apiError && <p className="text-red-600 text-center mb-3">{apiError}</p>}

//         <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
//           {/* Email input */}
//           <div className="relative">
//             <div className="flex items-center bg-[#febc34] rounded-full px-3 py-2 sm:px-4 sm:py-3">
//               <FaEnvelope className="text-black ml-2 sm:ml-3" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="flex-1 bg-transparent outline-none text-black text-sm sm:text-lg"
//               />
//               <label className={`absolute ${labelRight} text-black transition-all duration-300 pointer-events-none ${email ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
//                 البريد الالكتروني
//               </label>
//             </div>
//             {errors.email && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.email}</p>}
//           </div>

//           {/* First name input */}
//           <div className="relative">
//             <div className="flex items-center bg-[#febc34] rounded-full px-3 py-2 sm:px-4 sm:py-3">
//               <FaUser className="text-black ml-2 sm:ml-3" />
//               <input
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 className="flex-1 bg-transparent outline-none text-black text-sm sm:text-lg"
//               />
//               <label className={`absolute ${labelRight} text-black transition-all duration-300 pointer-events-none ${firstName ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
//                 الاسم الأول
//               </label>
//             </div>
//             {errors.firstName && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.firstName}</p>}
//           </div>

//           {/* Last name input */}
//           <div className="relative">
//             <div className="flex items-center bg-[#febc34] rounded-full px-3 py-2 sm:px-4 sm:py-3">
//               <FaUser className="text-black ml-2 sm:ml-3" />
//               <input
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 className="flex-1 bg-transparent outline-none text-black text-sm sm:text-lg"
//               />
//               <label className={`absolute ${labelRight} text-black transition-all duration-300 pointer-events-none ${lastName ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
//                 الاسم الأخير
//               </label>
//             </div>
//             {errors.lastName && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.lastName}</p>}
//           </div>

//           {/* Password input */}
//           <div className="relative">
//             <div className="flex items-center bg-[#febc34] rounded-full px-3 py-2 sm:px-4 sm:py-3">
//               <FaLock className="text-black ml-2 sm:ml-3" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="flex-1 bg-transparent outline-none text-black text-sm sm:text-lg"
//               />
//               <button type="button" className="ml-2 text-black" onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <FaEye /> : <FaEyeSlash />}
//               </button>
//               <label className={`absolute ${labelRight} text-black transition-all duration-300 pointer-events-none ${password ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
//                 كلمة المرور
//               </label>
//             </div>
//             {errors.password && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.password}</p>}
//           </div>

//           {/* Confirm password input */}
//           <div className="relative">
//             <div className="flex items-center bg-[#febc34] rounded-full px-3 py-2 sm:px-4 sm:py-3">
//               <FaLock className="text-black ml-2 sm:ml-3" />
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="flex-1 bg-transparent outline-none text-black text-sm sm:text-lg"
//               />
//               <button type="button" className="ml-2 text-black" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
//               </button>
//               <label className={`absolute ${labelRight} text-black transition-all duration-300 pointer-events-none ${confirmPassword ? "-top-2 text-xs sm:text-sm" : "top-1/2 -translate-y-1/2 text-sm sm:text-lg"}`}>
//                 تأكيد كلمة المرور
//               </label>
//             </div>
//             {errors.confirmPassword && <p className="text-red-600 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>}
//           </div>

//           <div className="flex flex-col items-center mt-4 sm:mt-6">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-1/2 sm:w-1/3 bg-[#002538] text-white rounded-full py-2 sm:py-3 text-sm sm:text-lg font-semibold hover:opacity-90 transition cursor-pointer disabled:opacity-50"
//             >
//               {loading ? "جاري التسجيل..." : "تسجيل"}
//             </button>

//             <Link to="/login" className="mt-5 text-3xl sm:text-base text-black hover:underline">
//               سجل الآن
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
