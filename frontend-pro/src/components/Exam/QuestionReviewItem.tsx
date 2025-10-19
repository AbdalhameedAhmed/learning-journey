import type { OptionReview, QuestionReview } from "@schemas/Exam";
import { CheckCircle, HelpCircle, XCircle } from "lucide-react";

const QuestionReviewItem = ({
  question,
  index,
}: {
  question: QuestionReview;
  index: number;
}) => {
  const isAnswered = question.submitted_option_id !== null;
  const isUnanswered = !isAnswered;

  const unansweredStatusClass =
    "mr-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300";
  const unansweredFooterClass =
    "mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300";

  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0 dark:border-slate-700">
      <h3 className="text-text-small mb-3 flex items-start font-bold">
        <span className="text-primary ml-2">{index + 1}.</span>
        {question.question_text}
        {isUnanswered && (
          // Unanswered Header
          <span className={unansweredStatusClass}>
            <HelpCircle size={12} />
            لم يتم الإجابة
          </span>
        )}
      </h3>

      <div className="text-text-tiny space-y-2">
        {question.options.map((option: OptionReview) => {
          const isSubmitted = option.id === question.submitted_option_id;
          const isCorrect = option.is_correct;

          let optionClass =
            "p-2 rounded-lg transition duration-200 flex items-center";
          let icon = null;

          if (isUnanswered) {
            if (isCorrect) {
              optionClass +=
                " bg-amber-100/50 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-600";
              icon = (
                <CheckCircle
                  size={16}
                  className="ml-2 min-w-[16px] text-amber-600 dark:text-amber-400"
                />
              );
            } else {
              optionClass +=
                " bg-gray-100 dark:bg-slate-700 border border-transparent opacity-80";
              icon = <span className="ml-2 w-4 min-w-[16px]"></span>;
            }
          } else if (isCorrect) {
            optionClass +=
              " bg-green-200/50 dark:bg-green-800/50 border border-green-500 font-semibold";
            icon = (
              <CheckCircle
                size={16}
                className="ml-2 min-w-[16px] text-green-600 dark:text-green-400"
              />
            );
          } else if (isSubmitted && !isCorrect) {
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
            icon = <span className="ml-2 w-4 min-w-[16px]"></span>;
          }

          return (
            <div key={option.id} className={optionClass}>
              {icon}
              <span className="flex-1">{option.option_text}</span>
            </div>
          );
        })}
      </div>

      {isUnanswered && (
        // Unanswered Footer
        <div className={unansweredFooterClass}>
          <div className="flex items-center gap-2">
            <HelpCircle size={16} />
            <span className="font-medium">لم يتم الإجابة على هذا السؤال</span>
          </div>
          <p className="mt-1 text-xs opacity-80">
            الإجابة الصحيحة تظهر باللون الأصفر للمراجعة
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionReviewItem;
