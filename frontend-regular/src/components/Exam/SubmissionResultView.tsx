import { ExamType, type ExamSubmissionResult } from "@schemas/Exam";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import QuestionReviewItem from "./QuestionReviewItem";
import SubmissionSummary from "./SubmissionSummary";
import type { ExamHeader, LessonHeader } from "@schemas/course";
import { useParams, useSearchParams } from "react-router";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";

const SubmissionResultView = ({
  result,
  setActiveLessonHandler,
  setActiveExamHandler,
}: {
  result: ExamSubmissionResult;
  setActiveLessonHandler: (lesson: LessonHeader) => void;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const courseId = useParams().courseId;

  const [searchParams] = useSearchParams();
  const { courseDetails } = useGetCourseDetails(courseId);

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
    return null;
  }

  function getLessonDataByActivityId(activityId: number): {
    lessonIndex: number;
    lessonId: number;
    moduleIndex: number;
    moduleId: number;
  } | null {
    if (!courseDetails) return null;

    let lessonData = null;
    courseDetails.modules.map((module, moduleIndex) => {
      module.lessons.map((lesson, lessonIndex) => {
        if (lesson.activity && lesson.activity.id == activityId) {
          lessonData = {
            lessonIndex,
            lessonId: lesson.id,
            moduleIndex,
            moduleId: module.id,
          };
        }
      });
    });
    return lessonData;
  }

  function getLessonIndexAndModuleIndex(lessonId: number) {
    let lessonIndex = null;
    let moduleIndex = null;
    courseDetails?.modules.forEach((module, mIndex) => {
      module.lessons.forEach((lesson, lIndex) => {
        if (lesson.id === lessonId) {
          lessonIndex = lIndex;
          moduleIndex = mIndex;
        }
      });
    });
    return { lessonIndex, moduleIndex };
  }

  function getModuleIndexByExamId(examId: number) {
    if (!courseDetails) return null;
    const exam = courseDetails.exams.find((e) => e.id === examId);
    if (exam && exam.module_id) {
      return courseDetails.modules.findIndex((m) => m.id === exam.module_id);
    }
    return null;
  }

  function getNextModuleChild() {
    const lessonId = searchParams.get("lessonId");
    const examId = searchParams.get("examId");
    if (lessonId) {
      const { lessonIndex, moduleIndex } = getLessonIndexAndModuleIndex(
        parseInt(lessonId),
      );
      if (lessonIndex === null || moduleIndex === null) return null;
      const module = courseDetails!.modules[moduleIndex];
      const lesson = courseDetails!.modules[moduleIndex].lessons[lessonIndex];

      //in normal lesson case
      if (lesson && lesson.activity_id) {
        return {
          type: ExamType.ACTIVITY,
          child: {
            id: lesson.activity?.id,
            course_id: 1,
            module_id: module.id,
            created_at: new Date(),
          },
        };
      } else {
        //in goals lessons case
        const nextChild =
          courseDetails!.modules[moduleIndex].lessons[lessonIndex + 1];
        return { type: "lesson", child: nextChild };
      }
    }

    if (examId) {
      const exam = getExamObject(parseInt(examId));
      if (!exam) return null;

      if (exam.type === ExamType.ACTIVITY) {
        const lessonData = getLessonDataByActivityId(parseInt(examId));

        console.log("activity case", lessonData);
        if (
          lessonData &&
          lessonData.lessonId <
            courseDetails!.modules[lessonData.moduleIndex].lessons.length - 1
        ) {
          const nextChild =
            courseDetails!.modules[lessonData.moduleIndex].lessons[
              lessonData.lessonIndex + 1
            ];
          return { type: "lesson", child: nextChild };
        }
        if (
          lessonData &&
          lessonData.lessonIndex ===
            courseDetails!.modules[lessonData.moduleIndex].lessons.length - 1
        ) {
          const nextChild =
            courseDetails!.modules[lessonData.moduleIndex].quizzes[0];
          return { type: ExamType.QUIZ, child: nextChild };
        }
        return { type: ExamType.ACTIVITY, child: exam.child };
      }

      const moduleIndex = getModuleIndexByExamId(parseInt(examId));

      if (moduleIndex === null) return null;
      if (moduleIndex < courseDetails!.modules.length - 1) {
        const nextChild = courseDetails!.modules[moduleIndex + 1].lessons[0];
        return { type: "lesson", child: nextChild };
      }
      if (moduleIndex === courseDetails!.modules.length - 1) {
        const nextChild = courseDetails!.exams[0];
        return { type: ExamType.FINAL_EXAM, child: nextChild };
      }
    }
    return null;
  }

  function goToNextModuleChild() {
    const nextModuleChild = getNextModuleChild();
    console.log(nextModuleChild);

    if (!nextModuleChild) return;
    if (nextModuleChild.type === "lesson") {
      setActiveLessonHandler(nextModuleChild.child as LessonHeader);
    } else {
      setActiveExamHandler(
        nextModuleChild.child as ExamHeader,
        nextModuleChild.type as ExamType,
      );
    }
    return nextModuleChild;
  }

  return (
    <>
      {!showDetails && (
        <SubmissionSummary
          result={result}
          shouldShowReviewData={shouldShowReviewData}
          handleToggleDetails={handleToggleDetails}
          goToNextModuleChild={goToNextModuleChild}
          getNextModuleChild={getNextModuleChild}
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
