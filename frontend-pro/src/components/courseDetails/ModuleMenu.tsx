import type { Lesson, Module } from "@schemas/course";
import clsx from "clsx";
import type { Dispatch, SetStateAction } from "react";

type ModuleMenuProps = {
  module: Module;
  activeLesson: Lesson | undefined;
  setActiveLessonHandler: (lesson: Lesson) => void;
  openedModule: number | undefined;
  setOpendModule: Dispatch<SetStateAction<number | undefined>>;
};

export default function ModuleMenu({
  module,
  activeLesson,
  setActiveLessonHandler,
  openedModule,
  setOpendModule,
}: ModuleMenuProps) {
  return (
    <div className="flex w-full flex-col gap-2 text-center" key={module.id}>
      <p
        className="w-full cursor-pointer rounded-2xl bg-[#FFB732] p-2 text-white"
        onClick={() => setOpendModule(module.id)}
      >
        {module.name}
      </p>
      <div
        className={clsx(
          "flex max-h-[0px] w-full flex-col gap-2 overflow-hidden px-6 transition-all duration-300",
          {
            "max-h-[1000px]": openedModule === module.id,
          },
        )}
      >
        {module.lessons.map((lesson) => {
          return (
            <p
              key={lesson.id}
              className={clsx(
                "cursor-pointer rounded-2xl border border-[#FFB732] py-1",
                {
                  "bg-[#FFB732] text-white": activeLesson?.id === lesson.id,
                },
              )}
              onClick={() => setActiveLessonHandler(lesson)}
            >
              {lesson.name}
            </p>
          );
        })}
      </div>
    </div>
  );
}
