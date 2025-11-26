// @/app/components/dashboard/Navbar.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Library, Bell, User, BookOpen, History, Home } from "lucide-react";

export default function Navbar({ user, unreadCount }) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/home" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Library className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Taruna Library
              </h1>
              <p className="text-xs text-gray-500">Digital Collection</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/home"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <Link
              href="/borrow-history"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">My Borrows</span>
            </Link>

            <Link
              href="/bookmarks"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Bookmarks</span>
            </Link>

            <Link
              href="/notifications"
              className="relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all font-medium"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
              <span className="hidden sm:inline">Notifications</span>
            </Link>

            {/* User Profile */}
            <Link
              href="/profile"
              className="flex items-center gap-2 ml-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {user?.name || "User"}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
