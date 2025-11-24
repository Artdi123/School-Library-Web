import { X, User, Mail, Lock, Shield, Image as ImageIcon } from "lucide-react";
import Buttons from "./Buttons";

export default function UserModal({
  mode = "add",
  user = null,
  onClose,
  onSubmit,
}) {
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all">
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isEdit ? "Edit User" : "Add New User"}
                  </h2>
                  <p className="text-indigo-100 text-sm">
                    {isEdit
                      ? "Update user information"
                      : "Create a new user account"}
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
                value={user?.image || ""}
              />
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <User className="w-4 h-4 text-indigo-600" />
                Username
              </label>
              <input
                name="username"
                required
                defaultValue={user?.username}
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Mail className="w-4 h-4 text-indigo-600" />
                Email Address
              </label>
              <input
                name="email"
                required
                type="email"
                defaultValue={user?.email}
                placeholder="Enter email address"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Password Field (only for add mode) */}
            {!isEdit && (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password (min. 6 characters)"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Leave empty for default password: default123
                </p>
              </div>
            )}

            {/* Role Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Shield className="w-4 h-4 text-indigo-600" />
                Role
              </label>
              <select
                name="role"
                defaultValue={user?.role || "user"}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Profile Image Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                Profile Image
              </label>
              <div className="relative">
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 cursor-pointer"
                />
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Recommended: Square image, max 2MB
              </p>
            </div>

            {/* Action Buttons */}
            <Buttons
              onCancel={onClose}
              submitText={isEdit ? "Update User" : "Create User"}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
