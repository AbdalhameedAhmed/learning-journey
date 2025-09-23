import GuestOnlyRoute from "@/components/authorization/GuestOnlyRoute";
import RoleBasedRoute from "@/components/authorization/RoleBasedRoute";
import DashboardPage from "@/pages/admin/DashboardPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";
import HomePage from "@/pages/pro/HomePage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import { UserRole } from "@schemas/User";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import CourseDetails from "./pages/pro/CourseDetails";

const App = () => {
  return (
    <>
      <Routes>
        {/* GUEST-only routes */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        
        {/* PRO-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={[UserRole.PRO]} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
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
