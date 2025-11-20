"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  User,
  Book,
  Library,
  ArrowLeft,
  Calendar,
  Building2,
  Package,
  CheckCircle,
  AlertCircle,
  Clock,
  ShoppingCart,
  BookUp,
} from "lucide-react";
import { getBookById, borrowBook, getUserBorrows } from "@/lib/action";

export default function BookDetail({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowSuccess, setShowSuccess] = useState(false);
  const [userBorrows, setUserBorrows] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const user = session?.user;
  const { id: bookId } = use(params);

  useEffect(() => {
    async function loadBook() {
      try {
        const bookData = await getBookById(bookId);
        setBook(bookData);

        if (user?.id || user?.user_id || user?.sub) {
          const userId = user?.id || user?.user_id || user?.sub;
          const borrows = await getUserBorrows(userId);
          setUserBorrows(borrows);
        }
      } catch (error) {
        console.error("Error loading book:", error);
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated" && bookId) {
      loadBook();
    }
  }, [status, bookId, user?.id, user?.user_id, user?.sub]);

  const handleBorrowClick = () => {
    setShowModal(true);
  };

  const confirmBorrow = async () => {
    const userId = user?.id || user?.user_id || user?.sub;
    if (!userId || !book) return;

    setBorrowing(true);

    try {
      const result = await borrowBook(userId, book.book_id);

      if (result.success) {
        // Refresh book data
        const updatedBook = await getBookById(bookId);
        setBook(updatedBook);

        // Refresh user borrows
        const borrows = await getUserBorrows(userId);
        setUserBorrows(borrows);

        setShowModal(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("Failed to borrow book. Please try again.");
    } finally {
      setBorrowing(false);
    }
  };

  const hasActiveBorrow = userBorrows.some(
    (borrow) =>
      borrow.book_id === book?.book_id &&
      (borrow.status === "pending" || borrow.status === "progress")
  );

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Book Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The book you are looking for does not exist.
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = (book.stock ?? 0) <= 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white">
      {/* Success Notification */}
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
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Book Detail Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
            {/* Book Image */}
            <div className="md:col-span-1">
              <div className="sticky top-8">
                {book.image ? (
                  <Image
                    src={book.image}
                    alt={book.name}
                    width={400}
                    height={550}
                    className="rounded-xl shadow-2xl object-cover w-full"
                  />
                ) : (
                  <div className="w-full aspect-3/4 bg-linear-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center shadow-2xl">
                    <Book className="w-32 h-32 text-indigo-400" />
                  </div>
                )}

                {/* Stock Badge */}
                <div className="mt-6">
                  <div
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold ${
                      isOutOfStock
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : book.stock > 5
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span>
                      {isOutOfStock
                        ? "Out of Stock"
                        : `${book.stock} Available`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Information */}
            <div className="md:col-span-2">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {book.name}
                  </h1>
                  <p className="text-xl text-gray-600">
                    by {book.author || "Unknown Author"}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Author
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {book.author || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Publisher
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {book.publisher || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Year Published
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {book.year_published || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Stock Available
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {book.stock ?? 0} copies
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    About This Book
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {book.description ||
                      "This book is a valuable addition to our library collection. It covers important topics and provides insightful perspectives that will enhance your knowledge and understanding."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                  {hasActiveBorrow ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <BookOpen className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">
                            Currently Borrowed
                          </h4>
                          <p className="text-sm text-blue-700">
                            You have already borrowed this book. Check your
                            borrows section for details.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : isOutOfStock ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-red-900 mb-1">
                            Out of Stock
                          </h4>
                          <p className="text-sm text-red-700">
                            This book is currently unavailable. Please check
                            back later or browse other books.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        onClick={handleBorrowClick}
                        className="flex-1 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                      >
                        <BookUp className="w-6 h-6" />
                        Borrow This Book
                      </button>
                      <Link
                        href="/home"
                        className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors flex items-center justify-center"
                      >
                        Browse More
                      </Link>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div className="text-sm text-indigo-900">
                        <p className="font-semibold mb-1">Borrowing Policy</p>
                        <p className="text-indigo-700">
                          Books can be borrowed for up to 14 days. Please return
                          on time to avoid penalties.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Confirm Borrow
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    Review your selection
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex gap-4 mb-6">
                {book.image ? (
                  <Image
                    src={book.image}
                    alt={book.name}
                    width={80}
                    height={110}
                    className="rounded-lg shadow-md object-cover"
                  />
                ) : (
                  <div className="w-20 h-28 bg-linear-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center shadoshrink-0">
                    <Book className="w-10 h-10 text-indigo-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">
                    {book.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {book.author || "Unknown Author"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {book.publisher || "Unknown Publisher"} •{" "}
                    {book.year_published || "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">
                  Are you sure you want to borrow{" "}
                  <span className="font-semibold">{book.name}</span>? This book
                  will be added to your active borrows with a{" "}
                  <span className="font-semibold text-yellow-700">pending</span>{" "}
                  status.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={borrowing}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBorrow}
                  disabled={borrowing}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
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
