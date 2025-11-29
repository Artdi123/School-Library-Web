import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Book,
  Tag,
} from "lucide-react";

export default function BorrowCard({ borrow }) {
  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate, status) => {
    if (status === "closed" || status === "rejected" || !dueDate) return false;
    return new Date() > new Date(dueDate);
  };

  const overdue = isOverdue(borrow.due_date, borrow.status);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
      case "progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            <Book className="w-4 h-4" />
            Reading
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-700 border border-green-200">
            <CheckCircle className="w-4 h-4" />
            Completed
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return null;
    }
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
    <div
      className={`bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg ${
        overdue
          ? "border-red-300 bg-red-50/50"
          : "border-gray-200 hover:border-indigo-300"
      }`}
    >
      <div className="flex gap-4 p-5">
        {/* Book Image */}
        <Link href={`/book/${borrow.book_id}`} className="shrink-0">
          {borrow.book_image ? (
            <Image
              src={borrow.book_image}
              alt={borrow.book_name}
              width={120}
              height={160}
              className="rounded-lg object-cover shadow-md hover:opacity-90 transition-opacity"
            />
          ) : (
            <div className="w-[120px] h-40 bg-linear-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center shadow-md">
              <Book className="w-12 h-12 text-indigo-400" />
            </div>
          )}
        </Link>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <Link href={`/book/${borrow.book_id}`}>
                <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-indigo-600 transition-colors line-clamp-1">
                  {borrow.book_name}
                </h3>
              </Link>
              {borrow.author && (
                <p className="text-sm text-gray-600 mb-1">by {borrow.author}</p>
              )}
              {borrow.publisher && (
                <p className="text-xs text-gray-500">
                  Published by {borrow.publisher}
                </p>
              )}
            </div>
            {getStatusBadge(borrow.status)}
          </div>

          {/* Category Badge */}
          {borrow.category && (
            <div className="mb-3">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(
                  borrow.category
                )}`}
              >
                <Tag className="w-3 h-3" />
                {formatCategory(borrow.category)}
              </span>
            </div>
          )}

          {/* Dates Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Borrow Date</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatDate(borrow.borrow_date)}
              </p>
            </div>

            <div
              className={`rounded-lg p-3 border ${
                overdue
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div
                className={`flex items-center gap-2 mb-1 ${
                  overdue ? "text-red-600" : "text-gray-600"
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium">Due Date</span>
                {overdue && <AlertTriangle className="w-3 h-3" />}
              </div>
              <p
                className={`text-sm font-semibold ${
                  overdue ? "text-red-700" : "text-gray-900"
                }`}
              >
                {formatDate(borrow.due_date)}
              </p>
              {overdue && (
                <p className="text-xs text-red-600 font-medium mt-1">
                  OVERDUE!
                </p>
              )}
            </div>
          </div>

          {/* Return Date and Fine */}
          <div className="flex items-center justify-between gap-3">
            {borrow.return_date && (
              <div className="bg-green-50 rounded-lg px-3 py-2 border border-green-200 flex-1">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-medium">Returned</span>
                </div>
                <p className="text-sm font-semibold text-green-900 mt-1">
                  {formatDate(borrow.return_date)}
                </p>
              </div>
            )}

            {borrow.fine > 0 && (
              <div className="bg-red-50 rounded-lg px-3 py-2 border border-red-200">
                <div className="flex items-center gap-2 text-red-600 mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs font-medium">Fine</span>
                </div>
                <p className="text-lg font-bold text-red-700">
                  Rp {borrow.fine.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
