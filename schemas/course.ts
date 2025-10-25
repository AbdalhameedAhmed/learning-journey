export interface Course {
  id: number;
  name: string;
  modules: Module[];
  exams: ExamHeader[];
}

export interface Module {
  id: number;
  name: string;
  lessons: LessonHeader[];
  quizzes: ExamHeader[];
}

export interface LessonHeader {
  id: number;
  name: string;
  activity_id: number | null;
  activity: Activity | null;
}

export interface Activity {
  id: number;
  name: string;
  time: number;
}

export interface Lesson extends LessonHeader {
  assets: Asset[];
}

export interface LessonResponse {
  lesson: Lesson;
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export interface ExamHeader {
  id: number;
  course_id?: number;
  module_id?: number;
  created_at: Date;
}

export interface Asset {
  id: number;
  url: string;
  type: string;
}

export interface Note {
  note: string;
  time: number;
  id: number;
}

export interface AddNote {
  note: string;
  time: number;
  lesson_id: number;
}

export interface Favorite {
  id: number;
  user_id: number;
  lesson_id: number;
}
