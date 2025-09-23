export interface Course {
  id: number;
  name: string;
  modules: Module[];
}

export interface Module {
  id: number;
  name: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  name: string;
  assets: Asset[];
}

export interface Asset {
  id: number;
  url: string;
  type: string;
}
