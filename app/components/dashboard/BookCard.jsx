// @/app/components/dashboard/BookCard.jsx
import Image from "next/image";
import Link from "next/link";
import { Book, Tag, BookOpen, Calendar } from "lucide-react";

export default function BookCard({ book, onBorrow, isPending, isBorrowed }) {
  const isOutOfStock = (book.stock ?? 0) <= 0;

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      fiction: "bg-purple-100 text-purple-700 border-purple-200",
      "non-fiction": "bg-blue-100 text-blue-700 border-blue-200",
      science: "bg-cyan-100 text-cyan-700 border-cyan-200",
      technology: "bg-indigo-100 text-indigo-700 border-indigo-200",
      history: "bg-amber-100 text-amber-700 border-amber-200",
      biography: "bg-pink-100 text-pink-700 border-pink-200",
      children: "bg-yellow-100 text-yellow-700 border-yellow-200",
      education: "bg-green-100 text-green-700 border-green-200",
      reference: "bg-slate-100 text-slate-700 border-slate-200",
      other: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[category] || colors.other;
  };

  const formatCategory = (category) => {
    if (!category) return "Other";
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <Link href={`/book/${book.book_id}`}>
          {book.image ? (
            <Image
              src={book.image}
              alt={book.name}
              width={400}
              height={200}
              className="w-full h-92 object-cover hover:opacity-90 transition-opacity"
            />
          ) : (
            <div className="w-full h-48 bg-linear-to-br from-indigo-100 to-blue-100 flex items-center justify-center hover:opacity-90 transition-opacity">
              <Book className="w-16 h-16 text-indigo-400" />
            </div>
          )}
        </Link>
        <div className="absolute bottom-3 left-3">
          <span
            className={`text-xs font-semibold px-3 py-1.5 rounded-full shadow-md ${
              isOutOfStock ? "bg-red-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : `${book.stock} Available`}
          </span>
        </div>
      </div>

      <div className="p-5">
        <Link href={`/book/${book.book_id}`}>
          <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1 hover:text-indigo-600 transition-colors">
            {book.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-1">
          {book.author || "Unknown Author"}
        </p>
        <p className="text-xs text-gray-500 mb-2">
          {book.publisher || "Unknown Publisher"} •{" "}
          {book.year_published || "N/A"}
        </p>

        {/* Category Badge */}
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border w-fit mb-3 ${getCategoryColor(
            book.category
          )}`}
        >
          <Tag className="w-3 h-3" />
          {formatCategory(book.category)}
        </span>

        {/* Bookmarked Date - Only show if bookmarked_at exists */}
        {book.bookmarked_at && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>Bookmarked on {formatDate(book.bookmarked_at)}</span>
          </div>
        )}

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
              onClick={() => onBorrow(book)}
              disabled={isPending || isOutOfStock}
              className="flex-1 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-2.5 rounded-lg font-medium transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-1"
            >
              {isOutOfStock ? "No Stock" : "Borrow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
