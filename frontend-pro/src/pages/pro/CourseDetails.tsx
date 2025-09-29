import AssetResource from "@/components/courseDetails/AssetsRresource";
import HeaderButton from "@/components/courseDetails/HeaderButton";
import ModuleMenu from "@/components/courseDetails/ModuleMenu";
import ExamArea from "@/components/Exam/ExamArea";
import Spinner from "@/components/Spinner";
import { useGetMe } from "@/hooks/auth/useGetMe";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import type { ExamHeader, LessonHeader } from "@schemas/course";
import { ExamType } from "@schemas/Exam";
import { HardDriveDownload, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

interface ModuleChild {
  type: "lesson" | ExamType;
  child: LessonHeader | ExamHeader;
}

export default function CourseDetails() {
  const courseId = useParams().courseId;
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeLesson, setActiveLesson] = useState<LessonHeader>();
  const [activeExam, setActiveExam] = useState<ExamHeader>();
  const [openedModule, setOpendModule] = useState<number>();
  const [examType, setExamType] = useState<ExamType>();
  const { courseDetails, isPending } = useGetCourseDetails(courseId);
  const { me, isPending: isUserPending } = useGetMe();

  useEffect(() => {
    if (!courseDetails) return;

    const lessonId = searchParams.get("lessonId");
    const examId = searchParams.get("examId");

    if (lessonId) {
      for (const module of courseDetails.modules) {
        const lesson = module.lessons.find((l) => l.id === parseInt(lessonId));
        if (lesson) {
          setActiveLesson(lesson);
          setOpendModule(module.id);
          setActiveExam(undefined);
          break;
        }
      }
    } else if (examId) {
      const examIdNum = parseInt(examId);
      const exam = courseDetails.exams.find((exam) => exam.id === examIdNum);
      if (exam) {
        setActiveExam(exam);
        setActiveLesson(undefined);

        if (exam.module_id) {
          setOpendModule(exam.module_id);
        } else {
          setOpendModule(undefined);
        }
      }
    }
  }, [courseDetails, searchParams]);

  function setActiveLessonHandler(lesson: LessonHeader) {
    setActiveLesson(lesson);
    setActiveExam(undefined);
    setSearchParams({ lessonId: String(lesson.id) }, { replace: true });
  }

  function setActiveExamHandler(exam: ExamHeader, examType: ExamType) {
    setActiveExam(exam);
    setActiveLesson(undefined);
    setExamType(examType);
    setSearchParams({ examId: String(exam.id) }, { replace: true });

    if (exam.module_id) {
      setOpendModule(exam.module_id);
    } else {
      setOpendModule(undefined);
    }
  }

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

  if (isPending || isUserPending) return <Spinner />;

  const progressData = me?.current_progress_data;
  const nextAvailableModuleId = progressData?.next_available_module_id;
  const nextAvailableExamId = progressData?.next_available_exam_id;
  const isFinalExamAvailable = progressData?.is_final_exam_available;
  const courseCompleted = progressData?.course_completed;

  return (
    <div className="flex min-h-screen w-screen flex-col items-center gap-4">
      <div className="bg-primary h-[80px] w-full"></div>
      <div className="bg-primary h-[60px] w-[700px]"></div>
      {/* <Navbar /> */}

      <div className="flex w-full flex-1 items-center justify-center overflow-auto">
        <div className="flex w-[300px] flex-col items-center gap-2 self-stretch overflow-auto rounded-tl-lg rounded-bl-lg bg-[#E9E9E9] p-4">
          <div className="flex w-full flex-col gap-4 text-center">
            {/* Pre-exam */}
            <HeaderButton
              title="الامتحان القبلي"
              onClick={() =>
                setActiveExamHandler(courseDetails!.exams[0], ExamType.PRE_EXAM)
              }
            />
            {courseDetails?.modules?.map((module) => {
              return (
                <ModuleMenu
                  key={module.id}
                  module={module}
                  activeLesson={activeLesson}
                  setActiveLessonHandler={setActiveLessonHandler}
                  activeExam={activeExam}
                  setActiveExamHandler={setActiveExamHandler}
                  openedModule={openedModule}
                  setOpendModule={setOpendModule}
                  nextAvailableModuleId={nextAvailableModuleId}
                  nextAvailableExamId={nextAvailableExamId}
                />
              );
            })}
            {/* Post-exam */}
            <HeaderButton
              title="الامتحان البعدي"
              disabled={!isFinalExamAvailable && !courseCompleted}
              onClick={() =>
                setActiveExamHandler(
                  courseDetails!.exams[0],
                  ExamType.FINAL_EXAM,
                )
              }
            />
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-12 overflow-auto">
          <div className="flex w-full max-w-[800px] flex-1 items-center justify-center">
            {activeLesson && <AssetResource lessonId={activeLesson.id} />}
            {activeExam && examType && (
              <ExamArea examId={activeExam?.id} examType={examType} />
            )}
            {!activeLesson && !activeExam && <p>برجاء اختيار الدرس</p>}
          </div>
          {activeLesson && (
            <>
              <div className="flex w-full max-w-[800px] items-center justify-between">
                <button
                  className="bg-primary text-text-size cursor-pointer rounded-lg px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!getNextModuleChild()}
                  onClick={goToNextModuleChild}
                >
                  التالى
                </button>
                <div className="flex items-center justify-center gap-6">
                  <button
                    className="bg-primary text-text-size cursor-pointer rounded-lg px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!getPrevModuleChild()}
                    onClick={goToPrevModuleChild}
                  >
                    السابق
                  </button>
                  <div className="flex items-center gap-2">
                    <HardDriveDownload color="#3138A0" />
                    <Heart color="#3138A0" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
