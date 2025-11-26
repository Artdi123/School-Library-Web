"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Book } from "lucide-react";
import {
  getBooks,
  getUserBorrows,
  borrowBook,
  getUnreadNotificationCount,
} from "@/lib/action";

import Navbar from "@/app/components/dashboard/Navbar";
import HeroSection from "@/app/components/dashboard/HeroSection";
import StatsCards from "@/app/components/dashboard/StatsCards";
import SearchFilter from "@/app/components/dashboard/SearchFilter";
import BookCard from "@/app/components/dashboard/BookCard";
import BorrowModal from "@/app/components/dashboard/BorrowModal";
import SuccessToast from "@/app/components/dashboard/SuccessToast";

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [unreadCount, setUnreadCount] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowSuccess, setShowSuccess] = useState(false);

  const user = session?.user;

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

  const hasActiveBorrow = (bookId) => {
    return borrows.some(
      (borrow) =>
        borrow.book_id === bookId &&
        (borrow.status === "pending" || borrow.status === "progress")
    );
  };

  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.author &&
          book.author.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "all" || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.book_id - a.book_id;
        case "oldest":
          return a.book_id - b.book_id;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "stock-high":
          return b.stock - a.stock;
        case "stock-low":
          return a.stock - b.stock;
        default:
          return 0;
      }
    });

  const activeBorrows = borrows.filter((b) => b.status !== "closed");
  const completedBorrows = borrows.filter((b) => b.status === "closed");

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">
            Loading your library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <SuccessToast
        show={borrowSuccess}
        message="Book borrowed successfully!"
        submessage="Check your borrow history"
      />

      <Navbar user={user} unreadCount={unreadCount} />

      {/* Hero Section */}
      <HeroSection
        user={user}
        activeBorrows={activeBorrows.length}
        completedBorrows={completedBorrows.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards
          activeBorrows={activeBorrows.length}
          completedBorrows={completedBorrows.length}
          availableBooks={books.filter((b) => (b.stock ?? 0) > 0).length}
        />

        {/* Search and Filter */}
        <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resultCount={filteredBooks.length}
          totalCount={books.length}
        />

        {/* Books Grid */}
        {isPending && books.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg font-medium">
              Loading books...
            </p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <Book className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-medium mb-2">
              {searchQuery || selectedCategory !== "all"
                ? "No books found matching your search."
                : "No books available at the moment."}
            </p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.book_id}
                book={book}
                onBorrow={openBorrowModal}
                isPending={isPending}
                isBorrowed={hasActiveBorrow(book.book_id)}
              />
            ))}
          </div>
        )}
      </div>

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
