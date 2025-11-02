import { courseContent } from "@/constants/courseContent";
import { useActiveAssetContext } from "@/context/ActiveAssetContext/useActiveAsset";
import { useGetFavorites } from "@/hooks/courseContent/useGetFavorites";
import { useGetLesson } from "@/hooks/courseContent/useGetLesson";
import { useToggleFavorite } from "@/hooks/courseContent/useToggleFavorite";
import type {
  Asset,
  Course,
  ErrorResponse,
  ExamHeader,
  LessonResponse,
} from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import clsx from "clsx";
import { HardDriveDownload, Heart } from "lucide-react";

interface AssetsViewerFooterProps {
  lessonId: number;
  courseDetails: Course | undefined;
  setActiveLessonHandler: (lesson_id: number) => void;
  setActiveExamHandler: (exam: ExamHeader, examType: ExamType) => void;
}

export default function AssetsViewerFooter({
  lessonId,
  courseDetails,
  setActiveLessonHandler,
  setActiveExamHandler,
}: AssetsViewerFooterProps) {
  const { lesson } = useGetLesson(lessonId);
  const { favorites } = useGetFavorites();
  const { toggleFavorite, isPending: isTogglePending } = useToggleFavorite();
  const { selectedType, selectedAssetIndex } = useActiveAssetContext();

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

        <div className="flex items-center gap-4">
          {selectedType !== "text" && selectedAssetIndex !== null && (
            <button
              onClick={() => {
                // download asset from cloudinary
                if (assets)
                  window.open(
                    assets[selectedAssetIndex].url.replace(
                      "/upload",
                      "/upload/fl_attachment",
                    ),
                    "_blank",
                  );
              }}
              className="cursor-pointer"
            >
              <HardDriveDownload className="text-text dark:text-dark-text" />
            </button>
          )}
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
