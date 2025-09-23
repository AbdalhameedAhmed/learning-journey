import AssetResource from "@/components/courseDetails/AssetsRresource";
import ModuleMenu from "@/components/courseDetails/ModuleMenu";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import type { Lesson } from "@schemas/course";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, Clipboard, HardDriveDownload } from "lucide-react";
export default function CourseDetails() {
  const courseId = useParams().courseId;
  const [activeLesson, setActiveLesson] = useState<Lesson>();
  const [openedModule, setOpendModule] = useState<number>();
  const { courseDetails } = useGetCourseDetails(courseId);

  function setActiveLessonHandler(lesson: Lesson) {
    setActiveLesson(lesson);
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center gap-4">
      <div className="h-[80px] w-full bg-[#FFB732]"></div>
      <div className="h-[60px] w-[700px] bg-[#FFB732]"></div>
      <div className="flex w-full flex-1 items-center justify-center overflow-auto">
        <div className="flex h-full w-[300px] flex-col items-center gap-2 overflow-auto bg-[#E9E9E9] p-4">
          {courseDetails?.modules?.map((module) => {
            return (
              <>
                <ModuleMenu
                  module={module}
                  activeLesson={activeLesson}
                  setActiveLessonHandler={setActiveLessonHandler}
                  openedModule={openedModule}
                  setOpendModule={setOpendModule}
                />
              </>
            );
          })}
        </div>
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-12 overflow-auto p-12">
          <div className="flex w-full max-w-[800px] flex-1 items-center justify-center p-4">
            {activeLesson && <AssetResource asset={activeLesson.assets[0]} />}
            {!activeLesson && <p>برجاء اختيار الدرس</p>}
          </div>
          {activeLesson && (
            <>
              <div className="flex w-full max-w-[800px] items-center justify-between">
                <button>التالى</button>
                <div className="flex items-center justify-center gap-6">
                  <button>السابق</button>
                  <div className="flex items-center gap-2">
                    <HardDriveDownload color="#3138A0" />
                    <Clipboard color="#3138A0" />
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
