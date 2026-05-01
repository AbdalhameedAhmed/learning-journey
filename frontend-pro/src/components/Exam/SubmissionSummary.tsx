import type { ExamSubmissionResult } from "@schemas/Exam";
import clsx from "clsx";
import { BookOpen } from "lucide-react";

const SubmissionSummary = ({
  result,
  shouldShowReviewData,
  handleToggleDetails,
  goToNextModuleChild,
  isNextEnable,
  withoutResults = false,
}: {
  result: ExamSubmissionResult;
  shouldShowReviewData: boolean | null | undefined;
  handleToggleDetails: () => void;
  goToNextModuleChild: () => void;
  isNextEnable: boolean;
  withoutResults?: boolean;
}) => {
  const statusClasses = result.passed
    ? "bg-green-100 border-green-500 text-green-800"
    : "bg-red-100 border-red-500 text-red-800";

  const statusText = result.passed ? "ناجح" : "راسب";

  const customQuote = result.passed
    ? "أحسنت، إجابتك صحيحة! استمر على نفس المستوى المتميز❤️✅"
    : "إجابتك خاطئة! لكن محاولتك تستحق التقدير، ركز في المرة القادمة😊";

  return (
    <div className="exam-result text-text dark:text-dark-text mx-auto my-12 w-full max-w-xl rounded-xl bg-white p-8 text-center shadow-2xl dark:bg-slate-800">
      <h2
        className={clsx("text-text-normal font-extrabold", {
          "mb-6": !withoutResults,
          "mb-0": withoutResults,
        })}
      >
        تم تسليم الاختبار
      </h2>

      {/* Quote Section */}

      {!withoutResults ? (
        <>
          <p
            className={`mb-6 text-lg font-medium ${result.passed ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
          >
            {customQuote}
          </p>

          {/* Status Section */}
          <div
            className={`text-text-small mb-8 inline-block rounded-full border-4 px-6 py-2 font-bold ${statusClasses}`}
          >
            الحالة: {statusText}
          </div>

          {/* Score Details Section */}
          <div className="text-text-tiny space-y-4">
            <p className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold">النتيجة الإجمالية:</span>
              <span className="text-primary font-bold">
                {result.total_questions} / {result.correct_answers}
              </span>
            </p>
            <p className="flex items-center justify-between border-b pb-2">
              <span className="font-semibold">الإجابات الصحيحة:</span>
              <span className="font-bold text-green-600">
                {result.correct_answers}
              </span>
            </p>
            <p className="flex items-center justify-between">
              <span className="font-semibold">نسبة النجاح:</span>
              <span
                className={`text-text-small font-extrabold ${
                  result.passed ? "text-green-700" : "text-red-700"
                }`}
              >
                {result.score.toFixed(0)}%
              </span>
            </p>
          </div>

          {shouldShowReviewData && (
            <div className="mx-auto flex w-full max-w-xl flex-col px-4">
              <button
                onClick={handleToggleDetails}
                className="bg-primary dark:bg-dark-primary mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-md transition-all duration-200 hover:opacity-90"
              >
                <BookOpen size={20} />
                مراجعة الإجابات الصحيحة
              </button>

              <button
                disabled={!isNextEnable}
                onClick={goToNextModuleChild}
                className="bg-primary dark:bg-dark-primary mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-md transition-all duration-200 hover:opacity-90 disabled:opacity-60"
              >
                التالى
              </button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
};

export default SubmissionSummary;
