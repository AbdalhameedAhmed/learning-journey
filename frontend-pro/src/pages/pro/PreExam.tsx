import ExamArea from "@/components/Exam/ExamArea";
import { useGetCourseDetails } from "@/hooks/courseContent/useGetCourseDetails";
import { ExamType } from "@schemas/Exam";
import { useSearchParams } from "react-router";

export default function PreExam() {
  const [searchParams] = useSearchParams();

  const { courseDetails } = useGetCourseDetails(
    searchParams.get("courseId") || undefined,
  );

  return (
    <div className="h-screen w-screen">
      {courseDetails?.exams[0] && (
        <ExamArea
          examId={courseDetails?.exams[0].id}
          examType={ExamType.PRE_EXAM}
          withoutResults={true}
        />
      )}
    </div>
  );
}
