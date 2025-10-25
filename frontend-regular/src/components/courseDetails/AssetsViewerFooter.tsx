import type { Course, ExamHeader, LessonHeader } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import { useSearchParams } from "react-router";

interface ModuleChild {
  type: "lesson" | ExamType;
  child: LessonHeader | ExamHeader;
}

interface AssetsViewerFooterProps {
  lessonId: number;
  courseDetails: Course | undefined;
  setActiveLessonHandler: (lesson: LessonHeader) => void;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
}

export default function AssetsViewerFooter({
  courseDetails,
  setActiveLessonHandler,
  setActiveExamHandler,
}: AssetsViewerFooterProps) {
  const [searchParams] = useSearchParams();

  function getModuleIndexByExamId(examId: number) {
    if (!courseDetails) return null;
    const exam = courseDetails.exams.find((e) => e.id === examId);
    if (exam && exam.module_id) {
      return courseDetails.modules.findIndex((m) => m.id === exam.module_id);
    }
    return null;
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
    courseDetails.modules.map((module, moduleIndex) => {
      module.lessons.map((lesson, lessonIndex) => {
        if (lesson.activity && lesson.activity.id === activityId) {
          return {
            lessonIndex,
            lessonId: lesson.id,
            moduleIndex,
            moduleId: module.id,
          };
        }
      });
    });
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

  function getPrevModuleChild(): ModuleChild | null {
    const lessonId = searchParams.get("lessonId");
    const examId = searchParams.get("examId");

    if (lessonId) {
      const { lessonIndex, moduleIndex } = getLessonIndexAndModuleIndex(
        parseInt(lessonId),
      );
      if (lessonIndex === null || moduleIndex === null) return null;
      if (lessonIndex == 0 && moduleIndex === 0) return null;

      if (lessonIndex > 0) {
        const prevChild =
          courseDetails!.modules[moduleIndex].lessons[lessonIndex - 1];
        if (prevChild.activity_id) {
          const exam = getExamObject(prevChild.activity_id);
          if (exam?.child)
            return { type: ExamType.ACTIVITY, child: exam?.child };
        }
        return { type: "lesson", child: prevChild };
      } else {
        const prevModule = courseDetails!.modules[moduleIndex - 1];
        const prevChild = prevModule.lessons[prevModule.lessons.length - 1];
        return { type: "lesson", child: prevChild };
      }
    }
    if (examId) {
      const exam = getExamObject(parseInt(examId));
      if (!exam) return null;

      if (exam.type === ExamType.ACTIVITY) {
        const lessonData = getLessonDataByActivityId(parseInt(examId));
        if (lessonData) {
          const prevChild =
            courseDetails!.modules[lessonData.moduleIndex].lessons[
              lessonData.lessonIndex
            ];
          return { type: "lesson", child: prevChild };
        }
      }

      const moduleId = getModuleIndexByExamId(parseInt(examId));
      if (moduleId === null) return null;
      const module = courseDetails!.modules[moduleId];
      const prevChild = module.lessons[module.lessons.length - 1];
      return { type: "lesson", child: prevChild };
    }

    return null;
  }

  function goToPrevModuleChild() {
    const prevModuleChild = getPrevModuleChild();
    if (!prevModuleChild) return;
    if (prevModuleChild.type === "lesson") {
      setActiveLessonHandler(prevModuleChild.child as LessonHeader);
    } else {
      setActiveExamHandler(
        prevModuleChild.child as ExamHeader,
        prevModuleChild.type,
      );
    }
  }

  function goToNextModuleChild() {
    const nextModuleChild = getNextModuleChild();
    if (!nextModuleChild) return;
    if (nextModuleChild.type === "lesson") {
      setActiveLessonHandler(nextModuleChild.child as LessonHeader);
    } else {
      setActiveExamHandler(
        nextModuleChild.child as ExamHeader,
        nextModuleChild.type as ExamType,
      );
    }
  }
  return (
    <div className="flex w-full max-w-[800px] items-center justify-between">
      <button
        className="bg-primary dark:bg-dark-primary text-text-small text-text dark:text-dark-text cursor-pointer rounded-lg px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!getPrevModuleChild()}
        onClick={goToPrevModuleChild}
      >
        السابق
      </button>
      <div className="flex items-center justify-center gap-6">
        <button
          className="bg-primary dark:bg-dark-primary text-text-small text-text dark:text-dark-text cursor-pointer rounded-lg px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!getNextModuleChild()}
          onClick={goToNextModuleChild}
        >
          التالى
        </button>
      </div>
    </div>
  );
}
