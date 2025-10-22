import ExamsList from "@/components/dashboard/Exams";
import Sidebar from "@/components/dashboard/Sidebar";
import StudentDetail from "@/components/dashboard/StudentDetails";
import StudentsProgress from "@/components/dashboard/StudentsProgress";
import { useState } from "react";

const DashboardPage = () => {
  // State to manage the active view: 'dashboard' (table) or 'detail'
  const [activeView, setActiveView] = useState<
    "dashboard" | "detail" | "exams"
  >("dashboard");
  // State to hold the ID of the student currently being viewed
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null,
  );

  const handleRowClick = (studentId: number) => {
    setSelectedStudentId(studentId);
    setActiveView("detail");
  };

  const handleBack = () => {
    setSelectedStudentId(null);
    setActiveView("dashboard");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 1. Sidebar */}
      <Sidebar setActiveView={setActiveView} />

      {/* 2. Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6">
        {activeView === "dashboard" && (
          // Student Table View
          <StudentsProgress handleRowClick={handleRowClick} />
        )}

        {activeView === "detail" && selectedStudentId && (
          // Student Detail View
          <StudentDetail studentId={selectedStudentId} onBack={handleBack} />
        )}

        {activeView === "exams" && (
          // Student Detail View
          <ExamsList />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
