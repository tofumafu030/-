import React, { useState } from 'react';
import { Sparkles, X, BookOpen, Lightbulb, Loader2, Award, ArrowRight } from 'lucide-react';
import { UserProfile, Book } from '../types';

interface AiCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  books: Book[];
  onAddRecommendedBook?: (title: string, author: string) => void;
}

export const AiCoachModal: React.FC<AiCoachModalProps> = ({
  isOpen,
  onClose,
  user,
  books,
  onAddRecommendedBook,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [coachData, setCoachData] = useState<{
    greeting?: string;
    streakFeedback?: string;
    readingEfficiency?: string;
    bookRecommendations?: { title: string; author: string; reason: string }[];
  } | null>(null);

  if (!isOpen) return null;

  const handleFetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const recentBooks = books.slice(0, 4).map((b) => ({ title: b.title, category: b.category }));
      const res = await fetch('/api/gemini/reading-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStreak: user.currentStreak,
          totalPagesRead: user.totalPagesRead,
          completedBooks: books.filter((b) => b.status === 'completed').length,
          totalMinutes: user.totalMinutesRead,
          recentBooks,
        }),
      });
      const data = await res.json();
      if (res.ok && data) {
        setCoachData(data);
      } else {
        alert(data.error || '無法取得 AI 閱讀教練診斷');
      }
    } catch (e: any) {
      alert('連線失敗，請檢查網路');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#E8E2D9] rounded-3xl max-w-xl w-full p-6 space-y-6 relative shadow-lg text-[#2C2C2B] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#E8E2D9] text-[#6E6E60] hover:text-[#2C2C2B]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#E8E2D9] text-[#5A5A40] rounded-2xl border border-[#D6D0C4]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#2C2C2B]">AI 個人閱讀導師與診斷</h2>
            <p className="text-xs text-[#6E6E60]">專屬 AI 導師為你解析閱讀習慣與推薦延伸好書</p>
          </div>
        </div>

        {!coachData ? (
          <div className="bg-[#F9F7F2] p-8 rounded-3xl border border-[#E8E2D9] text-center space-y-4">
            <Sparkles className="w-12 h-12 text-[#5A5A40] mx-auto animate-pulse" />
            <h3 className="font-serif text-base font-bold text-[#2C2C2B]">點擊按鈕，啟動個人化閱讀習慣診斷</h3>
            <p className="text-xs text-[#6E6E60] max-w-sm mx-auto leading-relaxed">
              AI 將會分析你已連續打卡 <span className="text-[#5A5A40] font-bold">{user.currentStreak} 天</span>、共閱讀 <span className="text-[#5A5A40] font-bold">{user.totalPagesRead} 頁</span> 的數據，為你提供客製化閱讀建言。
            </p>

            <button
              onClick={handleFetchAnalysis}
              disabled={isLoading}
              className="px-6 py-3 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AI 導師正在分析你的閱讀習慣...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>生成 AI 閱讀導師報告</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-5 text-xs">
            {/* Greeting */}
            <div className="p-4 bg-[#F9F7F2] rounded-2xl border border-[#E8E2D9] text-[#2C2C2B] leading-relaxed font-medium">
              ✨ {coachData.greeting}
            </div>

            {/* Streak & Efficiency */}
            <div className="space-y-3">
              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E8E2D9] space-y-1">
                <h4 className="font-medium text-[#5A5A40] flex items-center space-x-1">
                  <Award className="w-4 h-4 text-[#5A5A40]" />
                  <span>連續閱讀天數習慣剖析：</span>
                </h4>
                <p className="text-[#2C2C2B] leading-relaxed">{coachData.streakFeedback}</p>
              </div>

              <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E8E2D9] space-y-1">
                <h4 className="font-medium text-[#5A5A40] flex items-center space-x-1">
                  <Lightbulb className="w-4 h-4 text-[#5A5A40]" />
                  <span>閱讀效率與專注力建言：</span>
                </h4>
                <p className="text-[#2C2C2B] leading-relaxed">{coachData.readingEfficiency}</p>
              </div>
            </div>

            {/* Book Recommendations */}
            {coachData.bookRecommendations && coachData.bookRecommendations.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-[#2C2C2B] text-sm flex items-center space-x-1">
                  <BookOpen className="w-4 h-4 text-[#5A5A40]" />
                  <span>AI 為你量身推薦的 3 本好書：</span>
                </h4>

                <div className="space-y-2.5">
                  {coachData.bookRecommendations.map((book, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F9F7F2] p-3.5 rounded-2xl border border-[#E8E2D9] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="font-serif font-bold text-[#2C2C2B] text-sm truncate">《{book.title}》</p>
                        <p className="text-[11px] text-[#6E6E60]">{book.author}</p>
                        <p className="text-[11px] text-[#2C2C2B] pt-1 leading-snug">{book.reason}</p>
                      </div>

                      {onAddRecommendedBook && (
                        <button
                          onClick={() => {
                            onAddRecommendedBook(book.title, book.author);
                            alert(`已將《${book.title}》加入想讀書單！`);
                          }}
                          className="px-3 py-1.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-[11px] shrink-0 shadow-sm"
                        >
                          加到想讀
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleFetchAnalysis}
              disabled={isLoading}
              className="w-full py-2.5 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#2C2C2B] font-medium text-xs text-center"
            >
              重新進行 AI 診斷
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
