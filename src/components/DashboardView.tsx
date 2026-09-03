import React from 'react';
import {
  Flame,
  Clock,
  BookOpen,
  Share2,
  Plus,
  Timer,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Quote,
  Calendar
} from 'lucide-react';
import { Book, ReadingLog, UserProfile } from '../types';

interface DashboardViewProps {
  user: UserProfile;
  books: Book[];
  logs: ReadingLog[];
  onOpenDailyLogForBook: (bookId: string) => void;
  onQuickAddPages: (bookId: string, addedPages: number) => void;
  onOpenTimer: () => void;
  onOpenShareCardForLog: (log: ReadingLog) => void;
  onOpenShareCardForBook: (book: Book) => void;
  onNavigateToLibrary: () => void;
  onNavigateToCommunity: () => void;
  onOpenCoach: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  books,
  logs,
  onOpenDailyLogForBook,
  onQuickAddPages,
  onOpenTimer,
  onOpenShareCardForLog,
  onOpenShareCardForBook,
  onNavigateToLibrary,
  onNavigateToCommunity,
  onOpenCoach,
}) => {
  const readingBooks = books.filter((b) => b.status === 'reading');
  const completedBooksCount = books.filter((b) => b.status === 'completed').length;

  // Past 7 days streak tracking calculation
  const getPast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('zh-TW', { weekday: 'short' });
      const dayNum = d.getDate();
      const hasLog = logs.some((l) => l.date === dateStr);
      days.push({ dateStr, dayName, dayNum, hasLog, isToday: i === 0 });
    }
    return days;
  };

  const past7Days = getPast7Days();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Greeting Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-8 border border-[#E8E2D9] shadow-sm">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-[#E8E2D9]/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 rounded-full bg-[#5A5A40]/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8E2D9] border border-[#D6D0C4] text-[#5A5A40] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>今日閱讀靈感</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2C2B] tracking-tight">
              你好，{user.name} 👋
            </h1>
            <p className="text-[#2C2C2B]/80 text-sm sm:text-base max-w-2xl leading-relaxed">
              「閱讀不是為了逃避現實，而是為了更深沉地理解世界。」你已連續打卡 <span className="text-[#5A5A40] font-bold">{user.currentStreak} 天</span>，今天打算讀幾頁書呢？
            </p>

            {/* Streak Calendar Dots */}
            <div className="pt-2">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-[#5A5A40]" />
                <span className="text-xs text-[#5A5A40] font-medium">近 7 天閱讀紀錄打卡：</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                {past7Days.map((day) => (
                  <div key={day.dateStr} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        day.hasLog
                          ? 'bg-[#5A5A40] text-white shadow-sm'
                          : day.isToday
                          ? 'bg-[#E8E2D9] text-[#5A5A40] border-2 border-dashed border-[#5A5A40]'
                          : 'bg-[#E8E2D9]/60 text-[#6E6E60]'
                      }`}
                    >
                      {day.hasLog ? <CheckCircle2 className="w-4 h-4" /> : day.dayNum}
                    </div>
                    <span className="text-[10px] text-[#6E6E60] mt-1">{day.dayName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-col gap-3 min-w-[200px]">
            <div className="bg-[#F9F7F2] p-3.5 rounded-2xl border border-[#E8E2D9] flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40]">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#6E6E60]">連續紀錄</p>
                <p className="text-lg font-bold text-[#2C2C2B] font-serif">{user.currentStreak} 天</p>
              </div>
            </div>

            <div className="bg-[#F9F7F2] p-3.5 rounded-2xl border border-[#E8E2D9] flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#6E6E60]">總累積閱讀</p>
                <p className="text-lg font-bold text-[#2C2C2B] font-serif">{user.totalPagesRead} 頁</p>
              </div>
            </div>

            <div className="bg-[#F9F7F2] p-3.5 rounded-2xl border border-[#E8E2D9] flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#6E6E60]">總閱讀時間</p>
                <p className="text-lg font-bold text-[#2C2C2B] font-serif">{Math.round(user.totalMinutesRead / 60)} 小時</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Timer Hero Prompt */}
      <div className="bg-[#E8E2D9] rounded-2xl p-5 border border-[#D6D0C4] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-[#5A5A40] text-white rounded-2xl">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#2C2C2B]">開啟沉浸式閱讀計時器</h3>
            <p className="text-xs text-[#5A5A40]">支援情境白噪音（雨聲、圖書館音效），幫助你無干擾閱讀並自動紀錄時間。</p>
          </div>
        </div>
        <button
          id="btn-start-focus-timer"
          onClick={onOpenTimer}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2 shrink-0"
        >
          <Timer className="w-4 h-4" />
          <span>開始閱讀</span>
        </button>
      </div>

      {/* Currently Reading Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-6 bg-[#5A5A40] rounded-full" />
            <h2 className="font-serif text-2xl font-bold text-[#2C2C2B]">正在閱讀中 ({readingBooks.length})</h2>
          </div>
          <button
            onClick={onNavigateToLibrary}
            className="text-xs text-[#5A5A40] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>管理全部書單</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {readingBooks.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-[#E8E2D9] space-y-3">
            <BookOpen className="w-10 h-10 text-[#5A5A40]/60 mx-auto" />
            <p className="text-[#6E6E60] text-sm">目前沒有閱讀中的書籍，快去書單新增一本吧！</p>
            <button
              onClick={onNavigateToLibrary}
              className="px-5 py-2.5 rounded-full bg-[#5A5A40] text-white font-medium text-xs shadow-sm"
            >
              挑選書籍開始閱讀
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {readingBooks.map((book) => {
              const progressPct = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
              return (
                <div
                  key={book.id}
                  className="bg-white rounded-3xl p-5 border border-[#E8E2D9] shadow-sm hover:border-[#D6D0C4] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex space-x-4">
                    {/* Book Cover */}
                    <div className="relative shrink-0 w-20 h-28 rounded-xl overflow-hidden shadow-sm bg-[#E8E2D9]">
                      {book.coverUrl ? (
                        <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#D6D0C4] p-2 flex items-center justify-center text-center text-[#2C2C2B] font-serif font-bold text-xs italic">
                          {book.title}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E8E2D9] text-[#5A5A40] border border-[#D6D0C4]">
                          {book.category}
                        </span>
                        <button
                          onClick={() => onOpenShareCardForBook(book)}
                          className="p-1.5 rounded-full bg-[#F9F7F2] hover:bg-[#E8E2D9] text-[#5A5A40] transition-colors"
                          title="製作精美分享卡片"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-serif text-lg font-bold text-[#2C2C2B] truncate" title={book.title}>
                        {book.title}
                      </h3>
                      <p className="text-xs text-[#6E6E60] truncate">{book.author}</p>

                      {/* Progress bar */}
                      <div className="pt-2 space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-[#2C2C2B]/80">進度：{book.currentPage} / {book.totalPages} 頁</span>
                          <span className="text-[#5A5A40] font-bold">{progressPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-[#E8E2D9] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#5A5A40] rounded-full transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D9] gap-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] text-[#6E6E60] hidden sm:inline">快速打卡：</span>
                      <button
                        onClick={() => onQuickAddPages(book.id, 5)}
                        className="px-3 py-1 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#2C2C2B] text-xs font-medium transition-colors"
                      >
                        +5頁
                      </button>
                      <button
                        onClick={() => onQuickAddPages(book.id, 10)}
                        className="px-3 py-1 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#2C2C2B] text-xs font-medium transition-colors"
                      >
                        +10頁
                      </button>
                    </div>

                    <button
                      onClick={() => onOpenDailyLogForBook(book.id)}
                      className="px-4 py-1.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-xs flex items-center space-x-1 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>記錄進度</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Logs & Quotes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-6 bg-[#5A5A40] rounded-full" />
            <h2 className="font-serif text-2xl font-bold text-[#2C2C2B]">最近閱讀日記與佳句</h2>
          </div>
          <button
            onClick={onNavigateToCommunity}
            className="text-xs text-[#5A5A40] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>社群動態牆</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {logs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-3xl p-5 border border-[#E8E2D9] space-y-3 relative group shadow-sm hover:border-[#D6D0C4] transition-all"
            >
              <div className="flex items-center justify-between text-xs text-[#6E6E60]">
                <span className="font-serif font-bold text-[#2C2C2B]">{log.bookTitle}</span>
                <span>{log.date}</span>
              </div>

              <div className="flex items-center space-x-3 text-xs text-[#2C2C2B]">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8E2D9] text-[#5A5A40] font-medium">
                  閱讀 {log.pagesRead} 頁 (第 {log.startPage}~{log.endPage} 頁)
                </span>
                {log.durationMinutes > 0 && (
                  <span className="text-[#6E6E60]">⏱️ {log.durationMinutes} 分鐘</span>
                )}
              </div>

              {log.quote && (
                <div className="bg-[#F9F7F2] p-3 rounded-2xl border-l-4 border-[#5A5A40] text-xs text-[#2C2C2B] italic flex items-start space-x-2 font-serif">
                  <Quote className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                  <p>「{log.quote}」</p>
                </div>
              )}

              {log.notes && (
                <p className="text-xs text-[#2C2C2B]/80 leading-relaxed line-clamp-2">
                  {log.notes}
                </p>
              )}

              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={() => onOpenShareCardForLog(log)}
                  className="px-3.5 py-1.5 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#5A5A40] text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>生成社交卡片</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
