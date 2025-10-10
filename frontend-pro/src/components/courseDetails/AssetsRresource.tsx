import { useGetLesson } from "@/hooks/courseContent/useGetLesson";
import type { Asset, ErrorResponse, LessonResponse } from "@schemas/course";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../../node_modules/swiper/modules/navigation.css";
import "../../../node_modules/swiper/modules/pagination.css";
import "../../../node_modules/swiper/swiper.css";
import Spinner from "../Spinner";
import VideoViewer from "./VideoViewer";

export default function AssetResource({ lessonId }: { lessonId: number }) {
  const { lesson, isPending } = useGetLesson(lessonId);

  const isLessonResponse = (
    data: LessonResponse | ErrorResponse | undefined,
  ): data is LessonResponse => {
    // Check if data is defined AND has the 'lesson' property
    return data !== undefined && "lesson" in data;
  };

  const isErrorResponse = (
    data: LessonResponse | ErrorResponse | undefined,
  ): data is ErrorResponse => {
    return data !== undefined && "error" in data;
  };

  const assets = isLessonResponse(lesson)
    ? (lesson.lesson.assets as Asset[])
    : null;

  if (isPending) return <Spinner />;

  if (lesson && isErrorResponse(lesson)) {
    return <p className="p-4 text-xl text-red-600">{lesson.error}</p>;
  }

  if (!assets || assets.length === 0) {
    return <p className="p-4 text-xl">لا توجد موارد متاحة لهذا الدرس.</p>;
  }

  if (assets[0].type === "video") {
    return (
      <VideoViewer key={assets[0].id} url={assets[0].url} lessonId={lessonId} />
    );
  }
  if (assets[0].type === "image") {
    return (
      <div className="w-full">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {assets.map((asset) => (
            <SwiperSlide key={asset.id}>
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src={asset.url}
                  alt={`Slide ${asset.id}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }
  if (assets[0].type === "pdf") {
    return (
      <div className="w-full max-w-[800px]">
        <object
          className="h-full min-h-[600px] w-full"
          data={assets[0].url + "#toolbar=0"}
          type="application/pdf"
          width="100%"
          height="100%"
        ></object>
      </div>
    );
  }
  return null;
}
