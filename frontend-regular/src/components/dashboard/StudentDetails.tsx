import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import { useGetProgress } from "@/hooks/dashboard/useGetProgress";
import { ChevronRight } from "lucide-react";

export default function StudentDetail({
  studentId,
  onBack,
}: {
  studentId: number;
  onBack: () => void;
}) {
  const { progress } = useGetProgress();
  const student = progress?.find((student) => student.user_id === studentId);
  const { courseDetails } = useGetCourseDetails("1");
  if (!student) {
    return (
      <div className="border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700">
        Student not found.
        <button
          onClick={onBack}
          className="ml-4 font-medium text-blue-600 hover:text-blue-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-800">تفاصيل الطالب</h1>
      <div className="rounded-lg bg-white p-8 shadow-xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex cursor-pointer items-center text-blue-600 transition-colors duration-200 hover:text-blue-800"
        >
          <ChevronRight />
          الرجوع الى صفحة التحكم
        </button>

        {/* Student Header (Name & Image) */}
        <div className="mb-10 flex items-center border-b pb-6">
          <img
            src={""}
            alt={student.first_name}
            className="ml-6 h-24 w-24 rounded-full border-4 border-blue-200 object-cover"
          />
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900">
              {student.first_name}
            </h2>
            <p className="text-lg text-gray-500">{student.email}</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4 text-center shadow-md">
            <p className="text-sm font-medium text-blue-600">
              عدد الدروس المكتملة
            </p>
            <p className="mt-1 text-3xl font-bold text-blue-900">
              {student.completed_lessons_ids.length}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4 text-center shadow-md">
            <p className="text-sm font-medium text-green-600">
              نتيجة الاخبار القبلى
            </p>
            <p className="mt-1 flex items-center justify-center text-3xl font-bold text-green-900">
              {student.pre_exam.has_pre_exam ? (
                student.pre_exam.score + "%"
              ) : (
                <span className="pt-2 text-sm">لم يجر الاختبار</span>
              )}
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 p-4 text-center shadow-md">
            <p className="text-sm font-medium text-purple-600">
              نتيجة الاختبار البعدى
            </p>
            <p className="mt-1 flex items-center justify-center text-3xl font-bold text-purple-900">
              {student.final_exam.has_final_exam ? (
                student.pre_exam.score + "%"
              ) : (
                <span className="pt-2 text-sm">لم يجر الاختبار</span>
              )}
            </p>
          </div>
        </div>

        {/* Lessons Completed List */}
        <h3 className="mb-4 text-2xl font-semibold text-gray-800">
          تقدم الدروس
        </h3>
        <ul className="space-y-3">
          {courseDetails?.modules.map((module) =>
            module.lessons.map((lesson) =>
              (() => {
                const isCompleted = student.completed_lessons_ids.includes(
                  lesson.id,
                );
                return (
                  <li
                    key={lesson.id}
                    className={`flex items-center justify-between rounded-lg p-4 ${isCompleted ? "border-l-4 border-green-500 bg-green-50" : "border-l-4 border-red-500 bg-red-50"}`}
                  >
                    <span
                      className={`font-medium ${isCompleted ? "text-green-800" : "text-red-800"}`}
                    >
                      {lesson.name}
                    </span>
                    <span
                      className={`text-sm font-semibold ${isCompleted ? "text-green-600" : "text-red-600"}`}
                    >
                      {isCompleted ? "تمت المشاهدة" : "لم تتم المشاهدة"}
                    </span>
                  </li>
                );
              })(),
            ),
          )}
        </ul>
      </div>
    </>
  );
}
