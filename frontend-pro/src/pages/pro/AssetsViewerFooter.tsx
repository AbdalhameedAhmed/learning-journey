import { useGetFavorites } from "@/hooks/courseContent/useGetFavorites";
import { useGetLesson } from "@/hooks/courseContent/useGetLesson";
import { useToggleFavorite } from "@/hooks/courseContent/useToggleFavorite";
import type {
  Asset,
  Course,
  ExamHeader,
  LessonHeader,
  LessonResponse,
  ErrorResponse,
} from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import clsx from "clsx";
import { HardDriveDownload, Heart } from "lucide-react";
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
  lessonId,
  courseDetails,
  setActiveLessonHandler,
  setActiveExamHandler,
}: AssetsViewerFooterProps) {
  const [searchParams] = useSearchParams();
  const { lesson } = useGetLesson(lessonId);

  const { favorites } = useGetFavorites();
  const { toggleFavorite, isPending: isTogglePending } = useToggleFavorite();

  const isCurrentLessonFavorited = lessonId
    ? favorites?.some((fav) => fav.lesson_id === lessonId)
    : false;

  const handleToggleFavorite = () => {
    if (!lessonId) return;
    toggleFavorite(lessonId);
  };

  const isLessonResponse = (
    data: LessonResponse | ErrorResponse | undefined,
  ): data is LessonResponse => {
    // Check if data is defined AND has the 'lesson' property
    return data !== undefined && "lesson" in data;
  };

  const assets = isLessonResponse(lesson)
    ? (lesson.lesson.assets as Asset[])
    : null;

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

  function getNextModuleChild() {
    const lessonId = searchParams.get("lessonId");
    const examId = searchParams.get("examId");
    if (lessonId) {
      const { lessonIndex, moduleIndex } = getLessonIndexAndModuleIndex(
        parseInt(lessonId),
      );
      if (lessonIndex === null || moduleIndex === null) return null;
      if (
        lessonIndex <
        courseDetails!.modules[moduleIndex].lessons.length - 1
      ) {
        const nextChild =
          courseDetails!.modules[moduleIndex].lessons[lessonIndex + 1];
        return { type: "lesson", child: nextChild };
      }
      if (
        lessonIndex ===
        courseDetails!.modules[moduleIndex].lessons.length - 1
      ) {
        const nextChild = courseDetails!.modules[moduleIndex].quizzes[0];
        return { type: ExamType.QUIZ, child: nextChild };
      }
    }

    if (examId) {
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
        return { type: "lesson", child: prevChild };
      } else {
        const prevModule = courseDetails!.modules[moduleIndex - 1];
        const prevChild = prevModule.lessons[prevModule.lessons.length - 1];
        return { type: "lesson", child: prevChild };
      }
    }
    if (examId) {
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
        className="bg-primary text-text-size cursor-pointer rounded-lg px-4 py-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
        disabled={!getNextModuleChild()}
        onClick={goToNextModuleChild}
      >
        التالى
      </button>
      <div className="flex items-center justify-center gap-6">
        <button
          className="bg-primary text-text-size cursor-pointer rounded-lg px-4 py-1 text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!getPrevModuleChild()}
          onClick={goToPrevModuleChild}
        >
          السابق
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              // download asset from cloudinary
              if (assets)
                window.open(
                  assets[0].url.replace("/upload", "/upload/fl_attachment"),
                  "_blank",
                );
            }}
            className="cursor-pointer"
          >
            <HardDriveDownload className="text-text dark:text-dark-text" />
          </button>
          <button
            onClick={handleToggleFavorite}
            disabled={isTogglePending}
            className={`rounded-full p-1 transition-colors ${
              isTogglePending
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-gray-100"
            }`}
          >
            <Heart
              className={clsx(
                "text-text dark:text-dark-text cursor-pointer transition-colors",
                {
                  "fill-[#ff0000] !text-[#ff0000]": isCurrentLessonFavorited,
                },
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
