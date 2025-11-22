"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Library,
  ArrowLeft,
  Upload,
  Save,
  LogOut,
  CheckCircle,
  Edit3,
  X,
  Bookmark,
  Bell,
} from "lucide-react";
import { updateUserProfile, getUnreadNotificationCount } from "@/lib/action";

export default function UserProfile() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = session?.user;

  useEffect(() => {
    if (session?.user?.name) {
      setUsername(session.user.name);
    }
  }, [session?.user?.name]);

  useEffect(() => {
    async function loadNotificationCount() {
      if (user?.id || user?.user_id || user?.sub) {
        const userId = user?.id || user?.user_id || user?.sub;
        const count = await getUnreadNotificationCount(userId);
        setUnreadCount(count);
      }
    }

    if (session) {
      loadNotificationCount();
    }
  }, [session, user?.id, user?.user_id, user?.sub]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUsername(session?.user?.name || "");
    setPreviewImage(null);
    setImageFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", user?.email);
      formData.append("currentImage", user?.image || "");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const userId = user?.id || user?.user_id || user?.sub;

      const result = await updateUserProfile(userId, formData);

      if (result.success) {
        await update({
          ...session,
          user: {
            ...session.user,
            name: result.username,
            image: result.image,
          },
        });

        router.refresh();

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        setIsEditing(false);
        setPreviewImage(null);
        setImageFile(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const displayImage = previewImage || user?.image;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Profile updated successfully!</p>
              <p className="text-sm text-green-100">
                Your changes have been saved
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-linear-to-r from-indigo-600 to-blue-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Library className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Taruna Library
                </h1>
                <p className="text-indigo-100 text-sm">
                  Your gateway to knowledge
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <Link
                href="/home"
                className="text-white font-medium hover:text-indigo-100 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/bookmarks"
                className="text-white font-medium hover:text-indigo-100 transition-colors"
              >
                Bookmarks
              </Link>
              <Link
                href="/notifications"
                className="text-white font-medium hover:text-indigo-100 transition-colors relative"
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href="/profile"
                className="text-white font-medium hover:text-indigo-100 transition-colors"
              >
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-8 relative">
            <div className="absolute top-6 right-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-all border border-white/30"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-all border border-white/30"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
            <p className="text-indigo-100">Manage your account information</p>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  {displayImage ? (
                    <Image
                      src={displayImage}
                      alt={username}
                      width={160}
                      height={160}
                      className="rounded-full border-4 border-indigo-100 shadow-lg object-cover w-40 h-40"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-linear-to-br from-indigo-100 to-blue-100 flex items-center justify-center border-4 border-indigo-100 shadow-lg">
                      <User className="w-20 h-20 text-indigo-400" />
                    </div>
                  )}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="w-full">
                    <label className="block">
                      <span className="sr-only">Choose profile photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="flex-1 space-y-6">
                {/* Username Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    Username
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="Enter your username"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium">
                      {user?.name}
                    </div>
                  )}
                </div>

                {/* Email Field (Read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 text-indigo-600" />
                    Email Address
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500">
                    {user?.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                {/* Role Badge */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Role
                  </label>
                  <span className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-semibold">
                    {user?.role === "admin"
                      ? "Administrator"
                      : "Library Member"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
          <div className="bg-linear-to-r from-red-50 to-pink-50 p-6 border-b border-red-100">
            <h3 className="text-lg font-bold text-red-900">Account Sign Out</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Sign Out</h4>
                <p className="text-sm text-gray-600">
                  End your current session and return to login
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
