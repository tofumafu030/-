export type ReadingStatus = 'reading' | 'completed' | 'want_to_read' | 'paused';

export interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  coverUrl?: string;
  category: string;
  status: ReadingStatus;
  startDate?: string;
  finishDate?: string;
  rating?: number; // 1-5
  notes?: string;
  favoriteQuotes?: string[];
  colorGradient?: string;
}

export interface ReadingLog {
  id: string;
  bookId: string;
  bookTitle: string;
  date: string; // YYYY-MM-DD
  pagesRead: number;
  startPage: number;
  endPage: number;
  durationMinutes: number; // minutes
  notes?: string;
  quote?: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  bookTitle: string;
  author: string;
  postType: 'progress' | 'quote' | 'review' | 'milestone';
  content: string;
  quoteText?: string;
  progressPercent?: number;
  pagesReadToday?: number;
  likes: number;
  hasLiked?: boolean;
  commentsCount: number;
  comments: SocialComment[];
  timestamp: string;
  cardTheme?: string;
}

export interface SocialComment {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

export interface ReadingGoal {
  year: number;
  targetBooks: number;
  completedBooks: number;
  targetPages: number;
  readPages: number;
  dailyGoalMinutes: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
  currentStreak: number;
  longestStreak: number;
  totalMinutesRead: number;
  totalPagesRead: number;
}

export type CardTheme = 'minimal-paper' | 'dark-luxury' | 'pastel-warm' | 'sunset-vibe' | 'vintage-typewriter' | 'emerald-zen';

export interface ShareCardConfig {
  theme: CardTheme;
  title: string;
  author: string;
  quote: string;
  notes: string;
  pagesRead?: number;
  progressPercent?: number;
  userName: string;
  date: string;
  showQrCode: boolean;
  aspectRatio: '1:1' | '9:16' | '4:3';
}
