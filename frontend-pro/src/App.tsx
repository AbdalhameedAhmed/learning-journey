import GuestOnlyRoute from "@/components/authorization/GuestOnlyRoute";
import RoleBasedRoute from "@/components/authorization/RoleBasedRoute";
import DashboardPage from "@/pages/admin/DashboardPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import LandingPage from "@/pages/pro/LandingPage";
import NotFoundPage from "@/pages/NotFoundPage";
import ContentPage from "@/pages/pro/ContentPage";
import CourseDetails from "@/pages/pro/CourseDetails";
import GoalsPage from "@/pages/pro/GoalsPage";
import HomePage from "@/pages/pro/HomePage";
import InstructionsPage from "@/pages/pro/InstructionsPage";
import ProfilePage from "@/pages/pro/ProfilePage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import { UserRole } from "@schemas/User";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import Layout from "./components/Layout";
import PreExam from "./pages/pro/PreExam";

const App = () => {
  return (
    <>
      <Routes>
        {/* GUEST-only routes */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* PRO-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={[UserRole.PRO]} />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route path="/instructions" element={<InstructionsPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/content-map" element={<ContentPage />} />
            <Route path="/pre-exam" element={<PreExam />} />
          </Route>
        </Route>

        {/* ADMIN-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={[UserRole.ADMIN]} />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Notfound route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
