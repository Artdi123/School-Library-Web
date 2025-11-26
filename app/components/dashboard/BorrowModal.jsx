// @/app/components/dashboard/BorrowModal.jsx
import Image from "next/image";
import { X, AlertCircle, Book, Tag } from "lucide-react";

export default function BorrowModal({ book, onClose, onConfirm, borrowing }) {
  if (!book) return null;

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-6 relative">
          <button
            onClick={onClose}
            disabled={borrowing}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Confirm Borrow</h3>
              <p className="text-indigo-100 text-sm">Review your selection</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            {book.image ? (
              <Image
                src={book.image}
                alt={book.name}
                width={100}
                height={140}
                className="rounded-lg shadow-md object-cover"
              />
            ) : (
              <div className="w-24 h-36 bg-linear-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center shadow-md shrink-0">
                <Book className="w-12 h-12 text-indigo-400" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                {book.name}
              </h4>
              <p className="text-sm text-gray-600 mb-1 font-medium">
                {book.author || "Unknown Author"}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                {book.publisher || "Unknown Publisher"} •{" "}
                {book.year_published || "N/A"}
              </p>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getCategoryColor(
                  book.category
                )}`}
              >
                <Tag className="w-3 h-3" />
                {formatCategory(book.category)}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              Are you sure you want to borrow{" "}
              <span className="font-semibold text-gray-900">{book.name}</span>?
              This book will be added to your active borrows with a{" "}
              <span className="font-semibold text-yellow-700">pending</span>{" "}
              status. Due date will be 14 days from approval.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={borrowing}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={borrowing}
              className="flex-1 px-4 py-3 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
  );
}
