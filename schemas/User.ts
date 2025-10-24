export enum UserRole {
  REGULAR = "regular",
  PRO = "pro",
  ADMIN = "admin",
}

export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  current_progress_data: IProgress;
  profile_picture: string | null;
}

export interface IProgress {
  is_final_exam_available: boolean;
  completed_modules: number[];
  completed_lessons: number[];
  next_available_module_id: number | null;
  next_available_lesson_id: number | null;
  next_available_exam_id: number | null;
  next_available_activity_id: number | null;
  course_completed?: boolean;
  completed_at?: Date;
}
