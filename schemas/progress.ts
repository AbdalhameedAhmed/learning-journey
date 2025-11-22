export type ProgressData = Student[];

export interface Student {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  completed_lessons_ids: number[];
  exam_submissions: ExamSubmission[];
  pre_exam: PreExam;
  final_exam: FinalExam;
  current_progress: number;
  profile_picture: string;
}

export interface PreExam {
  has_pre_exam: boolean;
  score: number;
}
export interface FinalExam {
  has_final_exam: boolean;
  score: number;
}

export interface ExamSubmission {
  exam_id: number;
  exam_type: string;
}
