import { courseContent } from "@/constants/courseContent";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import type { ExamHeader } from "@schemas/course";
import { ExamType, type ExamSubmissionResult } from "@schemas/Exam";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { useParams, useSearchParams } from "react-router";
import QuestionReviewItem from "./QuestionReviewItem";
import SubmissionSummary from "./SubmissionSummary";

const SubmissionResultView = ({
  result,
  setActiveLessonHandler,
  setActiveExamHandler,
  withoutResults = false,
}: {
  result: ExamSubmissionResult;
  setActiveLessonHandler: (lessonId: number) => void;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
  withoutResults?: boolean;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const courseId = useParams().courseId;

  const [searchParams] = useSearchParams();
  const { courseDetails } = useGetCourseDetails(courseId);
  const examId = searchParams.get("examId");

  // Check if we should display the detailed review (based on backend data existence)
  const shouldShowReviewData =
    result.detailed_review && result.detailed_review.length > 0;

  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  function getExamObject(examId: number): {
    type: ExamType;
    child: ExamHeader | undefined;
  } | null {
    if (!courseDetails) return null;
    // activity case
    console.log(courseDetails);

    for (const module of courseDetails.modules) {
      for (const lesson of module.lessons) {
        if (lesson.activity && lesson.activity.id === examId) {
          return {
            type: ExamType.ACTIVITY,
            child: lesson.activity,
          };
        }
      }
    }

    // exam case
    for (const exam of courseDetails.exams) {
      if (exam.id === examId) {
        return {
          type: ExamType.FINAL_EXAM,
          child: exam,
        };
      }
    }

    // module exams
    for (const module of courseDetails.modules) {
      for (const quiz of module.quizzes) {
        if (quiz.id === examId) {
          return {
            type: ExamType.QUIZ,
            child: quiz,
          };
        }
      }
    }

    return null;
  }

  function getNextCourseChild(examId: number) {
    for (const child in courseContent) {
      if (
        courseContent[child].id === examId &&
        courseContent[child].type === "exam"
      ) {
        const next = courseContent[+child + 1];
        if (next?.type !== "module") {
          return next;
        } else {
          return courseContent[+child + 2];
        }
      }
    }
  }

  function goToNextModuleChild() {
    const examId = searchParams.get("examId");
    if (!examId) return;
    const next = getNextCourseChild(+examId);
    console.log(next);
    if (next && (next.type === "lesson" || next.type === "activity")) {
      setActiveLessonHandler(next.id);
    } else if (next && next.type === "exam") {
      const exam = getExamObject(next.id);
      console.log(exam);

      if (exam) {
        setActiveExamHandler(exam.child as ExamHeader, exam.type);
      }
    }
  }

  return (
    <>
      {!showDetails && (
        <SubmissionSummary
          result={result}
          shouldShowReviewData={shouldShowReviewData}
          handleToggleDetails={handleToggleDetails}
          goToNextModuleChild={goToNextModuleChild}
          isNextEnable={!!getNextCourseChild(examId ? +examId : -1)}
          withoutResults={withoutResults}
        />
      )}

      {shouldShowReviewData && showDetails && !withoutResults && (
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
