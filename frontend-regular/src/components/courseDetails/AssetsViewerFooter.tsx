import { courseContent } from "@/constants/courseContent";
import type { Course, ExamHeader } from "@schemas/course";
import { ExamType } from "@schemas/Exam";

interface AssetsViewerFooterProps {
  lessonId: number;
  courseDetails: Course | undefined;
  setActiveLessonHandler: (lesson_id: number) => void;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
}

export default function AssetsViewerFooter({
  courseDetails,
  lessonId,
  setActiveLessonHandler,
  setActiveExamHandler,
}: AssetsViewerFooterProps) {
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

  function getNextCourseChild(lessonId: number) {
    for (const child in courseContent) {
      if (
        courseContent[child].id === lessonId &&
        (courseContent[child].type === "lesson" ||
          courseContent[child].type === "activity")
      ) {
        return courseContent[+child + 1];
      }
    }
  }

  function getPrevCourseChild(lessonId: number) {
    for (const child in courseContent) {
      if (
        courseContent[child].id === lessonId &&
        (courseContent[child].type === "lesson" ||
          courseContent[child].type === "activity")
      ) {
        const prev = courseContent[+child - 1];
        if (prev.type != "module") {
          return prev;
        } else {
          return courseContent[+child - 2];
        }
      }
    }
  }

  function goToPrevModuleChild() {
    const prevModuleChild = getPrevCourseChild(lessonId);
    if (!prevModuleChild) return;
    if (
      prevModuleChild.type === "lesson" ||
      prevModuleChild.type === "activity"
    ) {
      setActiveLessonHandler(prevModuleChild.id);
    } else if (prevModuleChild.type === "exam") {
      const exam = getExamObject(prevModuleChild.id);
      if (exam) {
        setActiveExamHandler(exam.child as ExamHeader, exam.type);
      }
    }
  }

  function goToNextModuleChild() {
    const next = getNextCourseChild(lessonId);
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
    <div className="flex w-full max-w-[800px] items-center justify-between">
      <button
        className="bg-primary dark:bg-dark-primary text-text-small text-text dark:text-dark-text cursor-pointer rounded-lg px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!getPrevCourseChild(lessonId)}
        onClick={goToPrevModuleChild}
      >
        السابق
      </button>
      <div className="flex items-center justify-center gap-6">
        <button
          className="bg-primary dark:bg-dark-primary text-text-small text-text dark:text-dark-text cursor-pointer rounded-lg px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!getNextCourseChild(lessonId)}
          onClick={goToNextModuleChild}
        >
          التالى
        </button>
      </div>
    </div>
  );
}
