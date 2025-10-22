import { useGetProgress } from "@/hooks/dashboard/useGetProgress";
import { CircleCheck, CircleX } from "lucide-react";
const COLUMNS = [
  "الاسم",
  "البريد الالكترونى",
  "عدد الدروس المكتملة",
  "الاختبار القبلى",
  "الاختبار البعدى",
];

export default function StudentsProgress({
  handleRowClick,
}: {
  handleRowClick: (studentNum: number) => void;
}) {
  const { progress } = useGetProgress();
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-gray-800">عرض تقدم الطلاب</h1>

      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {COLUMNS.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {progress?.map((student) => (
              <tr
                onClick={() => handleRowClick(student.user_id)}
                key={student.user_id}
                className="cursor-pointer transition-colors duration-150 hover:bg-blue-50"
              >
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                  {student.first_name} {student.last_name}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {student.email}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {student.completed_lessons_ids.length}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {student.pre_exam.has_pre_exam ? (
                    <CircleCheck className="fill-white text-green-300" />
                  ) : (
                    <CircleX className="fill-white text-red-300" />
                  )}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {student.final_exam.has_final_exam ? (
                    <CircleCheck className="fill-white text-green-300" />
                  ) : (
                    <CircleX className="fill-white text-red-300" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
