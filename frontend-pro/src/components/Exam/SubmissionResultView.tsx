import type { ExamSubmissionResult } from "@schemas/Exam";

const SubmissionResultView = ({ result }: { result: ExamSubmissionResult }) => {
  const statusClasses = result.passed
    ? "bg-green-100 border-green-500 text-green-800"
    : "bg-red-100 border-red-500 text-red-800";

  const statusText = result.passed ? "ناجح" : "راسب";

  return (
    <div className="exam-result mx-auto my-12 w-full max-w-xl rounded-xl bg-white p-8 text-center shadow-2xl">
      <h2 className="mb-6 text-3xl font-extrabold text-gray-800">
        تم تسليم الامتحان
      </h2>
      <div
        className={`mb-8 inline-block rounded-full border-4 px-6 py-2 text-xl font-bold ${statusClasses}`}
      >
        الحالة: {statusText}
      </div>

      <div className="space-y-4 text-lg">
        <p className="flex items-center justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">
            النتيجة الإجمالية:
          </span>
          <span className="text-primary font-bold">
            {result.correct_answers} / {result.total_questions}
          </span>
        </p>
        <p className="flex items-center justify-between border-b pb-2">
          <span className="font-semibold text-gray-600">الإجابات الصحيحة:</span>
          <span className="font-bold text-green-600">
            {result.correct_answers}
          </span>
        </p>
        <p className="flex items-center justify-between">
          <span className="font-semibold text-gray-600">نسبة النجاح:</span>
          <span
            className={`text-2xl font-extrabold ${
              result.passed ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.score.toFixed(0)}%
          </span>
        </p>
      </div>
    </div>
  );
};

export default SubmissionResultView;
