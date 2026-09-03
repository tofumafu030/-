import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Copy,
  Share2,
  Sparkles,
  Check,
  Palette,
  Layout,
  Quote,
  BookOpen,
  Loader2,
  QrCode
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { Book, ReadingLog, CardTheme, UserProfile } from '../types';

interface ShareCardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  initialBook?: Book;
  initialLog?: ReadingLog;
  onPostToCommunity: (postContent: {
    bookTitle: string;
    author: string;
    content: string;
    quoteText?: string;
    cardTheme: CardTheme;
  }) => void;
}

export const ShareCardGeneratorModal: React.FC<ShareCardGeneratorModalProps> = ({
  isOpen,
  onClose,
  user,
  initialBook,
  initialLog,
  onPostToCommunity,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<CardTheme>('sunset-vibe');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '9:16' | '4:3'>('1:1');
  const [bookTitle, setBookTitle] = useState(initialLog?.bookTitle || initialBook?.title || '原子習慣');
  const [author, setAuthor] = useState(initialBook?.author || '詹姆斯・克利爾');
  const [quoteText, setQuoteText] = useState(initialLog?.quote || initialBook?.favoriteQuotes?.[0] || '你不會提升到你目標的水平，你會下降到你系統的水平。');
  const [reflectionText, setReflectionText] = useState(initialLog?.notes || '今天讀到關於建立系統的重要性，每日進步1%累積的複利效應真的很震撼。');
  const [pagesRead, setPagesRead] = useState<number>(initialLog?.pagesRead || 25);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{ insight?: string; socialCaption?: string } | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  // AI Auto-enhance caption & quote insight
  const handleAiEnhance = async () => {
    if (!quoteText.trim()) {
      alert('請先輸入或選擇一句金句！');
      return;
    }
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/quote-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: quoteText, bookTitle, author }),
      });
      const data = await res.json();
      if (res.ok && data) {
        setAiResult(data);
        if (data.insight) setReflectionText(data.insight);
        if (data.recommendedTheme) setTheme(data.recommendedTheme as CardTheme);
      } else {
        alert(data.error || 'AI 無法生成佳句解析');
      }
    } catch (e: any) {
      alert('AI 連線異常，請稍後再試');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Export card as PNG using html-to-image
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `ReadLog_${bookTitle}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card image', err);
      alert('圖片匯出失敗，請再試一次。');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy social caption text
  const handleCopyCaption = () => {
    const caption = aiResult?.socialCaption
      ? aiResult.socialCaption
      : `📖 每日閱讀分享｜《${bookTitle}》\n\n「${quoteText}」\n\n💡 閱讀思考：\n${reflectionText}\n\n#閱讀筆記 #佳句分享 #ReadLog #${bookTitle.replace(/\s+/g, '')}`;

    navigator.clipboard.writeText(caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  // Post to internal community feed
  const handlePublishToFeed = () => {
    onPostToCommunity({
      bookTitle,
      author,
      content: reflectionText || '今日閱讀進度打卡！',
      quoteText,
      cardTheme: theme,
    });
    alert('🎉 已成功發布至閱讀社群動態牆！');
    onClose();
  };

  // Theme styling configurations for the visual share card
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark-luxury':
        return 'bg-slate-950 text-slate-100 border-amber-500/30 shadow-2xl';
      case 'minimal-paper':
        return 'bg-[#fbf9f5] text-slate-900 border-stone-300 shadow-xl';
      case 'pastel-warm':
        return 'bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 text-slate-900 border-orange-200 shadow-xl';
      case 'emerald-zen':
        return 'bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-emerald-100 border-emerald-500/30 shadow-2xl';
      case 'vintage-typewriter':
        return 'bg-[#f4efe6] text-stone-900 border-stone-400 font-serif shadow-xl';
      case 'sunset-vibe':
      default:
        return 'bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-white border-indigo-500/30 shadow-2xl';
    }
  };

  const getAspectClasses = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-w-[320px]';
      case '4:3':
        return 'aspect-[4/3] max-w-[420px]';
      case '1:1':
      default:
        return 'aspect-square max-w-[380px]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E8E2D9] rounded-3xl max-w-4xl w-full my-8 p-6 space-y-6 relative shadow-lg text-[#2C2C2B]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#E8E2D9] text-[#6E6E60] hover:text-[#2C2C2B]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#E8E2D9] text-[#5A5A40] rounded-2xl border border-[#D6D0C4]">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#2C2C2B]">美型閱讀社交分享卡片生成器</h2>
            <p className="text-xs text-[#6E6E60]">一鍵產生風格視覺卡片與社群高互動文案</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: Live Visual Card Canvas */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <span className="text-xs text-[#6E6E60] font-medium flex items-center space-x-1">
              <Layout className="w-3.5 h-3.5 text-[#5A5A40]" />
              <span>卡片即時預覽 (將匯出此區塊圖卡)</span>
            </span>

            {/* THE CARD TO EXPORT */}
            <div
              ref={cardRef}
              className={`w-full ${getAspectClasses()} ${getThemeClasses()} rounded-3xl p-6 flex flex-col justify-between border relative overflow-hidden transition-all duration-300 mx-auto select-none`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 opacity-80" />
                  <span className="text-xs font-bold tracking-wider opacity-90 uppercase">
                    ReadLog • 每日閱讀
                  </span>
                </div>
                <span className="text-[10px] opacity-70 font-mono">
                  {new Date().toLocaleDateString('zh-TW')}
                </span>
              </div>

              {/* Quote Body */}
              <div className="my-auto space-y-4 py-3">
                <div className="relative">
                  <Quote className="w-8 h-8 opacity-20 absolute -top-3 -left-2" />
                  <p className="text-base sm:text-lg font-bold leading-snug relative z-10 px-2 italic">
                    「{quoteText}」
                  </p>
                </div>

                {reflectionText && (
                  <div className="p-3 rounded-2xl bg-current/5 border border-current/10 text-xs leading-relaxed opacity-90">
                    <p className="font-semibold mb-1 opacity-80">💡 閱讀思考：</p>
                    <p className="line-clamp-3">{reflectionText}</p>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-current/10 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold">{bookTitle}</p>
                  <p className="text-[10px] opacity-75">{author}</p>
                </div>

                <div className="flex items-center space-x-2 text-right">
                  <div>
                    <p className="text-[10px] opacity-80">{user.name}</p>
                    <p className="text-[9px] opacity-60">@ReadLog</p>
                  </div>
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-current/20">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions for Download & Share */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 w-full">
              <button
                onClick={handleDownloadImage}
                disabled={isExporting}
                className="flex-1 py-2.5 px-4 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-sm"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>下載高清圖卡 (PNG)</span>
              </button>

              <button
                onClick={handlePublishToFeed}
                className="py-2.5 px-4 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#2C2C2B] font-medium text-xs flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>發布至閱讀社群</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Customization Controls */}
          <div className="space-y-5 text-xs text-[#2C2C2B]">
            {/* Theme Picker */}
            <div className="space-y-2">
              <label className="font-medium text-[#2C2C2B] flex items-center space-x-1.5">
                <Palette className="w-4 h-4 text-[#5A5A40]" />
                <span>選擇卡片視覺風格</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sunset-vibe', name: '🌇 日落靛藍' },
                  { id: 'dark-luxury', name: '🖤 黑金奢華' },
                  { id: 'minimal-paper', name: '📄 經典米紙' },
                  { id: 'pastel-warm', name: '蜜桃暖陽' },
                  { id: 'emerald-zen', name: '🌲 森林極簡' },
                  { id: 'vintage-typewriter', name: '📜 復古打字機' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as CardTheme)}
                    className={`p-2 rounded-2xl text-[11px] font-medium border transition-all ${
                      theme === t.id
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                        : 'bg-[#F9F7F2] text-[#2C2C2B] border-[#E8E2D9] hover:bg-[#E8E2D9]'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Picker */}
            <div className="space-y-2">
              <label className="font-medium text-[#2C2C2B]">卡片比例 (適合不同社群平台)：</label>
              <div className="flex space-x-2">
                {[
                  { id: '1:1', name: '1:1 方形 (IG/FB 貼文)' },
                  { id: '9:16', name: '9:16 直式 (IG 限動)' },
                  { id: '4:3', name: '4:3 橫式' },
                ].map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id as any)}
                    className={`flex-1 py-2 rounded-full text-xs font-medium border transition-all ${
                      aspectRatio === ar.id
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                        : 'bg-[#F9F7F2] text-[#2C2C2B] border-[#E8E2D9] hover:bg-[#E8E2D9]'
                    }`}
                  >
                    {ar.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Form Fields */}
            <div className="space-y-3 pt-2 border-t border-[#E8E2D9]">
              <div>
                <label className="block font-medium text-[#2C2C2B] mb-1">精選佳句：</label>
                <textarea
                  rows={2}
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#2C2C2B] mb-1">個人心得與思考：</label>
                <textarea
                  rows={2}
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none focus:border-[#5A5A40]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#2C2C2B] mb-1">書名：</label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2C2C2B] mb-1">作者：</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none focus:border-[#5A5A40]"
                  />
                </div>
              </div>
            </div>

            {/* AI Auto Enhance & Social Caption Generator */}
            <div className="p-3.5 bg-[#F9F7F2] rounded-2xl border border-[#E8E2D9] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#2C2C2B] flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                  <span>AI 智慧文案發想與金句解析</span>
                </span>
                <button
                  onClick={handleAiEnhance}
                  disabled={isAiGenerating}
                  className="px-3 py-1.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-xs flex items-center space-x-1 disabled:opacity-50"
                >
                  {isAiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>AI 潤飾</span>
                </button>
              </div>

              {aiResult?.socialCaption && (
                <div className="space-y-2 pt-2 border-t border-[#E8E2D9]">
                  <p className="text-[11px] text-[#6E6E60] font-medium">生成適合發布的社群文案：</p>
                  <p className="text-xs text-[#2C2C2B] whitespace-pre-wrap bg-white p-2.5 rounded-2xl border border-[#E8E2D9] max-h-24 overflow-y-auto">
                    {aiResult.socialCaption}
                  </p>
                </div>
              )}

              <button
                onClick={handleCopyCaption}
                className="w-full py-2 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#2C2C2B] font-medium text-xs flex items-center justify-center space-x-1.5"
              >
                {copiedCaption ? <Check className="w-4 h-4 text-[#5A5A40]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCaption ? '文案已複製到剪貼簿！' : '複製社群貼文文案 (含 Hashtags)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
