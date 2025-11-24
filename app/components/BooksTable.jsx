"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Book,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  AlertCircle,
  Tag,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";

export default function BooksTable({ books, onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const totalBooks = books.length;
  const totalStock = books.reduce((sum, b) => sum + b.stock, 0);
  const lowStockBooks = books.filter((b) => b.stock > 0 && b.stock <= 5).length;
  const outOfStockBooks = books.filter((b) => b.stock === 0).length;

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "fiction", label: "Fiction" },
    { value: "non-fiction", label: "Non-Fiction" },
    { value: "science", label: "Science" },
    { value: "technology", label: "Technology" },
    { value: "history", label: "History" },
    { value: "biography", label: "Biography" },
    { value: "children", label: "Children" },
    { value: "education", label: "Education" },
    { value: "reference", label: "Reference" },
    { value: "other", label: "Other" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "stock-high", label: "Stock (High to Low)" },
    { value: "stock-low", label: "Stock (Low to High)" },
  ];

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

  // Filter and sort books
  const filteredAndSortedBooks = books
    .filter((book) => {
      const matchesSearch =
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.author &&
          book.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (book.publisher &&
          book.publisher.toLowerCase().includes(searchQuery.toLowerCase()));

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

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">
                Total Books
              </p>
              <p className="text-3xl font-bold mt-1">{totalBooks}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Book className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Stock</p>
              <p className="text-3xl font-bold mt-1">{totalStock}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Package className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Low Stock</p>
              <p className="text-3xl font-bold mt-1">{lowStockBooks}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Out of Stock</p>
              <p className="text-3xl font-bold mt-1">{outOfStockBooks}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Search, Filter, and Sort Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search books, authors, publishers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing {filteredAndSortedBooks.length} of {books.length} books
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    Book
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Author
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Publisher
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Year
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Stock
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBooks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Book className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500">No books found</p>
                      <p className="text-sm text-gray-400">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedBooks.map((b, index) => (
                  <tr
                    key={b.book_id}
                    className={`border-b border-gray-100 hover:bg-linear-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {b.image ? (
                          <Image
                            src={b.image}
                            alt={b.name}
                            width={48}
                            height={64}
                            className="rounded-lg border-2 border-gray-200 shadow-sm object-cover"
                          />
                        ) : (
                          <div className="w-12 h-16 rounded-lg bg-linear-to-br from-emerald-100 to-blue-100 flex items-center justify-center border-2 border-emerald-200">
                            <Book className="w-6 h-6 text-emerald-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-gray-900 font-semibold line-clamp-2 max-w-xs">
                            {b.name}
                          </p>
                          <p className="text-gray-500 text-sm">
                            ID: #{b.book_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">{b.author || "-"}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getCategoryColor(
                          b.category
                        )}`}
                      >
                        <Tag className="w-3 h-3" />
                        {formatCategory(b.category)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-700">{b.publisher || "-"}</td>
                    <td className="p-4 text-gray-700">
                      {b.year_published || "-"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          b.stock > 5
                            ? "bg-linear-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                            : b.stock > 0
                            ? "bg-linear-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200"
                            : "bg-linear-to-r from-red-100 to-rose-100 text-red-700 border border-red-200"
                        }`}
                      >
                        <Package className="w-3 h-3" />
                        {b.stock} {b.stock === 1 ? "copy" : "copies"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(b)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg font-medium transition-colors border border-emerald-200"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(b.book_id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors border border-red-200"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </td>
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
