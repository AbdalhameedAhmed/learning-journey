import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import { downloadReport } from "@/utils/reports";
import { ExamType } from "@schemas/Exam";
import { NotepadText } from "lucide-react";

export default function ExamsList() {
  const { courseDetails } = useGetCourseDetails("1");

  const urlOrigin =
    import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api";

  function downloadQuizHandler(quizId: number, fileName: string) {
    const url = new URL(urlOrigin);
    url.pathname = "/api/admin/quiz-report";
    url.searchParams.append("quiz_id", quizId.toString());
    downloadReport(url.toString(), fileName);
  }

  function downloadExamHandler(
    examId: number,
    examType: ExamType,
    fileName: string,
  ) {
    const url = new URL(urlOrigin);
    url.pathname = "/api/admin/exam-report";
    url.searchParams.append("quiz_id", examId.toString());
    url.searchParams.append("exam_type", examType);

    downloadReport(url.toString(), fileName);
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-800">تحميل التقارير</h1>

      <div className="p-4">
        {/* Grid container for responsive card layout */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ExamCell
            onClick={() =>
              downloadExamHandler(
                courseDetails?.exams[0].id || 0,
                ExamType.PRE_EXAM,
                "الأختبار القبلى.xlsx",
              )
            }
            key={courseDetails?.exams[0].id + "pre"}
            title="الاختبار القبلى"
            examId={courseDetails?.exams[0].id || 0}
          />
          {courseDetails?.modules.map((module) => (
            <ExamCell
              onClick={() =>
                downloadQuizHandler(
                  module.quizzes[0].id,
                  "اختبار " + module.name + ".xlsx",
                )
              }
              key={module.quizzes[0].id}
              title={"اختبار " + module.name}
              examId={module.quizzes[0].id}
            />
          ))}
          <ExamCell
            onClick={() =>
              downloadExamHandler(
                courseDetails?.exams[0].id || 0,
                ExamType.FINAL_EXAM,
                "الأختبار البعدى.xlsx",
              )
            }
            key={courseDetails?.exams[0].id + "after"}
            title="الاختبار البعدى"
            examId={courseDetails?.exams[0].id || 0}
          />
        </div>
      </div>
    </>
  );
}

function ExamCell({
  title,
  examId,
  onClick,
}: {
  title: string;
  examId: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      key={examId}
      className="flex h-40 cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-b-4 border-blue-500 bg-white p-6 text-center shadow-lg transition-all duration-300 ease-in-out hover:border-blue-700 hover:shadow-2xl"
    >
      <NotepadText size={35} className="text-primary" />
      {/* The Exam Name */}
      <p className="line-clamp-2 text-lg font-semibold text-gray-800">
        {title}
      </p>
    </div>
  );
}
