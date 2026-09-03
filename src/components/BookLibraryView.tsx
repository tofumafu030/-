import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Bookmark,
  Star,
  Sparkles,
  Share2,
  Trash2,
  Edit3,
  X,
  Loader2,
  Quote
} from 'lucide-react';
import { Book, ReadingStatus } from '../types';

interface BookLibraryViewProps {
  books: Book[];
  onAddBook: (newBook: Omit<Book, 'id'>) => void;
  onUpdateBook: (updatedBook: Book) => void;
  onDeleteBook: (bookId: string) => void;
  onOpenShareCardForBook: (book: Book) => void;
  onOpenDailyLogForBook: (bookId: string) => void;
}

export const BookLibraryView: React.FC<BookLibraryViewProps> = ({
  books,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onOpenShareCardForBook,
  onOpenDailyLogForBook,
}) => {
  const [filterStatus, setFilterStatus] = useState<ReadingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for adding book
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTotalPages, setNewTotalPages] = useState<number>(300);
  const [newCategory, setNewCategory] = useState('自我成長');
  const [newStatus, setNewStatus] = useState<ReadingStatus>('reading');
  const [newNotes, setNewNotes] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Editing state for book detail modal
  const [editCurrentPage, setEditCurrentPage] = useState<number>(0);
  const [editRating, setEditRating] = useState<number>(5);
  const [newQuoteInput, setNewQuoteInput] = useState('');

  const filteredBooks = books.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAiAutoFill = async () => {
    if (!newTitle.trim()) {
      alert('請先輸入書名再試用 AI 自動填寫！');
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/book-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookTitle: newTitle, author: newAuthor }),
      });
      const data = await res.json();
      if (res.ok && data) {
        if (data.author) setNewAuthor(data.author);
        if (data.category) setNewCategory(data.category);
        if (data.estimatedTotalPages) setNewTotalPages(data.estimatedTotalPages);
        if (data.summary) setNewNotes(data.summary);
      } else {
        alert(data.error || 'AI 無法取得該書資料，請手動填寫。');
      }
    } catch (e: any) {
      alert('AI 生成過程發生錯誤，請稍後再試。');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddBook({
      title: newTitle.trim(),
      author: newAuthor.trim() || '未知作者',
      totalPages: newTotalPages || 300,
      currentPage: newStatus === 'completed' ? newTotalPages : 0,
      category: newCategory || '未分類',
      status: newStatus,
      startDate: new Date().toISOString().split('T')[0],
      notes: newNotes,
      colorGradient: 'from-amber-600 to-orange-700',
    });

    // Reset & Close
    setNewTitle('');
    setNewAuthor('');
    setNewTotalPages(300);
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleAddQuoteToSelectedBook = () => {
    if (!selectedBook || !newQuoteInput.trim()) return;
    const updatedQuotes = [...(selectedBook.favoriteQuotes || []), newQuoteInput.trim()];
    const updated = { ...selectedBook, favoriteQuotes: updatedQuotes };
    onUpdateBook(updated);
    setSelectedBook(updated);
    setNewQuoteInput('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#2C2C2B]">我的圖書庫 ({books.length})</h1>
          <p className="text-[#6E6E60] text-xs sm:text-sm">管理所有閱讀狀態、摘錄名言佳句與備註筆記</p>
        </div>

        <button
          id="btn-open-add-book"
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium text-sm shadow-sm flex items-center justify-center space-x-2 transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>新增書籍</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#6E6E60] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="搜尋書名、作者或分類..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#E8E2D9] text-[#2C2C2B] text-sm focus:outline-none focus:border-[#5A5A40]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === 'all'
                ? 'bg-[#5A5A40] text-white'
                : 'bg-[#E8E2D9] text-[#2C2C2B] hover:bg-[#D6D0C4] border border-[#D6D0C4]'
            }`}
          >
            全部 ({books.length})
          </button>
          <button
            onClick={() => setFilterStatus('reading')}
            className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === 'reading'
                ? 'bg-[#5A5A40] text-white'
                : 'bg-[#E8E2D9] text-[#2C2C2B] hover:bg-[#D6D0C4] border border-[#D6D0C4]'
            }`}
          >
            閱讀中 ({books.filter((b) => b.status === 'reading').length})
          </button>
          <button
            onClick={() => setFilterStatus('want_to_read')}
            className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === 'want_to_read'
                ? 'bg-[#5A5A40] text-white'
                : 'bg-[#E8E2D9] text-[#2C2C2B] hover:bg-[#D6D0C4] border border-[#D6D0C4]'
            }`}
          >
            想讀 ({books.filter((b) => b.status === 'want_to_read').length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filterStatus === 'completed'
                ? 'bg-[#5A5A40] text-white'
                : 'bg-[#E8E2D9] text-[#2C2C2B] hover:bg-[#D6D0C4] border border-[#D6D0C4]'
            }`}
          >
            已完讀 ({books.filter((b) => b.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => {
          const pct = Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
          return (
            <div
              key={book.id}
              onClick={() => {
                setSelectedBook(book);
                setEditCurrentPage(book.currentPage);
                setEditRating(book.rating || 5);
              }}
              className="bg-white hover:bg-[#F9F7F2]/80 rounded-3xl p-5 border border-[#E8E2D9] transition-all cursor-pointer group shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="flex space-x-3.5">
                <div className="w-20 h-28 rounded-xl overflow-hidden shrink-0 shadow-sm bg-[#E8E2D9]">
                  {book.coverUrl ? (
                    <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#D6D0C4] p-2 flex items-center justify-center text-center text-[#2C2C2B] font-serif italic text-xs font-bold">
                      {book.title}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-[#E8E2D9] text-[#5A5A40] border border-[#D6D0C4]">
                    {book.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#2C2C2B] truncate group-hover:text-[#5A5A40] transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[#6E6E60] truncate">{book.author}</p>

                  <div className="pt-2 text-xs text-[#6E6E60]">
                    {book.status === 'completed' ? (
                      <span className="inline-flex items-center space-x-1 text-[#5A5A40] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>已於 {book.finishDate || '近日'} 完讀</span>
                      </span>
                    ) : book.status === 'want_to_read' ? (
                      <span className="text-[#5A5A40] font-medium">欲讀書籍</span>
                    ) : (
                      <span>進度: {book.currentPage} / {book.totalPages} 頁 ({pct}%)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              {book.status === 'reading' && (
                <div className="w-full h-1.5 bg-[#E8E2D9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#5A5A40] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D9] text-xs text-[#6E6E60]">
                <span>{book.favoriteQuotes?.length || 0} 個佳句</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenShareCardForBook(book);
                    }}
                    className="p-1.5 rounded-full hover:bg-[#E8E2D9] text-[#5A5A40] transition-colors"
                    title="分享卡片"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBook(book);
                      setEditCurrentPage(book.currentPage);
                      setEditRating(book.rating || 5);
                    }}
                    className="p-1.5 rounded-full hover:bg-[#E8E2D9] text-[#2C2C2B] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E2D9] rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative shadow-lg text-[#2C2C2B]">
            <button
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#E8E2D9] text-[#6E6E60] hover:text-[#2C2C2B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex space-x-4">
              <div className="w-24 h-36 rounded-xl overflow-hidden shrink-0 shadow-sm bg-[#E8E2D9]">
                {selectedBook.coverUrl ? (
                  <img src={selectedBook.coverUrl} alt={selectedBook.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#D6D0C4] p-2 flex items-center justify-center text-center text-[#2C2C2B] font-serif italic text-xs font-bold">
                    {selectedBook.title}
                  </div>
                )}
              </div>

              <div className="space-y-2 flex-1">
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#E8E2D9] text-[#5A5A40] font-medium border border-[#D6D0C4]">
                  {selectedBook.category}
                </span>
                <h2 className="font-serif text-xl font-bold text-[#2C2C2B]">{selectedBook.title}</h2>
                <p className="text-sm text-[#6E6E60]">{selectedBook.author}</p>

                <div className="pt-2 flex items-center space-x-2">
                  <select
                    value={selectedBook.status}
                    onChange={(e) => {
                      const newSt = e.target.value as ReadingStatus;
                      const updated = {
                        ...selectedBook,
                        status: newSt,
                        finishDate: newSt === 'completed' ? new Date().toISOString().split('T')[0] : selectedBook.finishDate,
                        currentPage: newSt === 'completed' ? selectedBook.totalPages : selectedBook.currentPage,
                      };
                      onUpdateBook(updated);
                      setSelectedBook(updated);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#E8E2D9] border border-[#D6D0C4] text-xs text-[#5A5A40] font-medium focus:outline-none"
                  >
                    <option value="reading">📖 閱讀中</option>
                    <option value="want_to_read">📌 想讀</option>
                    <option value="completed">🎉 已完讀</option>
                    <option value="paused">⏸️ 暫停</option>
                  </select>

                  <button
                    onClick={() => {
                      onOpenShareCardForBook(selectedBook);
                      setSelectedBook(null);
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#5A5A40] text-white font-medium text-xs flex items-center space-x-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>做分享卡片</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Progress Update Form */}
            <div className="bg-[#F9F7F2] p-4 rounded-2xl border border-[#E8E2D9] space-y-3">
              <h3 className="font-serif text-sm font-bold text-[#2C2C2B]">更新閱讀進度</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={editCurrentPage}
                  onChange={(e) => setEditCurrentPage(Number(e.target.value))}
                  min={0}
                  max={selectedBook.totalPages}
                  className="w-28 px-3 py-2 rounded-xl bg-white border border-[#E8E2D9] text-[#2C2C2B] font-mono text-sm focus:outline-none focus:border-[#5A5A40]"
                />
                <span className="text-xs text-[#6E6E60]">/ {selectedBook.totalPages} 頁</span>

                <button
                  onClick={() => {
                    const isDone = editCurrentPage >= selectedBook.totalPages;
                    const updated = {
                      ...selectedBook,
                      currentPage: editCurrentPage,
                      status: isDone ? 'completed' : selectedBook.status,
                      finishDate: isDone ? new Date().toISOString().split('T')[0] : selectedBook.finishDate,
                    };
                    onUpdateBook(updated);
                    setSelectedBook(updated);
                    alert('已更新進度！');
                  }}
                  className="px-4 py-2 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white text-xs font-medium"
                >
                  儲存頁數
                </button>
              </div>
            </div>

            {/* Quotes list & Add quote */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-bold text-[#2C2C2B]">本書摘錄佳句 ({selectedBook.favoriteQuotes?.length || 0})</h3>
              {selectedBook.favoriteQuotes?.map((q, idx) => (
                <div key={idx} className="p-3 bg-[#F9F7F2] rounded-2xl border-l-4 border-[#5A5A40] text-xs text-[#2C2C2B] italic flex items-start space-x-2 font-serif">
                  <Quote className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">「{q}」</p>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="新增喜歡的名言佳句..."
                  value={newQuoteInput}
                  onChange={(e) => setNewQuoteInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-xs text-[#2C2C2B] focus:outline-none focus:border-[#5A5A40]"
                />
                <button
                  onClick={handleAddQuoteToSelectedBook}
                  className="px-4 py-2 rounded-full bg-[#5A5A40] text-white font-medium text-xs"
                >
                  新增金句
                </button>
              </div>
            </div>

            {/* Book Notes */}
            {selectedBook.notes && (
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-[#6E6E60]">簡介與心得：</h3>
                <p className="text-xs text-[#2C2C2B]/80 leading-relaxed bg-[#F9F7F2] p-3 rounded-2xl border border-[#E8E2D9]">
                  {selectedBook.notes}
                </p>
              </div>
            )}

            {/* Delete Book Action */}
            <div className="pt-4 border-t border-[#E8E2D9] flex justify-between items-center">
              <button
                onClick={() => {
                  if (confirm(`確定要刪除《${selectedBook.title}》嗎？`)) {
                    onDeleteBook(selectedBook.id);
                    setSelectedBook(null);
                  }
                }}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>刪除此書</span>
              </button>

              <button
                onClick={() => setSelectedBook(null)}
                className="px-4 py-2 rounded-full bg-[#E8E2D9] text-[#2C2C2B] text-xs font-medium hover:bg-[#D6D0C4]"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E2D9] rounded-3xl max-w-md w-full p-6 space-y-5 relative shadow-lg text-[#2C2C2B]">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#E8E2D9] text-[#6E6E60]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-serif text-xl font-bold text-[#2C2C2B]">新增書籍到書單</h2>
              <p className="text-xs text-[#6E6E60]">輸入書名，可使用 AI 自動填寫作者、分類與簡介</p>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#2C2C2B] font-medium mb-1">書名 *</label>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="例如：原子習慣、沙丘..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none focus:border-[#5A5A40]"
                  />
                  <button
                    type="button"
                    onClick={handleAiAutoFill}
                    disabled={isAiLoading}
                    className="px-3.5 py-2.5 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#5A5A40] font-medium flex items-center space-x-1 disabled:opacity-50 border border-[#D6D0C4]"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>AI 填寫</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2C2C2B] font-medium mb-1">作者</label>
                  <input
                    type="text"
                    placeholder="例如：詹姆斯・克利爾"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#2C2C2B] font-medium mb-1">總頁數</label>
                  <input
                    type="number"
                    value={newTotalPages}
                    onChange={(e) => setNewTotalPages(Number(e.target.value))}
                    min={1}
                    className="w-full px-3.5 py-2.5 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#2C2C2B] font-medium mb-1">圖書分類</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none"
                  >
                    <option value="自我成長">自我成長</option>
                    <option value="心理勵志">心理勵志</option>
                    <option value="文學小說">文學小說</option>
                    <option value="科幻小說">科幻小說</option>
                    <option value="商管財經">商管財經</option>
                    <option value="人文歷史">人文歷史</option>
                    <option value="藝術設計">藝術設計</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#2C2C2B] font-medium mb-1">閱讀狀態</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ReadingStatus)}
                    className="w-full px-3.5 py-2.5 rounded-full bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none"
                  >
                    <option value="reading">📖 閱讀中</option>
                    <option value="want_to_read">📌 想讀</option>
                    <option value="completed">🎉 已完讀</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#2C2C2B] font-medium mb-1">簡介或備註</label>
                <textarea
                  rows={3}
                  placeholder="寫下書籍簡介或初讀期待..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#F9F7F2] border border-[#E8E2D9] text-[#2C2C2B] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#E8E2D9] hover:bg-[#D6D0C4] text-[#2C2C2B] font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#484832] text-white font-medium"
                >
                  加入書單
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
