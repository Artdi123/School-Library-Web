"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { getUserBorrows, getUnreadNotificationCount } from "@/lib/action";
import { BookOpen, Clock, CheckCircle, Filter } from "lucide-react";

import Navbar from "@/app/components/dashboard/Navbar";
import BorrowCard from "@/app/components/dashboard/BorrowCard";

export default function BorrowHistoryPage() {
  const { data: session, status } = useSession();
  const [borrows, setBorrows] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [filterStatus, setFilterStatus] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);

  const user = session?.user;

  useEffect(() => {
    async function loadData() {
      startTransition(async () => {
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

  const filteredBorrows = borrows.filter((borrow) => {
    if (filterStatus === "all") return true;
    return borrow.status === filterStatus;
  });

  const activeBorrows = borrows.filter((b) => b.status !== "closed");
  const completedBorrows = borrows.filter((b) => b.status === "closed");
  const pendingBorrows = borrows.filter((b) => b.status === "pending");

  const filterOptions = [
    { value: "all", label: "All Borrows", count: borrows.length },
    { value: "pending", label: "Pending", count: pendingBorrows.length },
    {
      value: "progress",
      label: "Reading",
      count: activeBorrows.length - pendingBorrows.length,
    },
    { value: "closed", label: "Completed", count: completedBorrows.length },
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">
            Loading your borrows...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Navbar user={user} unreadCount={unreadCount} />

      {/* Hero Section */}
      <div className="bg-linear-to-r from-indigo-600 to-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              My Borrow History
            </h1>
            <p className="text-xl text-indigo-100">
              Track all your borrowed books
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900">
                  {pendingBorrows.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Reading</p>
                <p className="text-3xl font-bold text-gray-900">
                  {activeBorrows.length - pendingBorrows.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {completedBorrows.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Filter by Status
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === option.value
                    ? "bg-linear-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {/* Borrows List */}
        {isPending && borrows.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg font-medium">
              Loading your borrows...
            </p>
          </div>
        ) : filteredBorrows.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-medium mb-2">
              {borrows.length === 0
                ? "No borrow history yet"
                : "No borrows found for this filter"}
            </p>
            <p className="text-gray-400">
              {borrows.length === 0
                ? "Start borrowing books to see them here!"
                : "Try selecting a different filter"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBorrows.map((borrow) => (
              <BorrowCard key={borrow.borrow_id} borrow={borrow} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
