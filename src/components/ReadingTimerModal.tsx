import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, BookOpen, Check, Sparkles } from 'lucide-react';
import { ambientSound } from '../utils/audio';
import { Book } from '../types';

interface ReadingTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  timerSeconds: number;
  isTimerRunning: boolean;
  onStartTimer: () => void;
  onPauseTimer: () => void;
  onResetTimer: () => void;
  onCompleteSession: (bookId: string, durationMinutes: number, pagesRead: number) => void;
}

export const ReadingTimerModal: React.FC<ReadingTimerModalProps> = ({
  isOpen,
  onClose,
  books,
  timerSeconds,
  isTimerRunning,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onCompleteSession,
}) => {
  const [selectedBookId, setSelectedBookId] = useState<string>(books[0]?.id || '');
  const [pagesReadInput, setPagesReadInput] = useState<number>(15);
  const [ambientType, setAmbientType] = useState<'none' | 'rain' | 'library' | 'waves' | 'brown-noise'>('none');

  useEffect(() => {
    if (books.length > 0 && !selectedBookId) {
      setSelectedBookId(books[0].id);
    }
  }, [books]);

  if (!isOpen) return null;

  const handleToggleAmbient = (type: 'rain' | 'library' | 'waves' | 'brown-noise') => {
    if (ambientType === type) {
      ambientSound.stop();
      setAmbientType('none');
    } else {
      ambientSound.play(type);
      setAmbientType(type);
    }
  };

  const handleCloseModal = () => {
    ambientSound.stop();
    setAmbientType('none');
    onClose();
  };

  const formatDisplay = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    const elapsedMins = Math.max(1, Math.round(timerSeconds / 60));
    onCompleteSession(selectedBookId, elapsedMins, pagesReadInput);
    ambientSound.stop();
    setAmbientType('none');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#E8E2D9] rounded-3xl max-w-md w-full p-6 space-y-6 relative shadow-lg text-[#2C2C2B]">
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#E8E2D9] text-[#6E6E60] hover:text-[#2C2C2B]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <span className="inline-flex items-center space-x-1 text-xs font-medium px-3 py-1 rounded-full bg-[#E8E2D9] text-[#5A5A40] border border-[#D6D0C4]">
            <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
            <span>沉浸式專注閱讀空間</span>
          </span>
          <h2 className="font-serif text-xl font-bold text-[#2C2C2B]">閱讀時間統計</h2>
        </div>

        {/* Selected Book Selector */}
        <div>
          <label className="block text-xs font-medium text-[#6E6E60] mb-1">正在閱讀的書籍：</label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] text-xs font-medium focus:outline-none focus:border-[#5A5A40]"
          >
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} (目前第 {b.currentPage} 頁)
              </option>
            ))}
          </select>
        </div>

        {/* Main Timer Display */}
        <div className="flex flex-col items-center justify-center py-6 bg-[#F9F7F2] rounded-3xl border border-[#E8E2D9] space-y-2">
          <div className="font-mono text-5xl sm:text-6xl font-bold tracking-widest text-[#5A5A40]">
            {formatDisplay(timerSeconds)}
          </div>
          <p className="text-xs text-[#6E6E60] font-medium">
            {isTimerRunning ? '⚡ 正在專注閱讀中...' : '已暫停'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={onResetTimer}
            className="p-3 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#2C2C2B] transition-all active:scale-95"
            title="歸零"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {isTimerRunning ? (
            <button
              onClick={onPauseTimer}
              className="px-8 py-3.5 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#5A5A40] font-medium text-base shadow-sm transition-all transform active:scale-95 flex items-center space-x-2 border border-[#D6D0C4]"
            >
              <Pause className="w-5 h-5 fill-[#5A5A40]" />
              <span>暫停閱讀</span>
            </button>
          ) : (
            <button
              onClick={onStartTimer}
              className="px-8 py-3.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-base shadow-sm transition-all transform active:scale-95 flex items-center space-x-2"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>開始專注</span>
            </button>
          )}
        </div>

        {/* Ambient Sounds Generator */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-[#6E6E60]">專注白噪音 (音效由 Web Audio 原生合成)：</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleToggleAmbient('rain')}
              className={`p-2.5 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${
                ambientType === 'rain'
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                  : 'bg-[#F9F7F2] text-[#2C2C2B] border-[#E8E2D9] hover:bg-[#E8E2D9]'
              }`}
            >
              <span>🌧️ 窗外雨聲</span>
            </button>

            <button
              onClick={() => handleToggleAmbient('library')}
              className={`p-2.5 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${
                ambientType === 'library'
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                  : 'bg-[#F9F7F2] text-[#2C2C2B] border-[#E8E2D9] hover:bg-[#E8E2D9]'
              }`}
            >
              <span>📚 圖書館溫暖環境</span>
            </button>

            <button
              onClick={() => handleToggleAmbient('waves')}
              className={`p-2.5 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${
                ambientType === 'waves'
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                  : 'bg-[#F9F7F2] text-[#2C2C2B] border-[#E8E2D9] hover:bg-[#E8E2D9]'
              }`}
            >
              <span>🌊 海浪韻律</span>
            </button>

            <button
              onClick={() => handleToggleAmbient('brown-noise')}
              className={`p-2.5 rounded-2xl border flex items-center justify-center space-x-2 transition-all ${
                ambientType === 'brown-noise'
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                  : 'bg-[#F9F7F2] text-[#2C2C2B] border-[#E8E2D9] hover:bg-[#E8E2D9]'
              }`}
            >
              <span>🎧 棕色深度專注噪聲</span>
            </button>
          </div>
        </div>

        {/* Complete Session Action */}
        <div className="pt-4 border-t border-[#E8E2D9] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label className="text-[#2C2C2B] font-medium">結束本次閱讀並估算閱讀頁數：</label>
            <input
              type="number"
              value={pagesReadInput}
              onChange={(e) => setPagesReadInput(Number(e.target.value))}
              min={1}
              className="w-20 px-2.5 py-1 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#5A5A40] font-bold text-center"
            />
          </div>

          <button
            onClick={handleFinish}
            disabled={timerSeconds === 0}
            className="w-full py-3 rounded-full bg-[#5A5A40] hover:bg-[#484832] disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>完成並歸檔今日紀錄</span>
          </button>
        </div>
      </div>
    </div>
  );
};
