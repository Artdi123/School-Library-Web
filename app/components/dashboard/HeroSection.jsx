// @/app/components/dashboard/HeroSection.jsx
"use client";

import { BookOpen, Sparkles, TrendingUp } from "lucide-react";

export default function HeroSection({ user, activeBorrows, completedBorrows }) {
  return (
    <div className="relative bg-linear-to-r from-indigo-600 via-blue-600 to-purple-600 py-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-in fade-in slide-in-from-top duration-500">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white text-sm font-medium">
              Welcome to Your Library
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-in fade-in slide-in-from-bottom duration-700">
            Hello,{" "}
            <span className="text-yellow-300">{user?.name || "Reader"}</span>!
          </h1>

          <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            Discover your next great adventure in the world of books
          </p>

          {/* Decorative Quote */}
          <div className="mt-8 animate-in fade-in duration-700 delay-500">
            <p className="text-indigo-200 text-sm md:text-base italic max-w-xl mx-auto">
              {`"A room without books is like a body without a soul."`}
            </p>
            <p className="text-indigo-300 text-xs mt-1">
              — Marcus Tullius Cicero
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
