export enum ExamType {
  PRE_EXAM = "pre_exam",
  QUIZ = "quiz",
  FINAL_EXAM = "final_exam",
  ACTIVITY = "activity",
}

export interface Exam {
  id: number;
  module_id: number | null;
  course_id: number | null;
  time: number;
  questions: Question[];
}

export interface Question {
  id: number;
  exam_id: number;
  question_text: string;
  options: Option[];
}

export interface Option {
  id: number;
  option_text: string;
}

export interface ExamAnswer {
  question_id: number;
  selected_option_id: number;
}

export interface ExamSubmissionRequestBody {
  exam_id: number;
  exam_type: ExamType;
  answers: ExamAnswer[];
}

export interface ExamSubmissionResult {
  success: boolean;
  score: number;
  total_questions: number;
  correct_answers: number;
  passed: boolean;
  message: string;
  next_available_exam_id: number | null;
  next_available_lesson_id: number | null;
  next_available_module_id: number | null;
  progress_updated: boolean;
  detailed_review?: QuestionReview[] | null;
}

export interface OptionReview extends Option {
  is_correct: boolean;
}

export interface QuestionReview extends Question {
  options: OptionReview[]; // Use the new extended OptionReview interface
  submitted_option_id: number | null;
  is_correctly_answered: boolean;
}

export interface AlreadySubmittedResponse {
  status: "already_submitted";
  error: string;
  exam_type: string;
  result: ExamSubmissionResult; // The actual submission data
}
