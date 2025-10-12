import type { OptionReview, QuestionReview } from "@schemas/Exam";
import { CheckCircle, XCircle } from "lucide-react";

const QuestionReviewItem = ({
  question,
  index,
}: {
  question: QuestionReview;
  index: number;
}) => {
  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0 dark:border-slate-700">
      <h3 className="text-text-small mb-3 flex items-start font-bold">
        <span className="text-primary mr-2">{index + 1}.</span>
        {question.question_text}
      </h3>

      <div className="text-text-tiny space-y-2">
        {question.options.map((option: OptionReview) => {
          const isSubmitted = option.id === question.submitted_option_id;
          const isCorrect = option.is_correct;

          let optionClass =
            "p-2 rounded-lg transition duration-200 flex items-center";
          let icon = null;

          if (isCorrect) {
            // Correct answer class (always visible in review)
            optionClass +=
              " bg-green-200/50 dark:bg-green-800/50 border border-green-500 font-semibold";
            icon = (
              <CheckCircle
                size={16}
                className="ml-2 min-w-[16px] text-green-600 dark:text-green-400"
              />
            );
          } else if (isSubmitted && !isCorrect) {
            // Incorrectly selected answer
            optionClass +=
              " bg-red-200/50 dark:bg-red-800/50 border border-red-500 font-semibold line-through opacity-70";
            icon = (
              <XCircle
                size={16}
                className="ml-2 min-w-[16px] text-red-600 dark:text-red-400"
              />
            );
          } else {
            // Unselected and incorrect answer
            optionClass +=
              " bg-gray-100 dark:bg-slate-700 border border-transparent";
            icon = <span className="ml-2 w-4 min-w-[16px]"></span>; // Placeholder for alignment
          }

          return (
            <div key={option.id} className={optionClass}>
              {icon}
              <span className="flex-1">{option.option_text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionReviewItem;
