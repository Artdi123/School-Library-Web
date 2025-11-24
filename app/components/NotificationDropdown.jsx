"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  X,
  CheckCircle,
  Clock,
  BookOpen,
  Bookmark,
  AlertTriangle,
  Trash2,
  CheckCheck,
} from "lucide-react";
import Link from "next/link";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/lib/action";

export default function NotificationDropdown({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function loadNotifications() {
      if (!userId) return;
      setLoading(true);
      try {
        const [notifs, count] = await Promise.all([
          getNotifications(userId),
          getUnreadNotificationCount(userId),
        ]);
        setNotifications(notifs.slice(0, 5)); // Show only latest 5
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
      setLoading(false);
    }

    loadNotifications();
  }, [userId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function refreshNotifications() {
    if (!userId) return;
    try {
      const [notifs, count] = await Promise.all([
        getNotifications(userId),
        getUnreadNotificationCount(userId),
      ]);
      setNotifications(notifs.slice(0, 5));
      setUnreadCount(count);
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    }
  }

  async function handleMarkRead(id, e) {
    e.stopPropagation();
    await markNotificationRead(id);
    await refreshNotifications();
  }

  async function handleMarkAllRead(e) {
    e.stopPropagation();
    await markAllNotificationsRead(userId);
    await refreshNotifications();
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    await deleteNotification(id);
    await refreshNotifications();
  }

  const getNotificationIcon = (type) => {
    const icons = {
      borrow: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
      return: { icon: BookOpen, color: "text-blue-600", bg: "bg-blue-100" },
      fine: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
      bookmark: {
        icon: Bookmark,
        color: "text-indigo-600",
        bg: "bg-indigo-100",
      },
      admin_alert: {
        icon: Bell,
        color: "text-purple-600",
        bg: "bg-purple-100",
      },
      general: { icon: Bell, color: "text-gray-600", bg: "bg-gray-100" },
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

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-linear-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-5">
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-600 to-blue-600 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-white" />
                <h3 className="text-white font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-white/30 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-white/90 hover:text-white text-xs font-medium flex items-center gap-1 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 font-medium">No notifications</p>
                <p className="text-gray-400 text-sm">You are all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => {
                  const iconInfo = getNotificationIcon(notif.type);
                  const IconComponent = iconInfo.icon;

                  return (
                    <div
                      key={notif.notification_id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notif.is_read ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`w-10 h-10 ${iconInfo.bg} rounded-lg flex items-center justify-center shrink-0`}
                        >
                          <IconComponent
                            className={`w-5 h-5 ${iconInfo.color}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm ${
                              !notif.is_read
                                ? "text-gray-900 font-semibold"
                                : "text-gray-700"
                            } line-clamp-2`}
                          >
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(notif.created_at)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          {!notif.is_read && (
                            <button
                              onClick={(e) =>
                                handleMarkRead(notif.notification_id, e)
                              }
                              className="text-indigo-600 hover:text-indigo-800 p-1 hover:bg-indigo-100 rounded transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) =>
                              handleDelete(notif.notification_id, e)
                            }
                            className="text-gray-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-3 bg-gray-50">
              <Link
                href="/notifications"
                className="block text-center text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
