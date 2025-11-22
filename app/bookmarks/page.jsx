"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  Bookmark,
  Library,
  ArrowLeft,
  Book,
  Trash2,
  BookOpen,
  Calendar,
  Bell,
  CheckCircle,
} from "lucide-react";
import {
  getBookmarks,
  removeBookmark,
  borrowBook,
  getBooks,
  getUserBorrows,
  getUnreadNotificationCount,
} from "@/lib/action";

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [borrowing, setBorrowing] = useState(null);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [userBorrows, setUserBorrows] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = session?.user;

  useEffect(() => {
    async function loadBookmarks() {
      const userId = user?.id || user?.user_id || user?.sub;
      if (userId) {
        const marks = await getBookmarks(userId);
        setBookmarks(marks);
        const borrows = await getUserBorrows(userId);
        setUserBorrows(borrows);
        const count = await getUnreadNotificationCount(userId);
        setUnreadCount(count);
      }
      setLoading(false);
    }

    if (status === "authenticated") {
      loadBookmarks();
    }
  }, [status, user?.id, user?.user_id, user?.sub]);

  const handleRemoveBookmark = async (bookId) => {
    const userId = user?.id || user?.user_id || user?.sub;
    if (!userId) return;

    setRemoving(bookId);
    await removeBookmark(userId, bookId);
    setBookmarks(bookmarks.filter((b) => b.book_id !== bookId));
    setRemoving(null);
  };

  const handleBorrow = async (bookId) => {
    const userId = user?.id || user?.user_id || user?.sub;
    if (!userId) return;

    setBorrowing(bookId);
    const result = await borrowBook(userId, bookId);

    if (result.success) {
      const marks = await getBookmarks(userId);
      setBookmarks(marks);
      const borrows = await getUserBorrows(userId);
      setUserBorrows(borrows);
      setBorrowSuccess(true);
      setTimeout(() => setBorrowSuccess(false), 3000);
    }

    setBorrowing(null);
  };

  const hasActiveBorrow = (bookId) => {
    return userBorrows.some(
      (borrow) =>
        borrow.book_id === bookId &&
        (borrow.status === "pending" || borrow.status === "progress")
    );
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading bookmarks...</p>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">My Bookmarks</h2>
                <p className="text-indigo-100 text-sm">
                  {bookmarks.length} book{bookmarks.length !== 1 ? "s" : ""}{" "}
                  saved
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {bookmarks.length === 0 ? (
              <div className="text-center py-16">
                <Bookmark className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start saving books you are interested in!
                </p>
                <Link
                  href="/home"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                >
                  <Book className="w-5 h-5" />
                  Browse Books
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((book) => {
                  const isOutOfStock = (book.stock ?? 0) <= 0;
                  const isBorrowed = hasActiveBorrow(book.book_id);

                  return (
                    <div
                      key={book.book_id}
                      className="bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative">
                        <Link href={`/book/${book.book_id}`}>
                          {book.image ? (
                            <Image
                              src={book.image}
                              alt={book.name}
                              width={400}
                              height={200}
                              className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                            />
                          ) : (
                            <div className="w-full h-48 bg-linear-to-br from-indigo-100 to-blue-100 flex items-center justify-center hover:opacity-90 transition-opacity">
                              <Book className="w-16 h-16 text-indigo-400" />
                            </div>
                          )}
                        </Link>
                        <button
                          onClick={() => handleRemoveBookmark(book.book_id)}
                          disabled={removing === book.book_id}
                          className="absolute top-3 right-3 bg-white/90 hover:bg-red-50 text-red-500 p-2 rounded-lg shadow-md transition-colors disabled:opacity-50"
                        >
                          {removing === book.book_id ? (
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </button>
                        <div className="absolute bottom-3 left-3">
                          <span
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-md ${
                              isOutOfStock
                                ? "bg-red-500 text-white"
                                : "bg-green-500 text-white"
                            }`}
                          >
                            {isOutOfStock
                              ? "Out of Stock"
                              : `${book.stock} Available`}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <Link href={`/book/${book.book_id}`}>
                          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-2 hover:text-indigo-600 transition-colors">
                            {book.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-600 mb-1">
                          {book.author || "Unknown Author"}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          {book.publisher || "Unknown Publisher"} •{" "}
                          {book.year_published || "N/A"}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Bookmarked on {formatDate(book.bookmarked_at)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/book/${book.book_id}`}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium transition-colors text-center text-sm"
                          >
                            View Details
                          </Link>
                          {isBorrowed ? (
                            <div className="flex-1 bg-blue-100 text-blue-700 py-2.5 rounded-lg font-medium text-center text-sm flex items-center justify-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              Borrowed
                            </div>
                          ) : (
                            <button
                              onClick={() => handleBorrow(book.book_id)}
                              disabled={
                                isOutOfStock || borrowing === book.book_id
                              }
                              className="flex-1 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-1"
                            >
                              {borrowing === book.book_id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>...</span>
                                </>
                              ) : isOutOfStock ? (
                                "No Stock"
                              ) : (
                                "Borrow"
                              )}
                            </button>
                          )}
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
    </div>
  );
}
