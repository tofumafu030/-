import React, { useState, useEffect } from 'react';
import { X, BookOpen, Quote, Sparkles, Share2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Book, ReadingLog } from '../types';

interface DailyLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  defaultBookId?: string;
  onSaveLog: (log: Omit<ReadingLog, 'id' | 'createdAt'>, isBookCompleted?: boolean) => void;
  onOpenShareCardForLog: (log: ReadingLog) => void;
}

export const DailyLogModal: React.FC<DailyLogModalProps> = ({
  isOpen,
  onClose,
  books,
  defaultBookId,
  onSaveLog,
  onOpenShareCardForLog,
}) => {
  const readingBooks = books.filter((b) => b.status === 'reading' || b.status === 'want_to_read');
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [pagesRead, setPagesRead] = useState<number>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [notes, setNotes] = useState<string>('');
  const [quote, setQuote] = useState<string>('');
  const [markAsCompleted, setMarkAsCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (defaultBookId) {
      setSelectedBookId(defaultBookId);
    } else if (readingBooks.length > 0 && !selectedBookId) {
      setSelectedBookId(readingBooks[0].id);
    }
  }, [defaultBookId, books]);

  if (!isOpen) return null;

  const currentBook = books.find((b) => b.id === selectedBookId);
  const startPage = currentBook ? currentBook.currentPage : 0;
  const endPage = startPage + pagesRead;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBook) return;

    const isDone = markAsCompleted || endPage >= currentBook.totalPages;

    if (isDone) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    const newLog: ReadingLog = {
      id: 'log_' + Date.now(),
      bookId: currentBook.id,
      bookTitle: currentBook.title,
      date: new Date().toISOString().split('T')[0],
      pagesRead: pagesRead,
      startPage: startPage,
      endPage: Math.min(currentBook.totalPages, endPage),
      durationMinutes: durationMinutes,
      notes: notes.trim(),
      quote: quote.trim(),
      createdAt: new Date().toISOString(),
    };

    onSaveLog(newLog, isDone);

    // Prompt to open share card
    if (confirm('🎉 閱讀紀錄已成功儲存！是否立即為本次紀錄生成社交分享卡片？')) {
      onOpenShareCardForLog(newLog);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#E8E2D9] rounded-3xl max-w-lg w-full p-6 space-y-5 relative shadow-lg text-[#2C2C2B] animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#E8E2D9] text-[#6E6E60] hover:text-[#2C2C2B]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#E8E2D9] text-[#5A5A40] rounded-2xl border border-[#D6D0C4]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#2C2C2B]">記錄今日閱讀進度</h2>
            <p className="text-xs text-[#6E6E60]">登錄今日閱讀頁數與金句心得</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Select Book */}
          <div>
            <label className="block text-[#2C2C2B] font-medium mb-1">選擇書籍 *</label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] font-medium focus:outline-none focus:border-[#5A5A40]"
            >
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} (目前第 {b.currentPage} / {b.totalPages} 頁)
                </option>
              ))}
            </select>
          </div>

          {/* Reading Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F9F7F2] p-3 rounded-2xl border border-[#E8E2D9] space-y-1">
              <label className="block text-[#6E6E60] text-[11px] font-medium">今日閱讀頁數</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  required
                  min={1}
                  max={currentBook ? currentBook.totalPages - currentBook.currentPage : 1000}
                  value={pagesRead}
                  onChange={(e) => setPagesRead(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-xl bg-white text-[#5A5A40] font-mono font-bold text-base border border-[#E8E2D9] focus:outline-none"
                />
                <span className="text-[#2C2C2B] font-medium">頁</span>
              </div>
              <p className="text-[10px] text-[#6E6E60] pt-1">
                預計從第 <span className="text-[#2C2C2B] font-mono">{startPage}</span> 頁讀至第 <span className="text-[#5A5A40] font-mono">{endPage}</span> 頁
              </p>
            </div>

            <div className="bg-[#F9F7F2] p-3 rounded-2xl border border-[#E8E2D9] space-y-1">
              <label className="block text-[#6E6E60] text-[11px] font-medium">閱讀時長 (分鐘)</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  required
                  min={1}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 rounded-xl bg-white text-[#5A5A40] font-mono font-bold text-base border border-[#E8E2D9] focus:outline-none"
                />
                <span className="text-[#2C2C2B] font-medium">分鐘</span>
              </div>
              <p className="text-[10px] text-[#6E6E60] pt-1">
                平均速度: <span className="text-[#2C2C2B] font-mono">{Math.round((pagesRead / (durationMinutes || 1)) * 60)}</span> 頁/小時
              </p>
            </div>
          </div>

          {/* Highlight Quote */}
          <div>
            <label className="block text-[#2C2C2B] font-medium mb-1 flex items-center space-x-1">
              <Quote className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>劃線佳句摘錄 (選擇性)</span>
            </label>
            <textarea
              rows={2}
              placeholder="今日印象最深刻的名言或段落..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none focus:border-[#5A5A40]"
            />
          </div>

          {/* Notes & Reflection */}
          <div>
            <label className="block text-[#2C2C2B] font-medium mb-1">心得筆記與思考</label>
            <textarea
              rows={2}
              placeholder="寫下你的閱讀靈感、思考或心得..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none focus:border-[#5A5A40]"
            />
          </div>

          {/* Complete Book Checkbox */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="mark-completed"
              checked={markAsCompleted}
              onChange={(e) => setMarkAsCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-[#5A5A40] focus:ring-[#5A5A40] bg-[#F9F7F2] border-[#E8E2D9]"
            />
            <label htmlFor="mark-completed" className="text-[#2C2C2B] font-medium text-xs flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
              <span>今日讀完本書！慶祝完讀里程碑 🎉</span>
            </label>
          </div>

          <div className="pt-3 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#2C2C2B] font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium shadow-sm"
            >
              儲存閱讀日誌
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
