import type { ExamSubmissionResult } from "@schemas/Exam";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import QuestionReviewItem from "./QuestionReviewItem";
import SubmissionSummary from "./SubmissionSummary";

const SubmissionResultView = ({ result }: { result: ExamSubmissionResult }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Check if we should display the detailed review (based on backend data existence)
  const shouldShowReviewData =
    result.detailed_review && result.detailed_review.length > 0;

  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <>
      {!showDetails && (
        <SubmissionSummary
          result={result}
          shouldShowReviewData={shouldShowReviewData}
          handleToggleDetails={handleToggleDetails}
        />
      )}

      {shouldShowReviewData && showDetails && (
        <div className="text-text mx-auto my-12 w-full max-w-3xl rounded-xl bg-white p-8 shadow-2xl dark:bg-slate-800">
          <h2 className="text-text-normal mb-6 border-b pb-4 text-lg font-bold dark:border-slate-700">
            مراجعة الإجابات
          </h2>

          <div className="space-y-6">
            {result.detailed_review!.map((question, index) => (
              <QuestionReviewItem
                key={index}
                question={question}
                index={index}
              />
            ))}
          </div>

          <div className="mx-auto w-full max-w-xl px-4">
            <button
              onClick={handleToggleDetails}
              className="bg-primary dark:bg-dark-primary mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-md transition-all duration-200 hover:opacity-90"
            >
              <BookOpen size={20} />
              العودة لرؤية النتيجة الإجمالية
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmissionResultView;
