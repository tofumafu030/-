import React from 'react';
import { BookOpen, Flame, Plus, Sparkles, BarChart3, Users, Home, Timer } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'dashboard' | 'library' | 'community' | 'stats';
  setActiveTab: (tab: 'dashboard' | 'library' | 'community' | 'stats') => void;
  user: UserProfile;
  onOpenDailyLog: () => void;
  onOpenTimer: () => void;
  onOpenCoach: () => void;
  isTimerRunning: boolean;
  timerSeconds: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenDailyLog,
  onOpenTimer,
  onOpenCoach,
  isTimerRunning,
  timerSeconds,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#E8E2D9] text-[#2C2C2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2 bg-[#5A5A40] rounded-xl shadow-sm text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex items-center">
              <span className="font-serif font-bold text-xl tracking-tight text-[#5A5A40]">
                ReadLog 閱讀日誌
              </span>
              <span className="hidden xl:inline-block ml-2.5 text-xs px-2.5 py-0.5 rounded-full bg-[#E8E2D9] text-[#5A5A40] font-medium border border-[#D6D0C4]">
                每日閱讀與社交卡片
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#E8E2D9]/80 p-1 rounded-full border border-[#D6D0C4] shadow-xs">
            <button
              id="nav-btn-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-[#5A5A40] text-white font-semibold shadow-sm'
                  : 'text-[#505042] hover:text-[#2C2C2B] hover:bg-[#DDD7CC]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>今日總覽</span>
            </button>

            <button
              id="nav-btn-library"
              onClick={() => setActiveTab('library')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === 'library'
                  ? 'bg-[#5A5A40] text-white font-semibold shadow-sm'
                  : 'text-[#505042] hover:text-[#2C2C2B] hover:bg-[#DDD7CC]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>我的書單</span>
            </button>

            <button
              id="nav-btn-community"
              onClick={() => setActiveTab('community')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === 'community'
                  ? 'bg-[#5A5A40] text-white font-semibold shadow-sm'
                  : 'text-[#505042] hover:text-[#2C2C2B] hover:bg-[#DDD7CC]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>閱讀社群</span>
            </button>

            <button
              id="nav-btn-stats"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === 'stats'
                  ? 'bg-[#5A5A40] text-white font-semibold shadow-sm'
                  : 'text-[#505042] hover:text-[#2C2C2B] hover:bg-[#DDD7CC]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>閱讀統計</span>
            </button>
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Active Reading Timer pill */}
            <button
              id="nav-timer-pill"
              onClick={onOpenTimer}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                isTimerRunning
                  ? 'bg-[#5A5A40]/15 text-[#5A5A40] border border-[#5A5A40] animate-pulse'
                  : 'bg-[#E8E2D9] hover:bg-[#E2DDD3] text-[#2C2C2B] border border-[#D6D0C4]'
              }`}
            >
              <Timer className={`w-4 h-4 ${isTimerRunning ? 'text-[#5A5A40]' : 'text-[#6E6E60]'}`} />
              <span className="font-mono">{isTimerRunning ? formatTime(timerSeconds) : '專注計時'}</span>
            </button>

            {/* Streak Badge */}
            <div
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#E8E2D9] border border-[#D6D0C4] text-[#5A5A40] text-xs sm:text-sm font-semibold"
              title={`連續閱讀 ${user.currentStreak} 天！最長紀錄 ${user.longestStreak} 天`}
            >
              <Flame className="w-4 h-4 text-[#5A5A40] fill-[#5A5A40]" />
              <span>{user.currentStreak} 天</span>
            </div>

            {/* AI Reading Coach Trigger */}
            <button
              id="nav-btn-ai-coach"
              onClick={onOpenCoach}
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#E8E2D9]/80 hover:bg-[#E8E2D9] border border-[#5A5A40]/30 text-[#5A5A40] text-xs sm:text-sm font-medium transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#5A5A40]" />
              <span>AI 閱讀導師</span>
            </button>

            {/* Log Button */}
            <button
              id="nav-btn-quick-log"
              onClick={onOpenDailyLog}
              className="flex items-center space-x-1 px-4 py-2 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-xs sm:text-sm shadow-sm transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>記錄進度</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between gap-1 py-1.5 border-t border-[#E8E2D9]">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'bg-[#5A5A40] text-white font-medium shadow-xs' : 'text-[#6E6E60] hover:text-[#2C2C2B]'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] whitespace-nowrap">今日總覽</span>
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'library' ? 'bg-[#5A5A40] text-white font-medium shadow-xs' : 'text-[#6E6E60] hover:text-[#2C2C2B]'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] whitespace-nowrap">我的書單</span>
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'community' ? 'bg-[#5A5A40] text-white font-medium shadow-xs' : 'text-[#6E6E60] hover:text-[#2C2C2B]'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] whitespace-nowrap">閱讀社群</span>
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
              activeTab === 'stats' ? 'bg-[#5A5A40] text-white font-medium shadow-xs' : 'text-[#6E6E60] hover:text-[#2C2C2B]'
            }`}
          >
            <BarChart3 className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] whitespace-nowrap">閱讀統計</span>
          </button>
          <button
            onClick={onOpenCoach}
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[#5A5A40] hover:bg-[#E8E2D9] transition-all"
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] whitespace-nowrap">AI導師</span>
          </button>
        </div>
      </div>
    </header>
  );
};
