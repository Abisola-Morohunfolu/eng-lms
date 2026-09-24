import type {
  Lesson,
  ModuleDetail,
  ModuleProgress,
  ProgressResponse,
  QuizAttemptResult,
  Track,
  TrackDetail,
  User,
} from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

function get<T>(path: string): Promise<T> {
  return api<T>(path);
}

function post<T>(path: string, body: unknown = {}): Promise<T> {
  return api<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export const googleLoginUrl = `${API_BASE}/auth/google`;

export const authApi = {
  me: () => get<User>('/auth/me'),
  logout: () => post<{ ok: boolean }>('/auth/logout'),
};

export const contentApi = {
  tracks: () => get<Track[]>('/tracks'),
  track: (slug: string) => get<TrackDetail>(`/tracks/${slug}`),
  module: (slug: string) => get<ModuleDetail>(`/modules/${slug}`),
  lesson: (slug: string) => get<Lesson>(`/lessons/${slug}`),
};

export const progressApi = {
  progress: () => get<ProgressResponse>('/me/progress'),
  moduleProgress: (slug: string) => get<ModuleProgress>(`/modules/${slug}/progress`),
  completeLesson: (lessonId: string) => post(`/lessons/${lessonId}/complete`),
  toggleChecklistItem: (itemId: string) =>
    post<{ checked: boolean }>(`/checklist-items/${itemId}/toggle`),
  submitQuiz: (quizId: string, answers: number[]) =>
    post<QuizAttemptResult>(`/quizzes/${quizId}/attempts`, { answers }),
};
