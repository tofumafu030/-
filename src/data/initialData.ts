import { Book, ReadingLog, SocialPost, UserProfile, ReadingGoal } from '../types';

export const INITIAL_USER: UserProfile = {
  name: '愛讀書的艾莉絲',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  bio: '探索文字的溫度，每天至少閱讀30分鐘 📚✨',
  currentStreak: 12,
  longestStreak: 21,
  totalMinutesRead: 1480,
  totalPagesRead: 2350,
};

export const INITIAL_GOAL: ReadingGoal = {
  year: 2026,
  targetBooks: 24,
  completedBooks: 8,
  targetPages: 6000,
  readPages: 2350,
  dailyGoalMinutes: 30,
};

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b1',
    title: '原子習慣：細微改變帶來巨大成就',
    author: '詹姆斯・克利爾 (James Clear)',
    totalPages: 320,
    currentPage: 210,
    category: '自我成長',
    status: 'reading',
    startDate: '2026-07-10',
    coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
    colorGradient: 'from-amber-500 to-orange-600',
    rating: 5,
    notes: '關於如何建立微小習慣系統的經典作品，非常實用。',
    favoriteQuotes: [
      '你不會提升到你目標的水平，你會下降到你系統的水平。',
      '每天進步1%，一年後你會進步37倍。'
    ]
  },
  {
    id: 'b2',
    title: '被討厭的勇氣',
    author: '岸見一郎、古賀史健',
    totalPages: 300,
    currentPage: 300,
    category: '心理勵志',
    status: 'completed',
    startDate: '2026-06-01',
    finishDate: '2026-06-18',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400',
    colorGradient: 'from-blue-600 to-indigo-800',
    rating: 5,
    notes: '阿德勒心理學的啟蒙，學會區分課題，不再活在別人的期待中。',
    favoriteQuotes: [
      '問題不在於「世界」是什麼樣子，而在於「你」是什麼樣子。',
      '所謂的自由，就是被別人討厭。'
    ]
  },
  {
    id: 'b3',
    title: '快思慢想 (Thinking, Fast and Slow)',
    author: '丹尼爾・卡尼曼 (Daniel Kahneman)',
    totalPages: 560,
    currentPage: 145,
    category: '認知心理',
    status: 'reading',
    startDate: '2026-07-15',
    coverUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400',
    colorGradient: 'from-emerald-600 to-teal-800',
    notes: '系統一（直覺）與系統二（理性）的思維運作剖析。'
  },
  {
    id: 'b4',
    title: '沙丘 (Dune)',
    author: '法蘭克・赫伯特 (Frank Herbert)',
    totalPages: 680,
    currentPage: 0,
    category: '科幻小說',
    status: 'want_to_read',
    coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=400',
    colorGradient: 'from-yellow-600 to-amber-800'
  },
  {
    id: 'b5',
    title: '蛤蟆先生去看心理師',
    author: '羅伯・狄波德 (Robert de Board)',
    totalPages: 220,
    currentPage: 220,
    category: '心理諮商',
    status: 'completed',
    startDate: '2026-06-20',
    finishDate: '2026-07-02',
    coverUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=400',
    colorGradient: 'from-teal-500 to-emerald-700',
    rating: 5,
    favoriteQuotes: [
      '能對情緒負起責任的人，只有你自己。'
    ]
  }
];

export const INITIAL_LOGS: ReadingLog[] = [
  {
    id: 'l1',
    bookId: 'b1',
    bookTitle: '原子習慣：細微改變帶來巨大成就',
    date: '2026-07-23',
    pagesRead: 25,
    startPage: 185,
    endPage: 210,
    durationMinutes: 35,
    notes: '今天讀到第四章關於環境暗示的作用，把手機放遠一點真的能大幅減少分心！',
    quote: '打造好的環境，讓正確的選擇變得理所當然。',
    createdAt: '2026-07-23T20:00:00Z'
  },
  {
    id: 'l2',
    bookId: 'b1',
    bookTitle: '原子習慣：細微改變帶來巨大成就',
    date: '2026-07-22',
    pagesRead: 30,
    startPage: 155,
    endPage: 185,
    durationMinutes: 40,
    notes: '每天固定時間閱讀，真的變成了自動化反應。',
    createdAt: '2026-07-22T21:15:00Z'
  },
  {
    id: 'l3',
    bookId: 'b3',
    bookTitle: '快思慢想 (Thinking, Fast and Slow)',
    date: '2026-07-21',
    pagesRead: 20,
    startPage: 125,
    endPage: 145,
    durationMinutes: 30,
    notes: '錨定效應在生活中的應用，原來我們常被最初的資訊所綁架。',
    createdAt: '2026-07-21T19:30:00Z'
  },
  {
    id: 'l4',
    bookId: 'b1',
    bookTitle: '原子習慣：細微改變帶來巨大成就',
    date: '2026-07-20',
    pagesRead: 25,
    startPage: 130,
    endPage: 155,
    durationMinutes: 30,
    notes: '兩分鐘法則：把習慣縮小到只要花兩分鐘就能完成的規模。',
    quote: '重點在於建立習慣，而不是一開始就追求完美。',
    createdAt: '2026-07-20T22:00:00Z'
  }
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'p1',
    userId: 'u1',
    userName: '愛讀書的艾莉絲',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bookTitle: '原子習慣',
    author: '詹姆斯・克利爾',
    postType: 'quote',
    content: '今天讀《原子習慣》最有感的一句話！只要改變1%的微小習慣，長期累積起來的複利效應真的很驚人！大家今天讀了什麼書呢？📖✨',
    quoteText: '你不會提升到你目標的水平，你會下降到你系統的水平。',
    progressPercent: 65,
    pagesReadToday: 25,
    likes: 18,
    hasLiked: true,
    commentsCount: 3,
    cardTheme: 'sunset-vibe',
    timestamp: '2小時前',
    comments: [
      {
        id: 'c1',
        userName: '漫步字裡行間',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        content: '這句話我也畫了劃線！真的超推薦建立系統，比單純訂目標有保障多了。',
        timestamp: '1小時前'
      },
      {
        id: 'c2',
        userName: '哲學貓咪',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        content: '加油！連續閱讀12天超強的！🔥',
        timestamp: '45分鐘前'
      }
    ]
  },
  {
    id: 'p2',
    userId: 'u2',
    userName: '書香晨曦',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    bookTitle: '蛤蟆先生去看心理師',
    author: '羅伯・狄波德',
    postType: 'milestone',
    content: '🎉 終於完成了今年第 6 本書！《蛤蟆先生去看心理師》這本書讓我重新梳理了自己的情緒狀態。童年時期的自我狀態並不是終點，我們都可以選擇成人的自我狀態。',
    quoteText: '能對情緒負起責任的人，只有你自己。',
    progressPercent: 100,
    likes: 32,
    hasLiked: false,
    commentsCount: 5,
    cardTheme: 'emerald-zen',
    timestamp: '5小時前',
    comments: []
  },
  {
    id: 'p3',
    userId: 'u3',
    userName: '科幻迷馬克',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    bookTitle: '三體',
    author: '劉慈欣',
    postType: 'progress',
    content: '晚上靜心閱讀《三體》，宇宙社會學的兩大公理真的讓人頭皮發麻。今天讀了 45 頁！',
    quoteText: '給歲月以文明，而不是給文明以歲月。',
    progressPercent: 42,
    pagesReadToday: 45,
    likes: 24,
    hasLiked: false,
    commentsCount: 2,
    cardTheme: 'dark-luxury',
    timestamp: '8小時前',
    comments: []
  }
];
