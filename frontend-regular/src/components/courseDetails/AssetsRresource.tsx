import { useGetLesson } from "@/hooks/courseContent/useGetLesson";
import type { Asset, ErrorResponse, LessonResponse } from "@schemas/course";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../../../node_modules/swiper/modules/navigation.css";
import "../../../node_modules/swiper/modules/pagination.css";
import "../../../node_modules/swiper/swiper.css";
import Spinner from "../Spinner";
import VideoViewer from "./VideoViewer";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

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

  const assets = useMemo(
    () => (isLessonResponse(lesson) ? (lesson.lesson.assets as Asset[]) : []),
    [lesson],
  );

  const assetsTypes = new Array(...new Set(assets.map((asset) => asset.type)));
  const [selectedType, setSelectedType] = useState<string | undefined>(
    assetsTypes[0],
  );

  useEffect(() => {
    if (isLessonResponse(lesson)) {
      setSelectedType(lesson.lesson.assets[0].type);
    }
  }, [lesson]);

  function handleAssetTypeChange(type: string) {
    setSelectedType(type);
  }

  const filteredAssets = useMemo(() => {
    if (!selectedType) return assets;
    const filtered = assets.filter((asset) => asset.type === selectedType);
    return filtered;
  }, [assets, selectedType]);

  if (isPending) return <Spinner />;

  if (lesson && isErrorResponse(lesson)) {
    return <p className="p-4 text-xl text-red-600">{lesson.error}</p>;
  }

  if (!assets || assets.length === 0) {
    return <p className="p-4 text-xl">لا توجد موارد متاحة لهذا الدرس.</p>;
  }

  function arabicAssetType(type: string): string {
    switch (type) {
      case "video":
        return "فيديو";
      case "text":
        return "نص";
      case "image":
        return "صورة";
      case "pdf":
        return "ملف";
      default:
        return type;
    }
  }

  return (
    <div className="flex h-full w-full flex-col gap-12">
      <div className="flex items-center gap-4">
        {!lesson?.lesson.is_activity &&
          assetsTypes.map((type) => (
            <button
              onClick={() => handleAssetTypeChange(type)}
              className={clsx(
                "border-primary dark:border-dark-primary text-text-small text-text dark:text-dark-text cursor-pointer rounded-lg border px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50",
                {
                  "bg-primary dark:bg-dark-primary text-text-small text-white":
                    selectedType === type,
                },
              )}
              key={type}
            >
              {arabicAssetType(type)}
            </button>
          ))}
      </div>
      {!selectedType ||
        (filteredAssets.length === 0 && assets.length > 0 && (
          <p>اختار نوع الدرس</p>
        ))}
      {filteredAssets[0]?.type === "video" && (
        <VideoViewer key={filteredAssets[0].id} url={filteredAssets[0].url} />
      )}
      {filteredAssets[0]?.type === "text" && (
        <div dangerouslySetInnerHTML={{ __html: filteredAssets[0].url }}></div>
      )}
      {filteredAssets[0]?.type === "image" && (
        <div className="w-full">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
          >
            {filteredAssets.map((asset) => (
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
      )}

      {filteredAssets[0]?.type === "pdf" && (
        <div className="mx-auto w-full max-w-[800px]">
          <object
            className="h-full min-h-[600px] w-full"
            data={filteredAssets[0].url + "#toolbar=0"}
            type="application/pdf"
            width="100%"
            height="100%"
          ></object>
        </div>
      )}
    </div>
  );
}
