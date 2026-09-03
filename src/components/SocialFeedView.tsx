import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Quote,
  Sparkles,
  Send,
  Plus,
  Users,
  Check,
  TrendingUp
} from 'lucide-react';
import { SocialPost, UserProfile, CardTheme } from '../types';

interface SocialFeedViewProps {
  posts: SocialPost[];
  user: UserProfile;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onOpenCreateShareCard: () => void;
  onOpenShareCardForQuote: (bookTitle: string, author: string, quote: string) => void;
}

export const SocialFeedView: React.FC<SocialFeedViewProps> = ({
  posts,
  user,
  onToggleLike,
  onAddComment,
  onOpenCreateShareCard,
  onOpenShareCardForQuote,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'quotes'>('feed');
  const [filterType, setFilterType] = useState<'all' | 'quote' | 'milestone' | 'progress'>('all');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPosts = posts.filter((p) => {
    if (filterType === 'all') return true;
    return p.postType === filterType;
  });

  // Collect all quotes from all posts
  const allQuotes = posts.filter((p) => p.quoteText);

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner & Subtabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2C2C2B]">閱讀社群與佳句庫</h1>
          <p className="text-[#6E6E60] text-xs sm:text-sm">與書友分享閱讀里程碑、探索靈感與收藏精選金句</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenCreateShareCard}
            className="px-5 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-xs sm:text-sm shadow-sm flex items-center space-x-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>發布分享卡片</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#E8E2D9] pb-2">
        <button
          onClick={() => setActiveSubTab('feed')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center space-x-2 ${
            activeSubTab === 'feed'
              ? 'bg-[#5A5A40] text-white shadow-sm'
              : 'text-[#2C2C2B] hover:bg-[#E8E2D9]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>閱讀動態牆</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quotes')}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center space-x-2 ${
            activeSubTab === 'quotes'
              ? 'bg-[#5A5A40] text-white shadow-sm'
              : 'text-[#2C2C2B] hover:bg-[#E8E2D9]'
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>靈感佳句庫 ({allQuotes.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: COMMUNITY FEED */}
      {activeSubTab === 'feed' && (
        <div className="space-y-6">
          {/* Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-[#5A5A40] text-white'
                  : 'bg-[#E8E2D9] text-[#2C2C2B] border border-[#D6D0C4] hover:bg-[#D6D0C4]'
              }`}
            >
              全部動態
            </button>
            <button
              onClick={() => setFilterType('quote')}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap ${
                filterType === 'quote'
                  ? 'bg-[#5A5A40] text-white'
                  : 'bg-[#E8E2D9] text-[#2C2C2B] border border-[#D6D0C4] hover:bg-[#D6D0C4]'
              }`}
            >
              💬 金句分享
            </button>
            <button
              onClick={() => setFilterType('milestone')}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap ${
                filterType === 'milestone'
                  ? 'bg-[#5A5A40] text-white'
                  : 'bg-[#E8E2D9] text-[#2C2C2B] border border-[#D6D0C4] hover:bg-[#D6D0C4]'
              }`}
            >
              🎉 完讀里程碑
            </button>
            <button
              onClick={() => setFilterType('progress')}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap ${
                filterType === 'progress'
                  ? 'bg-[#5A5A40] text-white'
                  : 'bg-[#E8E2D9] text-[#2C2C2B] border border-[#D6D0C4] hover:bg-[#D6D0C4]'
              }`}
            >
              📖 進度打卡
            </button>
          </div>

          {/* Posts List */}
          <div className="space-y-6 max-w-2xl mx-auto">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-3xl p-6 border border-[#E8E2D9] shadow-sm space-y-4 hover:border-[#D6D0C4] transition-all"
              >
                {/* User Info Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.userAvatar}
                      alt={post.userName}
                      className="w-10 h-10 rounded-full object-cover border border-[#E8E2D9]"
                    />
                    <div>
                      <h3 className="font-serif text-sm font-bold text-[#2C2C2B]">{post.userName}</h3>
                      <p className="text-[11px] text-[#6E6E60]">{post.timestamp} • 正在讀 《{post.bookTitle}》</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#E8E2D9] text-[#5A5A40] border border-[#D6D0C4]">
                    {post.postType === 'milestone' ? '🎉 完讀里程碑' : post.postType === 'quote' ? '💬 金句摘錄' : '📖 打卡'}
                  </span>
                </div>

                {/* Content Body */}
                <p className="text-sm text-[#2C2C2B] leading-relaxed whitespace-pre-wrap">{post.content}</p>

                {/* Highlight Quote Card if exists */}
                {post.quoteText && (
                  <div className="bg-[#F9F7F2] p-4 rounded-2xl border-l-4 border-[#5A5A40] text-xs text-[#2C2C2B] space-y-2 relative font-serif">
                    <Quote className="w-5 h-5 text-[#5A5A40] opacity-60" />
                    <p className="font-bold text-sm italic leading-snug">「{post.quoteText}」</p>
                    <p className="text-[11px] text-[#5A5A40] text-right">——《{post.bookTitle}》{post.author}</p>
                  </div>
                )}

                {/* Footer Interaction Bar */}
                <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-xs text-[#6E6E60]">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => onToggleLike(post.id)}
                      className={`flex items-center space-x-1.5 font-medium transition-colors ${
                        post.hasLiked ? 'text-rose-600' : 'hover:text-rose-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{post.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                      className="flex items-center space-x-1.5 hover:text-[#5A5A40] transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments?.length || 0} 留言</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    {post.quoteText && (
                      <button
                        onClick={() => onOpenShareCardForQuote(post.bookTitle, post.author, post.quoteText!)}
                        className="px-3 py-1 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#5A5A40] text-[11px] font-medium flex items-center space-x-1 border border-[#D6D0C4]"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>做成分享卡</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleCopyText(
                          post.id,
                          `《${post.bookTitle}》${post.quoteText ? `「${post.quoteText}」` : post.content}`
                        )
                      }
                      className="p-1.5 rounded-full hover:bg-[#E8E2D9] text-[#6E6E60] hover:text-[#2C2C2B]"
                      title="複製文字"
                    >
                      {copiedId === post.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Comments Section */}
                {activeCommentPostId === post.id && (
                  <div className="pt-3 space-y-3 border-t border-[#E8E2D9]">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {post.comments?.map((c) => (
                        <div key={c.id} className="bg-[#F9F7F2] p-2.5 rounded-2xl text-xs space-y-1">
                          <div className="flex justify-between items-center text-[10px] text-[#6E6E60]">
                            <span className="font-bold text-[#2C2C2B]">{c.userName}</span>
                            <span>{c.timestamp}</span>
                          </div>
                          <p className="text-[#2C2C2B]">{c.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="寫下鼓勵或共鳴留言..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                        className="flex-1 px-3.5 py-1.5 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-xs text-[#2C2C2B] focus:outline-none focus:border-[#5A5A40]"
                      />
                      <button
                        onClick={() => handleSendComment(post.id)}
                        className="p-2 rounded-full bg-[#5A5A40] text-white font-bold"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: SAVED QUOTES LIBRARY */}
      {activeSubTab === 'quotes' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {allQuotes.map((q) => (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-5 border border-[#E8E2D9] space-y-4 hover:border-[#D6D0C4] transition-all flex flex-col justify-between shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#5A5A40] font-medium font-serif">
                    <span>《{q.bookTitle}》</span>
                    <span className="text-[10px] text-[#6E6E60]">{q.author}</span>
                  </div>

                  <p className="text-sm font-bold text-[#2C2C2B] italic leading-relaxed font-serif">
                    「{q.quoteText}」
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E2D9] flex items-center justify-between text-xs">
                  <span className="text-[#6E6E60] text-[11px]">來自 @{q.userName}</span>
                  <button
                    onClick={() => onOpenShareCardForQuote(q.bookTitle, q.author, q.quoteText!)}
                    className="px-3.5 py-1.5 rounded-full bg-[#5A5A40] text-white font-medium text-xs flex items-center space-x-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>做成卡片</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
