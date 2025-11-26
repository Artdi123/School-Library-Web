"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bookmark, ArrowLeft, Book, Trash2, CheckCircle } from "lucide-react";
import {
  getBookmarks,
  removeBookmark,
  borrowBook,
  getUserBorrows,
  getUnreadNotificationCount,
} from "@/lib/action";
import Navbar from "../components/dashboard/Navbar";
import BookCard from "../components/dashboard/BookCard";
import BorrowModal from "../components/dashboard/BorrowModal";
import SuccessToast from "../components/dashboard/SuccessToast";

export default function BookmarksPage() {
  const { data: session, status } = useSession();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState(false);
  const [userBorrows, setUserBorrows] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

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

  const openBorrowModal = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const closeBorrowModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const confirmBorrow = async () => {
    const userId = user?.id || user?.user_id || user?.sub;
    if (!userId || !selectedBook) return;

    setBorrowing(true);
    const result = await borrowBook(userId, selectedBook.book_id);

    if (result.success) {
      const marks = await getBookmarks(userId);
      setBookmarks(marks);
      const borrows = await getUserBorrows(userId);
      setUserBorrows(borrows);

      setShowModal(false);
      setSelectedBook(null);
      setBorrowSuccess(true);
      setTimeout(() => setBorrowSuccess(false), 3000);
    }

    setBorrowing(false);
  };

  const hasActiveBorrow = (bookId) => {
    return userBorrows.some(
      (borrow) =>
        borrow.book_id === bookId &&
        (borrow.status === "pending" || borrow.status === "progress")
    );
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

      {/* Navbar */}
      <Navbar user={user} unreadCount={unreadCount} />

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
                {bookmarks.map((book) => (
                  <div key={book.book_id} className="relative">
                    {/* Remove Bookmark Button */}
                    <button
                      onClick={() => handleRemoveBookmark(book.book_id)}
                      disabled={removing === book.book_id}
                      className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-red-50 text-red-500 p-2 rounded-lg shadow-md transition-colors disabled:opacity-50"
                      title="Remove from bookmarks"
                    >
                      {removing === book.book_id ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>

                    {/* Book Card */}
                    <BookCard
                      book={book}
                      onBorrow={openBorrowModal}
                      isPending={false}
                      isBorrowed={hasActiveBorrow(book.book_id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SuccessToast
        show={borrowSuccess}
        message="Book borrowed successfully!"
        submessage="Check your borrow history"
      />

      {/* Borrow Modal */}
      {showModal && (
        <BorrowModal
          book={selectedBook}
          onClose={closeBorrowModal}
          onConfirm={confirmBorrow}
          borrowing={borrowing}
        />
      )}
    </div>
  );
}
