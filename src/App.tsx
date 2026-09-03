import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { BookLibraryView } from './components/BookLibraryView';
import { SocialFeedView } from './components/SocialFeedView';
import { StatsView } from './components/StatsView';
import { DailyLogModal } from './components/DailyLogModal';
import { ReadingTimerModal } from './components/ReadingTimerModal';
import { ShareCardGeneratorModal } from './components/ShareCardGeneratorModal';
import { AiCoachModal } from './components/AiCoachModal';
import {
  INITIAL_USER,
  INITIAL_GOAL,
  INITIAL_BOOKS,
  INITIAL_LOGS,
  INITIAL_POSTS,
} from './data/initialData';
import { Book, ReadingLog, SocialPost, UserProfile, ReadingGoal, CardTheme } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'library' | 'community' | 'stats'>('dashboard');

  // LocalStorage state initialization
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('readlog_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [goal, setGoal] = useState<ReadingGoal>(() => {
    const saved = localStorage.getItem('readlog_goal');
    return saved ? JSON.parse(saved) : INITIAL_GOAL;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('readlog_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [logs, setLogs] = useState<ReadingLog[]>(() => {
    const saved = localStorage.getItem('readlog_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [posts, setPosts] = useState<SocialPost[]>(() => {
    const saved = localStorage.getItem('readlog_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('readlog_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('readlog_goal', JSON.stringify(goal));
  }, [goal]);

  useEffect(() => {
    localStorage.setItem('readlog_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('readlog_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('readlog_posts', JSON.stringify(posts));
  }, [posts]);

  // Reading Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Modal Visibility States
  const [isDailyLogOpen, setIsDailyLogOpen] = useState(false);
  const [defaultLogBookId, setDefaultLogBookId] = useState<string | undefined>(undefined);

  const [isTimerOpen, setIsTimerOpen] = useState(false);

  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [shareCardBook, setShareCardBook] = useState<Book | undefined>(undefined);
  const [shareCardLog, setShareCardLog] = useState<ReadingLog | undefined>(undefined);

  const [isAiCoachOpen, setIsAiCoachOpen] = useState(false);

  // Handlers for Books & Logs
  const handleAddBook = (newBook: Omit<Book, 'id'>) => {
    const created: Book = {
      ...newBook,
      id: 'book_' + Date.now(),
    };
    setBooks([created, ...books]);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks(books.filter((b) => b.id !== bookId));
  };

  // Quick add pages from dashboard
  const handleQuickAddPages = (bookId: string, addedPages: number) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const newCurrent = Math.min(book.totalPages, book.currentPage + addedPages);
    const isFinished = newCurrent >= book.totalPages;

    // Update book
    const updatedBook: Book = {
      ...book,
      currentPage: newCurrent,
      status: isFinished ? 'completed' : book.status,
      finishDate: isFinished ? new Date().toISOString().split('T')[0] : book.finishDate,
    };
    setBooks(books.map((b) => (b.id === bookId ? updatedBook : b)));

    // Create a new reading log
    const todayStr = new Date().toISOString().split('T')[0];
    const newLog: ReadingLog = {
      id: 'log_' + Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      date: todayStr,
      pagesRead: addedPages,
      startPage: book.currentPage,
      endPage: newCurrent,
      durationMinutes: 15,
      notes: `快速打卡閱讀 +${addedPages} 頁`,
      createdAt: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);

    // Update user stats
    setUser((prev) => ({
      ...prev,
      totalPagesRead: prev.totalPagesRead + addedPages,
      totalMinutesRead: prev.totalMinutesRead + 15,
    }));
  };

  // Save Log from DailyLogModal
  const handleSaveLog = (newLog: Omit<ReadingLog, 'id' | 'createdAt'>, isBookCompleted?: boolean) => {
    const fullLog: ReadingLog = {
      ...newLog,
      id: 'log_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setLogs([fullLog, ...logs]);

    // Update corresponding book current page
    const book = books.find((b) => b.id === newLog.bookId);
    if (book) {
      const updatedBook: Book = {
        ...book,
        currentPage: newLog.endPage,
        status: isBookCompleted ? 'completed' : book.status,
        finishDate: isBookCompleted ? new Date().toISOString().split('T')[0] : book.finishDate,
      };
      setBooks(books.map((b) => (b.id === book.id ? updatedBook : b)));
    }

    // Update User Stats
    setUser((prev) => ({
      ...prev,
      totalPagesRead: prev.totalPagesRead + newLog.pagesRead,
      totalMinutesRead: prev.totalMinutesRead + newLog.durationMinutes,
      currentStreak: prev.currentStreak + 1,
    }));
  };

  // Complete session from ReadingTimerModal
  const handleCompleteTimerSession = (bookId: string, durationMinutes: number, pagesRead: number) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const newCurrentPage = Math.min(book.totalPages, book.currentPage + pagesRead);
    const isDone = newCurrentPage >= book.totalPages;

    const updatedBook: Book = {
      ...book,
      currentPage: newCurrentPage,
      status: isDone ? 'completed' : book.status,
      finishDate: isDone ? new Date().toISOString().split('T')[0] : book.finishDate,
    };
    setBooks(books.map((b) => (b.id === bookId ? updatedBook : b)));

    const newLog: ReadingLog = {
      id: 'log_' + Date.now(),
      bookId: book.id,
      bookTitle: book.title,
      date: new Date().toISOString().split('T')[0],
      pagesRead: pagesRead,
      startPage: book.currentPage,
      endPage: newCurrentPage,
      durationMinutes: durationMinutes,
      notes: `專注閱讀計時打卡 ${durationMinutes} 分鐘，累計 +${pagesRead} 頁。`,
      createdAt: new Date().toISOString(),
    };
    setLogs([newLog, ...logs]);

    setUser((prev) => ({
      ...prev,
      totalPagesRead: prev.totalPagesRead + pagesRead,
      totalMinutesRead: prev.totalMinutesRead + durationMinutes,
      currentStreak: prev.currentStreak + 1,
    }));

    // Reset timer
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  // Social Feed Handlers
  const handleToggleLike = (postId: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likes: hasLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: 'c_' + Date.now(),
            userName: user.name,
            userAvatar: user.avatar,
            content: commentText,
            timestamp: '剛剛',
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const handlePostToCommunity = (postContent: {
    bookTitle: string;
    author: string;
    content: string;
    quoteText?: string;
    cardTheme: CardTheme;
  }) => {
    const newPost: SocialPost = {
      id: 'post_' + Date.now(),
      userId: 'u_user',
      userName: user.name,
      userAvatar: user.avatar,
      bookTitle: postContent.bookTitle,
      author: postContent.author,
      postType: postContent.quoteText ? 'quote' : 'progress',
      content: postContent.content,
      quoteText: postContent.quoteText,
      likes: 1,
      hasLiked: true,
      commentsCount: 0,
      comments: [],
      cardTheme: postContent.cardTheme,
      timestamp: '剛剛',
    };
    setPosts([newPost, ...posts]);
    setActiveTab('community');
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#2C2C2B] flex flex-col font-sans selection:bg-[#5A5A40] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenDailyLog={() => {
          setDefaultLogBookId(undefined);
          setIsDailyLogOpen(true);
        }}
        onOpenTimer={() => setIsTimerOpen(true)}
        onOpenCoach={() => setIsAiCoachOpen(true)}
        isTimerRunning={isTimerRunning}
        timerSeconds={timerSeconds}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            books={books}
            logs={logs}
            onOpenDailyLogForBook={(bookId) => {
              setDefaultLogBookId(bookId);
              setIsDailyLogOpen(true);
            }}
            onQuickAddPages={handleQuickAddPages}
            onOpenTimer={() => setIsTimerOpen(true)}
            onOpenShareCardForLog={(log) => {
              setShareCardLog(log);
              setShareCardBook(undefined);
              setIsShareCardOpen(true);
            }}
            onOpenShareCardForBook={(book) => {
              setShareCardBook(book);
              setShareCardLog(undefined);
              setIsShareCardOpen(true);
            }}
            onNavigateToLibrary={() => setActiveTab('library')}
            onNavigateToCommunity={() => setActiveTab('community')}
            onOpenCoach={() => setIsAiCoachOpen(true)}
          />
        )}

        {activeTab === 'library' && (
          <BookLibraryView
            books={books}
            onAddBook={handleAddBook}
            onUpdateBook={handleUpdateBook}
            onDeleteBook={handleDeleteBook}
            onOpenShareCardForBook={(book) => {
              setShareCardBook(book);
              setShareCardLog(undefined);
              setIsShareCardOpen(true);
            }}
            onOpenDailyLogForBook={(bookId) => {
              setDefaultLogBookId(bookId);
              setIsDailyLogOpen(true);
            }}
          />
        )}

        {activeTab === 'community' && (
          <SocialFeedView
            posts={posts}
            user={user}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onOpenCreateShareCard={() => {
              setShareCardBook(undefined);
              setShareCardLog(undefined);
              setIsShareCardOpen(true);
            }}
            onOpenShareCardForQuote={(bookTitle, author, quote) => {
              setShareCardLog({
                id: 'log_quote_' + Date.now(),
                bookId: '',
                bookTitle,
                date: new Date().toISOString().split('T')[0],
                pagesRead: 20,
                startPage: 0,
                endPage: 20,
                durationMinutes: 30,
                quote,
                createdAt: new Date().toISOString(),
              });
              setIsShareCardOpen(true);
            }}
          />
        )}

        {activeTab === 'stats' && (
          <StatsView
            user={user}
            goal={goal}
            logs={logs}
            books={books}
            onOpenCoach={() => setIsAiCoachOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E2D9] bg-[#F9F7F2] py-6 text-center text-xs text-[#5A5A40]">
        <p className="font-medium">ReadLog 閱讀日誌 • 紀錄每日進度與極致美型社交分享</p>
      </footer>

      {/* MODALS */}
      <DailyLogModal
        isOpen={isDailyLogOpen}
        onClose={() => setIsDailyLogOpen(false)}
        books={books}
        defaultBookId={defaultLogBookId}
        onSaveLog={handleSaveLog}
        onOpenShareCardForLog={(log) => {
          setShareCardLog(log);
          setShareCardBook(undefined);
          setIsShareCardOpen(true);
        }}
      />

      <ReadingTimerModal
        isOpen={isTimerOpen}
        onClose={() => setIsTimerOpen(false)}
        books={books}
        timerSeconds={timerSeconds}
        isTimerRunning={isTimerRunning}
        onStartTimer={() => setIsTimerRunning(true)}
        onPauseTimer={() => setIsTimerRunning(false)}
        onResetTimer={() => setTimerSeconds(0)}
        onCompleteSession={handleCompleteTimerSession}
      />

      <ShareCardGeneratorModal
        isOpen={isShareCardOpen}
        onClose={() => setIsShareCardOpen(false)}
        user={user}
        initialBook={shareCardBook}
        initialLog={shareCardLog}
        onPostToCommunity={handlePostToCommunity}
      />

      <AiCoachModal
        isOpen={isAiCoachOpen}
        onClose={() => setIsAiCoachOpen(false)}
        user={user}
        books={books}
        onAddRecommendedBook={(title, author) => {
          handleAddBook({
            title,
            author,
            totalPages: 300,
            currentPage: 0,
            category: 'AI推薦好書',
            status: 'want_to_read',
          });
        }}
      />
    </div>
  );
}
