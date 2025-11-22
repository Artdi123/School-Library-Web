"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  User,
  Book,
  Search,
  Edit,
  Library,
  Star,
  TrendingUp,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Bookmark,
  Bell,
} from "lucide-react";
import {
  getBooks,
  getUserBorrows,
  borrowBook,
  getUnreadNotificationCount,
} from "@/lib/action";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowSuccess, setShowSuccess] = useState(false);

  const user = session?.user;

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    async function loadData() {
      startTransition(async () => {
        const allBooks = await getBooks();
        setBooks(allBooks);

        const userId = user?.id || user?.user_id || user?.sub;
        if (userId) {
          const userBorrows = await getUserBorrows(userId);
          setBorrows(userBorrows);
          const count = await getUnreadNotificationCount(userId);
          setUnreadCount(count);
        }
      });
    }

    if (status === "authenticated") {
      loadData();
    }
  }, [status, user?.id, user?.user_id, user?.sub]);

  function openBorrowModal(book) {
    setSelectedBook(book);
    setShowModal(true);
  }

  function closeBorrowModal() {
    setShowModal(false);
    setSelectedBook(null);
  }

  async function confirmBorrow() {
    const userId = user?.id || user?.user_id || user?.sub;
    if (!userId || !selectedBook) return;

    setBorrowing(true);

    const result = await borrowBook(userId, selectedBook.book_id);

    if (result.success) {
      const allBooks = await getBooks();
      setBooks(allBooks);

      const userBorrows = await getUserBorrows(userId);
      setBorrows(userBorrows);

      const count = await getUnreadNotificationCount(userId);
      setUnreadCount(count);

      setShowModal(false);
      setSelectedBook(null);
      setShowSuccess(true);

      setTimeout(() => setShowSuccess(false), 3000);
    }

    setBorrowing(false);
  }

  const filteredBooks = books.filter(
    (book) =>
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.author &&
        book.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeBorrows = borrows.filter((b) => b.status !== "closed");
  const completedBorrows = borrows.filter((b) => b.status === "closed");

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
      progress: { bg: "bg-blue-100", text: "text-blue-800", icon: BookOpen },
      closed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle },
    };
    return styles[status] || styles.pending;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white">
      {borrowSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Book borrowed successfully!</p>
              <p className="text-sm text-green-100">
                Check your borrows section
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-linear-to-r from-indigo-600 to-blue-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Library className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Taruna Library
                </h1>
                <p className="text-indigo-100 text-sm">
                  Your gateway to knowledge
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <Link
                href="/home"
                className="text-white font-medium hover:text-indigo-100 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/bookmarks"
                className="text-white font-medium hover:text-indigo-100 transition-colors"
              >
                Bookmarks
              </Link>
              <Link
                href="/notifications"
                className="text-white font-medium hover:text-indigo-100 transition-colors relative"
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="text-white font-medium hover:text-indigo-100 transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-indigo-600 to-blue-600 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {user?.image ? (
                  <Image
                    key={user.image}
                    src={user.image}
                    alt={user.name || "User"}
                    width={72}
                    height={72}
                    className="rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-18 h-18 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white shadow-lg">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Welcome back, {user?.name || "User"}!
                  </h2>
                  <p className="text-indigo-100 mt-1">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/bookmarks"
                  className="text-white hover:text-indigo-100 transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <Bookmark className="w-6 h-6" />
                </Link>
                <Link
                  href="/notifications"
                  className="text-white hover:text-indigo-100 transition-colors relative p-2 hover:bg-white/10 rounded-lg"
                >
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Active Borrows
                </p>
                <p className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {activeBorrows.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {completedBorrows.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Available Books
                </p>
                <p className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {books.filter((b) => (b.stock ?? 0) > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Books */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
                  <Book className="w-6 h-6" />
                  Browse Available Books
                </h3>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-600 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title or author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-white/30 text-indigo-600 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
              </div>

              <div className="p-6">
                {isPending && books.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading books...</p>
                  </div>
                ) : filteredBooks.length === 0 ? (
                  <div className="text-center py-16">
                    <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      {searchQuery
                        ? "No books found matching your search."
                        : "No books available at the moment."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredBooks.map((book) => {
                      const isOutOfStock = (book.stock ?? 0) <= 0;
                      return (
                        <div
                          key={book.book_id}
                          className={`bg-linear-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 transition-all duration-300 ${
                            !isOutOfStock
                              ? "hover:shadow-lg hover:scale-105"
                              : "opacity-75"
                          }`}
                        >
                          <div className="flex gap-4">
                            <Link
                              href={`/book/${book.book_id}`}
                              className="shrink-0"
                            >
                              {book.image ? (
                                <Image
                                  src={book.image}
                                  alt={book.name}
                                  width={80}
                                  height={110}
                                  className="rounded-lg shadow-md object-cover h-28 w-20 hover:opacity-80 transition-opacity cursor-pointer"
                                />
                              ) : (
                                <div className="w-20 h-28 bg-linear-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center shadow-md hover:opacity-80 transition-opacity cursor-pointer">
                                  <Book className="w-10 h-10 text-indigo-400" />
                                </div>
                              )}
                            </Link>
                            <div className="flex-1 flex flex-col">
                              <Link href={`/book/${book.book_id}`}>
                                <h4 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer">
                                  {book.name}
                                </h4>
                              </Link>
                              <p className="text-sm text-gray-600 mb-1">
                                {book.author || "Unknown Author"}
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                {book.publisher || "Unknown Publisher"} •{" "}
                                {book.year_published || "N/A"}
                              </p>
                              <div className="flex items-center justify-between mt-auto gap-2">
                                <span
                                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                    isOutOfStock
                                      ? "bg-red-50 text-red-600"
                                      : "bg-indigo-50 text-indigo-600"
                                  }`}
                                >
                                  Stock: {book.stock ?? 0}
                                </span>
                                <div className="flex gap-2">
                                  <Link
                                    href={`/book/${book.book_id}`}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-all text-sm"
                                  >
                                    View
                                  </Link>
                                  <button
                                    onClick={() => openBorrowModal(book)}
                                    disabled={isPending || isOutOfStock}
                                    className="bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                  >
                                    {isOutOfStock ? "No Stock" : "Borrow"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* My Borrows */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden sticky top-4">
              <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  My Borrows
                </h3>
                <p className="text-indigo-100 text-sm mt-1">
                  Track your reading journey
                </p>
              </div>
              <div className="p-6 max-h-[600px] overflow-y-auto">
                {borrows.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No borrows yet.</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Start your reading journey!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {borrows.map((borrow) => {
                      const statusInfo = getStatusBadge(borrow.status);
                      const StatusIcon = statusInfo.icon;
                      const isOverdue =
                        borrow.due_date &&
                        borrow.status !== "closed" &&
                        new Date() > new Date(borrow.due_date);

                      return (
                        <div
                          key={borrow.borrow_id}
                          className={`bg-linear-to-br from-gray-50 to-white rounded-xl p-4 border ${
                            isOverdue
                              ? "border-red-200 bg-red-50"
                              : "border-gray-200"
                          } hover:shadow-md transition-all`}
                        >
                          <h4 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1">
                            {borrow.book_name}
                          </h4>
                          <div className="space-y-1 text-xs text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Borrowed:</span>
                              <span>{formatDate(borrow.borrow_date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Due:</span>
                              <span
                                className={
                                  isOverdue ? "text-red-600 font-semibold" : ""
                                }
                              >
                                {formatDate(borrow.due_date)}
                              </span>
                              {isOverdue && (
                                <AlertCircle className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                            {borrow.return_date && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Returned:</span>
                                <span>{formatDate(borrow.return_date)}</span>
                              </div>
                            )}
                            {borrow.fine > 0 && (
                              <div className="flex items-center gap-2 text-red-600 font-medium">
                                <span>Fine:</span>
                                <span>Rp {borrow.fine.toLocaleString()}</span>
                              </div>
                            )}
                          </div>
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {borrow.status.charAt(0).toUpperCase() +
                              borrow.status.slice(1)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-6 relative">
              <button
                onClick={closeBorrowModal}
                disabled={borrowing}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Confirm Borrow
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    Please review your selection
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-4 mb-6">
                {selectedBook.image ? (
                  <Image
                    src={selectedBook.image}
                    alt={selectedBook.name}
                    width={80}
                    height={110}
                    className="rounded-lg shadow-md object-cover"
                  />
                ) : (
                  <div className="w-20 h-28 bg-linear-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center shadow-md shrink-0">
                    <Book className="w-10 h-10 text-indigo-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">
                    {selectedBook.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {selectedBook.author || "Unknown Author"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedBook.publisher || "Unknown Publisher"} •{" "}
                    {selectedBook.year_published || "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  Are you sure you want to borrow{" "}
                  <span className="font-semibold">{selectedBook.name}</span>?
                  This book will be added to your active borrows with a{" "}
                  <span className="font-semibold text-yellow-700">pending</span>{" "}
                  status. Due date will be 14 days from approval.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeBorrowModal}
                  disabled={borrowing}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBorrow}
                  disabled={borrowing}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {borrowing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Borrowing...</span>
                    </>
                  ) : (
                    "Confirm Borrow"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
