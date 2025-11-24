import {
  X,
  Book,
  User,
  Building,
  Calendar,
  Package,
  Image as ImageIcon,
  FileText,
  Tag,
} from "lucide-react";
import Buttons from "./Buttons";

export default function BookModal({
  mode = "add",
  book = null,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === "edit";

  const categories = [
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full transform transition-all max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-linear-to-r from-emerald-600 to-blue-600 px-6 py-5 rounded-t-2xl sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <Book className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isEdit ? "Edit Book" : "Add New Book"}
                  </h2>
                  <p className="text-emerald-100 text-sm">
                    {isEdit
                      ? "Update book information"
                      : "Add a new book to the library"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form action={onSubmit} className="p-6 space-y-5">
            {isEdit && (
              <input
                type="hidden"
                name="currentImage"
                value={book?.image || ""}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Book Name Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Book className="w-4 h-4 text-emerald-600" />
                  Book Title
                </label>
                <input
                  name="name"
                  required
                  defaultValue={book?.name}
                  placeholder="Enter book title"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Author Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User className="w-4 h-4 text-emerald-600" />
                  Author
                </label>
                <input
                  name="author"
                  defaultValue={book?.author}
                  placeholder="Enter author name"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Publisher Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Building className="w-4 h-4 text-emerald-600" />
                  Publisher
                </label>
                <input
                  name="publisher"
                  defaultValue={book?.publisher}
                  placeholder="Enter publisher name"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  Category
                </label>
                <select
                  name="category"
                  defaultValue={book?.category || "other"}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Select the book category
                </p>
              </div>

              {/* Year Published Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Year Published
                </label>
                <input
                  name="year_published"
                  type="number"
                  min="1000"
                  max="2100"
                  defaultValue={book?.year_published}
                  placeholder="e.g., 2024"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Stock Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Package className="w-4 h-4 text-emerald-600" />
                  Stock Quantity
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={book?.stock || 0}
                  placeholder="Enter stock quantity"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Number of copies available
                </p>
              </div>

              {/* Description Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  defaultValue={book?.description}
                  placeholder="Enter book description..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-gray-400 resize-none"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Brief description of the book content
                </p>
              </div>

              {/* Book Cover Field */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  Book Cover Image
                </label>
                <div className="relative">
                  <input
                    name="image"
                    type="file"
                    accept="image/*"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer"
                  />
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Recommended: Portrait orientation, max 5MB
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <Buttons
              onCancel={onClose}
              submitText={isEdit ? "Update Book" : "Add Book"}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
