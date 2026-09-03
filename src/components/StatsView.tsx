import React from 'react';
import { Target, BookOpen, Clock, Flame, Award, TrendingUp, BarChart, Calendar, ChevronRight } from 'lucide-react';
import { ReadingGoal, ReadingLog, UserProfile, Book } from '../types';

interface StatsViewProps {
  user: UserProfile;
  goal: ReadingGoal;
  logs: ReadingLog[];
  books: Book[];
  onOpenCoach: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ user, goal, logs, books, onOpenCoach }) => {
  const completedBooks = books.filter((b) => b.status === 'completed');
  const bookProgressPct = Math.min(100, Math.round((completedBooks.length / goal.targetBooks) * 100));
  const pageProgressPct = Math.min(100, Math.round((user.totalPagesRead / goal.targetPages) * 100));

  // Calculate pages read by month (simulated for last 6 months)
  const monthlyStats = [
    { month: '2月', pages: 280 },
    { month: '3月', pages: 350 },
    { month: '4月', pages: 420 },
    { month: '5月', pages: 310 },
    { month: '6月', pages: 490 },
    { month: '7月', pages: 500 },
  ];

  const maxPages = Math.max(...monthlyStats.map((m) => m.pages));

  return (
    <div className="space-y-8 pb-12 animate-fadeIn text-[#2C2C2B]">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-[#2C2C2B]">個人閱讀統計與目標</h1>
        <p className="text-[#6E6E60] text-xs sm:text-sm">數據化呈現你的閱讀成長與累積歷程</p>
      </div>

      {/* Annual Targets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Books Goal Progress */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#E8E2D9] text-[#5A5A40] rounded-2xl border border-[#D6D0C4]">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C2C2B]">{goal.year} 年度閱讀挑戰</h3>
                <p className="text-xs text-[#6E6E60]">目標完讀 {goal.targetBooks} 本書</p>
              </div>
            </div>
            <span className="font-serif text-2xl font-extrabold text-[#5A5A40]">{bookProgressPct}%</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#6E6E60] font-medium">
              <span>已完讀 {completedBooks.length} 本</span>
              <span>還差 {Math.max(0, goal.targetBooks - completedBooks.length)} 本達成目標</span>
            </div>
            <div className="w-full h-3 bg-[#E8E2D9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5A5A40] rounded-full transition-all duration-700"
                style={{ width: `${bookProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pages Goal Progress */}
        <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-[#E8E2D9] text-[#5A5A40] rounded-2xl border border-[#D6D0C4]">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#2C2C2B]">年度總頁數目標</h3>
                <p className="text-xs text-[#6E6E60]">目標累積 {goal.targetPages} 頁</p>
              </div>
            </div>
            <span className="font-serif text-2xl font-extrabold text-[#5A5A40]">{pageProgressPct}%</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-[#6E6E60] font-medium">
              <span>已閱讀 {user.totalPagesRead} 頁</span>
              <span>還差 {Math.max(0, goal.targetPages - user.totalPagesRead)} 頁</span>
            </div>
            <div className="w-full h-3 bg-[#E8E2D9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5A5A40] rounded-full transition-all duration-700"
                style={{ width: `${pageProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Reading Chart */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart className="w-5 h-5 text-[#5A5A40]" />
            <h2 className="font-serif text-lg font-bold text-[#2C2C2B]">近半年每月閱讀頁數趨勢</h2>
          </div>
          <span className="text-xs text-[#6E6E60] font-medium">總計 2,350 頁</span>
        </div>

        {/* Bar Chart Graphics */}
        <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#E8E2D9]">
          {monthlyStats.map((item, idx) => {
            const heightPct = Math.round((item.pages / maxPages) * 100);
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono text-[#5A5A40] opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.pages}頁
                </span>
                <div className="w-full bg-[#F9F7F2] rounded-t-xl h-full flex items-end overflow-hidden">
                  <div
                    className="w-full bg-[#5A5A40] rounded-t-xl transition-all duration-500 group-hover:bg-[#484832]"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-xs text-[#6E6E60] font-medium">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges & Milestones */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8E2D9] space-y-4 shadow-sm">
        <h2 className="font-serif text-lg font-bold text-[#2C2C2B] flex items-center space-x-2">
          <Award className="w-5 h-5 text-[#5A5A40]" />
          <span>成就徽章與成就紀錄</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E8E2D9] text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#E8E2D9] text-[#5A5A40] flex items-center justify-center font-bold text-lg">
              🔥
            </div>
            <p className="font-serif text-xs font-bold text-[#2C2C2B]">連續10天打卡</p>
            <p className="text-[10px] text-[#6E6E60]">維持優良閱讀習慣</p>
          </div>

          <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E8E2D9] text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#E8E2D9] text-[#5A5A40] flex items-center justify-center font-bold text-lg">
              📚
            </div>
            <p className="font-serif text-xs font-bold text-[#2C2C2B]">完讀5本書籍</p>
            <p className="text-[10px] text-[#6E6E60]">知識積累第一步</p>
          </div>

          <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E8E2D9] text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#E8E2D9] text-[#5A5A40] flex items-center justify-center font-bold text-lg">
              ⏱️
            </div>
            <p className="font-serif text-xs font-bold text-[#2C2C2B]">專注20小時</p>
            <p className="text-[10px] text-[#6E6E60]">心流深度閱讀</p>
          </div>

          <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E8E2D9] text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#E8E2D9] text-[#5A5A40] flex items-center justify-center font-bold text-lg">
              💬
            </div>
            <p className="font-serif text-xs font-bold text-[#2C2C2B]">金句收藏家</p>
            <p className="text-[10px] text-[#6E6E60]">摘錄超過10句經典</p>
          </div>
        </div>
      </div>
    </div>
  );
};
