import { useState } from "react";
import {
  Calendar,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle,
  BookOpen,
  TrendingUp,
  Search,
  Filter,
  Check,
  X,
} from "lucide-react";

export default function BorrowsTable({
  borrows,
  onStatusChange,
  updatingStatus,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [overdueFilter, setOverdueFilter] = useState("all");
  const [sortBy, setSortBy] = useState("borrow-date-desc");

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

  // Filter borrows
  const filteredBorrows = borrows.filter((borrow) => {
    const matchesSearch =
      borrow.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrow.book_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrow.borrow_id.toString().includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || borrow.status === statusFilter;

    const matchesOverdue =
      overdueFilter === "all" ||
      (overdueFilter === "overdue" &&
        isOverdue(borrow.due_date, borrow.status)) ||
      (overdueFilter === "on-time" &&
        !isOverdue(borrow.due_date, borrow.status));

    return matchesSearch && matchesStatus && matchesOverdue;
  });

  // Sort borrows
  const sortedBorrows = [...filteredBorrows].sort((a, b) => {
    switch (sortBy) {
      case "borrow-date-desc":
        return new Date(b.borrow_date) - new Date(a.borrow_date);
      case "borrow-date-asc":
        return new Date(a.borrow_date) - new Date(b.borrow_date);
      case "due-date-desc":
        return new Date(b.due_date) - new Date(a.due_date);
      case "due-date-asc":
        return new Date(a.due_date) - new Date(a.due_date);
      case "fine-high":
        return (b.fine || 0) - (a.fine || 0);
      case "fine-low":
        return (a.fine || 0) - (b.fine || 0);
      case "username":
        return a.username.localeCompare(b.username);
      default:
        return 0;
    }
  });

  const totalBorrows = borrows.length;
  const pendingCount = borrows.filter((b) => b.status === "pending").length;
  const progressCount = borrows.filter((b) => b.status === "progress").length;
  const closedCount = borrows.filter((b) => b.status === "closed").length;
  const rejectedCount = borrows.filter((b) => b.status === "rejected").length;
  const overdueCount = borrows.filter(
    (b) =>
      b.status !== "closed" &&
      b.status !== "rejected" &&
      new Date() > new Date(b.due_date)
  ).length;
  const totalFines = borrows.reduce((sum, b) => sum + (b.fine || 0), 0);

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-2 border-yellow-200">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
      case "progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-2 border-blue-200">
            <TrendingUp className="w-4 h-4" />
            In Progress
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-2 border-green-200">
            <CheckCircle className="w-4 h-4" />
            Closed
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-2 border-red-200">
            <X className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const renderStatusActions = (borrow) => {
    const isUpdating = updatingStatus === borrow.borrow_id;

    // If closed or rejected, just show the badge - no actions
    if (borrow.status === "closed" || borrow.status === "rejected") {
      return getStatusBadge(borrow.status);
    }

    // If pending, show Approve/Reject buttons
    if (borrow.status === "pending") {
      return (
        <div className="flex items-center gap-2">
          {getStatusBadge(borrow.status)}
          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(borrow.borrow_id, "progress")}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white border-2 border-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              title="Approve borrow request"
            >
              <Check className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onStatusChange(borrow.borrow_id, "rejected")}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
              title="Reject borrow request"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
          </div>
          {isUpdating && (
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      );
    }

    // If in progress, show the badge and Return button
    if (borrow.status === "progress") {
      return (
        <div className="flex items-center gap-2">
          {getStatusBadge(borrow.status)}
          <button
            onClick={() => onStatusChange(borrow.borrow_id, "closed")}
            disabled={isUpdating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-2 border-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            title="Mark as returned"
          >
            <CheckCircle className="w-4 h-4" />
            Mark Returned
          </button>
          {isUpdating && (
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      );
    }

    return getStatusBadge(borrow.status);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total</p>
              <p className="text-3xl font-bold mt-1">{totalBorrows}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-1">{pendingCount}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Progress</p>
              <p className="text-3xl font-bold mt-1">{progressCount}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Closed</p>
              <p className="text-3xl font-bold mt-1">{closedCount}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold mt-1">{rejectedCount}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <X className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold mt-1">{overdueCount}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Fines</p>
              <p className="text-2xl font-bold mt-1">
                Rp {(totalFines / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by ID, username, or book..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="progress">In Progress</option>
                <option value="closed">Closed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Overdue Filter */}
          <div>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={overdueFilter}
                onChange={(e) => setOverdueFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Records</option>
                <option value="overdue">Overdue Only</option>
                <option value="on-time">On Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm cursor-pointer"
          >
            <option value="borrow-date-desc">Borrow Date (Newest)</option>
            <option value="borrow-date-asc">Borrow Date (Oldest)</option>
            <option value="due-date-desc">Due Date (Latest)</option>
            <option value="due-date-asc">Due Date (Earliest)</option>
            <option value="fine-high">Fine (High to Low)</option>
            <option value="fine-low">Fine (Low to High)</option>
            <option value="username">Username (A-Z)</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {sortedBorrows.length} of {totalBorrows} records
          </span>
        </div>
      </div>

      {/* Borrows Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-700">
                  ID
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Username
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Book
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Borrow Date
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Return Date
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Fine
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Status & Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBorrows.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No borrow records found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adjusting your filters
                    </p>
                  </td>
                </tr>
              ) : (
                sortedBorrows.map((br, index) => (
                  <tr
                    key={br.borrow_id}
                    className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 ${
                      isOverdue(br.due_date, br.status)
                        ? "bg-red-50"
                        : index % 2 === 0
                        ? "bg-white"
                        : "bg-gray-50/50"
                    }`}
                  >
                    <td className="p-4">
                      <span className="text-gray-700 font-mono font-semibold">
                        #{br.borrow_id}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-600 font-semibold text-sm border-2 border-indigo-200">
                          {br.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900 font-medium">
                          {br.username}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-700 font-medium">
                        {br.book_name}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {formatDate(br.borrow_date)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span
                          className={
                            isOverdue(br.due_date, br.status)
                              ? "text-red-600 font-semibold"
                              : "text-gray-700"
                          }
                        >
                          {formatDate(br.due_date)}
                        </span>
                        {isOverdue(br.due_date, br.status) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            OVERDUE
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">
                      {formatDate(br.return_date)}
                    </td>
                    <td className="p-4">
                      {br.fine > 0 ? (
                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          Rp {br.fine.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">{renderStatusActions(br)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
