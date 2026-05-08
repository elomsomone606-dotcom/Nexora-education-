/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ModuleId = 'education' | 'university' | 'create' | 'ai' | 'dashboard' | 'admin' | 'speakflow' | 'projects' | 'coding';

export interface UserProfile {
  id: string;
  name: string;
  xp: number;
  level: number;
  enrolled_courses?: string[];
  completed_courses?: string[];
  badges?: string[];
}

export interface Instructor {
  id: string;
  name: string;
  photo: string;
  bio: string;
  specialty: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  minScore: number;
}

export interface Annotation {
  id: string;
  type: 'info' | 'tip' | 'warning' | 'definition' | 'keypoint';
  title: string;
  text: string;
}

export interface Resource {
  name: string;
  url: string;
  type: 'pdf' | 'zip' | 'link';
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'exercise';
  duration: string;
  videoUrl?: string;
  content?: string;
  annotations?: Annotation[];
  resources?: Resource[];
  quiz?: Quiz;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  price_credits: number;
  xp_reward: number;
  content: string;
  duration?: string;
  instructors: Instructor[];
  level?: 'Débutant' | 'Intermédiaire' | 'Expert' | 'Avancé' | 'Master' | 'Universitaire' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  lessons_count?: number;
  progress?: number;
  image?: string;
  modules?: CourseModule[];
  badge?: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  user_name: string;
  course_id: string;
  course_title: string;
  verification_code: string;
  score: number;
  date: string;
  signature?: string;
  qrCode?: string;
}
