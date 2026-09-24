export interface User {
  id: string;
  googleId: string;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface Track {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  order: number;
}

export interface ModuleSummary {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  order: number;
}

export interface TrackDetail extends Track {
  modules: ModuleSummary[];
}

export interface LessonSummary {
  id: string;
  slug: string;
  title: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  order: number;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  order: number;
}

export interface ModuleDetail {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  order: number;
  trackId: string;
  lessons: LessonSummary[];
  quiz: Quiz | null;
  checklistItems: ChecklistItem[];
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  order: number;
  moduleId: string;
  contentMarkdown: string;
}

export interface QuizAttemptResult {
  score: number;
  total: number;
  correct: boolean[];
}

export interface ModuleProgress {
  completedLessonIds: string[];
  checkedChecklistItemIds: string[];
  quizBestScore: number | null;
  quizAttemptCount: number;
}

export interface ProgressModule {
  moduleId: string;
  slug: string;
  title: string;
  trackSlug: string;
  lessonsDone: number;
  lessonsTotal: number;
  quizBestScore: number | null;
  quizAttempts: number;
  checklistDone: number;
  checklistTotal: number;
  percent: number;
}

export interface ProgressTrack {
  slug: string;
  title: string;
  percent: number;
}

export interface ProgressResponse {
  tracks: ProgressTrack[];
  modules: ProgressModule[];
}
