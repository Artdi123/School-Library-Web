"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Bell,
  Library,
  ArrowLeft,
  CheckCircle,
  Clock,
  BookOpen,
  Bookmark,
  AlertTriangle,
  Trash2,
  CheckCheck,
  X,
} from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/lib/action";

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const user = session?.user;

  useEffect(() => {
    async function loadNotifications() {
      const userId = user?.id || user?.user_id || user?.sub;
      if (userId) {
        const notifs = await getNotifications(userId);
        setNotifications(notifs);
      }
      setLoading(false);
    }

    if (status === "authenticated") {
      loadNotifications();
    }
  }, [status, user?.id, user?.user_id, user?.sub]);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(
      notifications.map((n) =>
        n.notification_id === id ? { ...n, is_read: true } : n
      )
    );
  };

  const handleMarkAllRead = async () => {
    const userId = user?.id || user?.user_id || user?.sub;
    if (userId) {
      await markAllNotificationsRead(userId);
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    }
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
    setNotifications(notifications.filter((n) => n.notification_id !== id));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      borrow_pending: {
        icon: Clock,
        color: "text-yellow-500",
        bg: "bg-yellow-100",
      },
      borrow_approved: {
        icon: CheckCircle,
        color: "text-green-500",
        bg: "bg-green-100",
      },
      borrow_closed: {
        icon: BookOpen,
        color: "text-blue-500",
        bg: "bg-blue-100",
      },
      borrow_closed_fine: {
        icon: AlertTriangle,
        color: "text-red-500",
        bg: "bg-red-100",
      },
      bookmark_added: {
        icon: Bookmark,
        color: "text-indigo-500",
        bg: "bg-indigo-100",
      },
      general: { icon: Bell, color: "text-gray-500", bg: "bg-gray-100" },
    };
    return icons[type] || icons.general;
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-white">
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
                className="text-white font-medium hover:text-indigo-100 transition-colors"
              >
                Notifications
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
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Notifications
                  </h2>
                  <p className="text-indigo-100 text-sm">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${
                          unreadCount > 1 ? "s" : ""
                        }`
                      : "All caught up!"}
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <CheckCheck className="w-5 h-5" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="border-b border-gray-200 px-6 py-3">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "all"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "unread"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "read"
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Read ({notifications.length - unreadCount})
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">
                  No notifications
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {filter === "unread"
                    ? "You've read all your notifications!"
                    : "You don't have any notifications yet."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const iconInfo = getNotificationIcon(notif.type);
                const IconComponent = iconInfo.icon;

                return (
                  <div
                    key={notif.notification_id}
                    className={`p-6 hover:bg-gray-50 transition-colors ${
                      !notif.is_read ? "bg-indigo-50/50" : ""
                    }`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`w-12 h-12 ${iconInfo.bg} rounded-xl flex items-center justify-center shrink-0`}
                      >
                        <IconComponent
                          className={`w-6 h-6 ${iconInfo.color}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p
                              className={`text-gray-900 ${
                                !notif.is_read ? "font-semibold" : ""
                              }`}
                            >
                              {notif.message}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(notif.created_at)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {!notif.is_read && (
                              <button
                                onClick={() =>
                                  handleMarkRead(notif.notification_id)
                                }
                                className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleDelete(notif.notification_id)
                              }
                              className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        {!notif.is_read && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              New
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
