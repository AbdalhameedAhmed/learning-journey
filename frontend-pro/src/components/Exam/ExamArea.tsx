import { useGetExam } from "@/hooks/courseContent/useGetExam";
import { useSubmitExam } from "@/hooks/courseContent/useSubmitExam";
import type { ErrorResponse } from "@schemas/course";
import type {
  Exam,
  ExamAnswer,
  ExamSubmissionResult,
  ExamType,
} from "@schemas/Exam";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";
import SubmissionResultView from "./SubmissionResultView";

const ExamArea = ({
  examId,
  examType,
}: {
  examId: number;
  examType: ExamType;
}) => {
  const [submissionResult, setSubmissionResult] = useState<
    ExamSubmissionResult | undefined
  >(undefined);

  const handleSubmissionSuccess = (data: ExamSubmissionResult) => {
    setSubmissionResult(data);
  };
  const { exam, isPending: isPendingGettingExam } = useGetExam(
    examId,
    examType,
  );
  const { submit, isPending: isPendingSubmittingExam } = useSubmitExam(
    handleSubmissionSuccess,
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<ExamAnswer[]>([]);
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [showMarkedQuestions, setShowMarkedQuestions] = useState(false);

  useEffect(() => {
    setSubmissionResult(undefined);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setMarkedQuestions(new Set());
  }, [examId, examType]);

  const isErrorResponse = (
    data: Exam | ErrorResponse | undefined,
  ): data is ErrorResponse => {
    return data !== undefined && "error" in data;
  };

  const isExamResponse = (
    data: Exam | ErrorResponse | undefined,
  ): data is Exam => {
    return data !== undefined && "questions" in data;
  };

  if (isPendingGettingExam) return <Spinner />;

  if (isErrorResponse(exam)) {
    return (
      <div className="text-text-normal p-8 text-center text-red-600">
        {exam.error}
      </div>
    );
  }

  if (!isExamResponse(exam)) {
    return (
      <div className="text-text-normal p-8 text-center">
        لم يتم العثور على الامتحان
      </div>
    );
  }

  if (!exam) return <div>لم يتم العثور على الامتحان</div>;

  const findSelectedOptionId = (questionId: number): number | undefined => {
    return selectedAnswers.find((answer) => answer.question_id === questionId)
      ?.selected_option_id;
  };

  const answeredQuestionIds = new Set(
    selectedAnswers.map((a) => a.question_id),
  );

  const currentQuestion = exam.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === exam.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  const allQuestionsAnswered =
    exam.questions.length === answeredQuestionIds.size;

  const markedQuestionsList = Array.from(markedQuestions);

  const toggleMarkQuestion = (questionId: number) => {
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleAnswerSelect = (
    question_id: number,
    selected_option_id: number,
  ) => {
    setSelectedAnswers((prev) => [
      ...prev,
      { question_id, selected_option_id },
    ]);
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowMarkedQuestions(false);
  };

  const goToMarkedQuestion = (questionId: number) => {
    const questionIndex = exam.questions.findIndex((q) => q.id === questionId);
    if (questionIndex !== -1) {
      setCurrentQuestionIndex(questionIndex);
    }
    setShowMarkedQuestions(false);
  };

  const handleExamSubmit = () => {
    submit({
      exam_id: examId,
      exam_type: examType,
      answers: selectedAnswers,
    });
  };

  const getQuestionStatus = (questionId: number) => {
    if (answeredQuestionIds.has(questionId)) return "answered";
  };

  if (submissionResult) {
    return <SubmissionResultView result={submissionResult} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
      {/* Questions Navigation Panel */}
      <div className="w-full">
        <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-text dark:text-dark-text text-text-tiny font-semibold">
              الأسئلة
            </h3>
            <button
              onClick={() => setShowMarkedQuestions(!showMarkedQuestions)}
              className={`rounded-full px-3 py-1 ${
                showMarkedQuestions
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              الأسئلة الموسومة ({markedQuestions.size})
            </button>
          </div>

          {showMarkedQuestions ? (
            <div>
              <h4 className="mb-3 font-medium text-gray-700">
                الأسئلة الموسومة:
              </h4>
              <div className="flex flex-wrap gap-2">
                {markedQuestionsList.length > 0 ? (
                  markedQuestionsList.map((questionId) => {
                    const question = exam.questions.find(
                      (q) => q.id === questionId,
                    );
                    const questionIndex = exam.questions.findIndex(
                      (q) => q.id === questionId,
                    );
                    return question ? (
                      <button
                        key={questionId}
                        onClick={() => goToMarkedQuestion(questionId)}
                        className={`text-text-tiny flex items-center gap-2 rounded-lg border p-2 transition-all ${
                          currentQuestion.id === questionId
                            ? "border-primary bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-purple-500">★</span>
                        <span>سؤال {questionIndex + 1}</span>
                      </button>
                    ) : null;
                  })
                ) : (
                  <p className="w-full py-2 text-center text-sm text-gray-500">
                    لا توجد أسئلة موسومة
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {exam.questions.map((question, index) => {
                const status = getQuestionStatus(question.id);
                const isMarked = markedQuestions.has(question.id);
                const isCurrent = index === currentQuestionIndex;

                return (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                      isCurrent
                        ? "border-primary bg-primary text-white"
                        : status === "answered"
                          ? "border-green-500 bg-green-100"
                          : "border-gray-300 bg-gray-50"
                    } ${isMarked ? "ring-2 ring-violet-400" : ""}`}
                    title={`سؤال ${index + 1}${isMarked ? " (موسوم)" : ""}`}
                  >
                    <span className="text-text-tiny font-medium">
                      {index + 1}
                    </span>
                    {isMarked && (
                      <span className="absolute -top-1 -right-1 text-xs text-purple-500">
                        ★
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-[var(--text-text-tiny)] w-[var(--text-text-tiny)] rounded border border-green-500 bg-green-100"></div>
                <span className="text-text dark:text-dark-text text-text-tiny">
                  تم الإجابة
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-[var(--text-text-tiny)] w-[var(--text-text-tiny)] rounded border border-gray-300 bg-gray-50"></div>
                <span className="text-text dark:text-dark-text text-text-tiny">
                  لم يتم
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="border-primary bg-primary h-[var(--text-text-tiny)] w-[var(--text-text-tiny)] rounded border"></div>
                <span className="text-text dark:text-dark-text text-text-tiny">
                  الحالي
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star
                  className="h-[var(--text-text-tiny)] w-[var(--text-text-tiny)] text-purple-500"
                  fill="currentColor"
                />
                <span className="text-text dark:text-dark-text text-text-tiny">
                  موسوم
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Content */}
      <div className="w-full">
        <div className="exam-area rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
          {/* Progress Bar and Header */}
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleMarkQuestion(currentQuestion.id)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full p-2 transition-all ${
                    markedQuestions.has(currentQuestion.id)
                      ? "bg-purple-100 text-purple-500"
                      : "text-gray-400 hover:bg-purple-50 hover:text-purple-500"
                  }`}
                  title={
                    markedQuestions.has(currentQuestion.id)
                      ? "إزالة الوسم"
                      : "وسم السؤال"
                  }
                >
                  <Star
                    className="h-[var(--text-text-tiny)] w-[var(--text-text-tiny)]"
                    fill="currentColor"
                  />
                </button>
                <span className="text-text-tiny text-gray-600">
                  السؤال {currentQuestionIndex + 1} من {exam.questions.length}
                </span>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="mx-auto w-full max-w-2xl">
              <h3 className="text-text-normal mb-6 text-center leading-relaxed font-semibold text-gray-800">
                {currentQuestion.question_text}
              </h3>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() =>
                      handleAnswerSelect(currentQuestion.id, option.id)
                    }
                    disabled={isPendingSubmittingExam}
                    className={`font-inherit text-text-small w-full rounded-full border-2 p-4 text-right transition-all duration-300 hover:cursor-pointer ${
                      findSelectedOptionId(currentQuestion.id) === option.id
                        ? "border-primary bg-primary -translate-x-4 transform text-white"
                        : "dark:!text-dark-text border-gray-300 bg-gray-100 text-gray-800 hover:border-gray-400 dark:bg-slate-900"
                    } ${
                      !isPendingSubmittingExam &&
                      "hover:-translate-x-4 hover:transform"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {option.option_text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion || isPendingSubmittingExam}
              className="font-inherit text-text-small cursor-pointer rounded-full border-2 border-gray-500 bg-gray-500 px-6 py-2 text-white transition-all duration-300 hover:bg-gray-600 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300"
            >
              السابق
            </button>

            <div className="flex items-center gap-4">
              <span className="text-text-tiny text-gray-600">
                {selectedAnswers.length} / {exam.questions.length} تم الإجابة
              </span>

              {isLastQuestion || allQuestionsAnswered ? (
                <button
                  onClick={handleExamSubmit}
                  disabled={!allQuestionsAnswered || isPendingSubmittingExam}
                  className="font-inherit border-primary bg-primary hover:bg-primary/90 text-text-small cursor-pointer rounded-full border-2 px-6 py-2 text-white transition-all duration-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300"
                >
                  {isPendingSubmittingExam
                    ? "جاري التسليم..."
                    : "تسليم الامتحان"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={isPendingSubmittingExam}
                  className="font-inherit border-primary bg-primary hover:bg-primary/90 text-text-small cursor-pointer rounded-full border-2 px-6 py-2 text-white transition-all duration-300 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300"
                >
                  التالي
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamArea;
