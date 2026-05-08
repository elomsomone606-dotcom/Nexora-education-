/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, Course } from '../types';

const STORAGE_KEY = 'nexora_user_profile';
const PROGRESS_KEY = 'nexora_course_progress';
const AI_HISTORY_KEY = 'nexora_ai_history';
const SPEAKFLOW_HISTORY_KEY = 'nexora_speakflow_history';

export interface ChatThread {
  id: string;
  title: string;
  lastUpdate: number;
  messages: any[];
}

export const storageService = {
  getUser: (fallback: UserProfile): UserProfile => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return fallback;
    try {
      return JSON.parse(stored);
    } catch {
      return fallback;
    }
  },

  saveUser: (user: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  getCourseProgress: (courseId: string): number => {
    const stored = localStorage.getItem(`${PROGRESS_KEY}_${courseId}`);
    return stored ? parseInt(stored, 10) : 0;
  },

  saveCourseProgress: (courseId: string, progress: number) => {
    localStorage.setItem(`${PROGRESS_KEY}_${courseId}`, progress.toString());
  },

  getEnrolledCourses: (allCourses: Course[]): Course[] => {
    const user = storageService.getUser({} as any);
    if (!user.enrolled_courses) return [];
    return allCourses
      .filter(c => user.enrolled_courses.includes(c.id))
      .map(c => ({
        ...c,
        progress: storageService.getCourseProgress(c.id)
      }));
  },

  // AI History Methods
  getAIThreads: (): ChatThread[] => {
    const stored = localStorage.getItem(AI_HISTORY_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored).sort((a: ChatThread, b: ChatThread) => b.lastUpdate - a.lastUpdate);
    } catch {
      return [];
    }
  },

  saveAIThread: (thread: ChatThread) => {
    const threads = storageService.getAIThreads();
    const index = threads.findIndex(t => t.id === thread.id);
    if (index > -1) {
      threads[index] = thread;
    } else {
      threads.push(thread);
    }
    localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(threads));
  },

  deleteAIThread: (threadId: string) => {
    const threads = storageService.getAIThreads().filter(t => t.id !== threadId);
    localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(threads));
  },

  // SpeakFlow History Methods
  getSpeakFlowMessages: (): any[] => {
    const stored = localStorage.getItem(SPEAKFLOW_HISTORY_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  saveSpeakFlowMessages: (messages: any[]) => {
    localStorage.setItem(SPEAKFLOW_HISTORY_KEY, JSON.stringify(messages));
  }
};
