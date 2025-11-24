import { useState } from "react";
import Image from "next/image";
import {
  User,
  Edit,
  Trash2,
  Mail,
  Shield,
  UserCircle,
  Search,
  Filter,
} from "lucide-react";

export default function UsersTable({ users, onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("username");

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case "username":
        return a.username.localeCompare(b.username);
      case "username-desc":
        return b.username.localeCompare(a.username);
      case "email":
        return a.email.localeCompare(b.email);
      case "role":
        return a.role.localeCompare(b.role);
      default:
        return 0;
    }
  });

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-1">{totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <UserCircle className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">
                Administrators
              </p>
              <p className="text-3xl font-bold mt-1">{adminCount}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">
                Regular Users
              </p>
              <p className="text-3xl font-bold mt-1">{userCount}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <User className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin Only</option>
                <option value="user">Users Only</option>
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
            <option value="username">Username (A-Z)</option>
            <option value="username-desc">Username (Z-A)</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">
            Showing {sortedUsers.length} of {totalUsers} users
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    User
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Role
                  </div>
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No users found</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Try adjusting your filters
                    </p>
                  </td>
                </tr>
              ) : (
                sortedUsers.map((u, index) => (
                  <tr
                    key={u.user_id}
                    className={`border-b border-gray-100 hover:bg-linear-to-r hover:from-indigo-50 hover:to-blue-50 transition-all duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {u.image ? (
                          <Image
                            src={u.image}
                            alt={u.username}
                            width={48}
                            height={48}
                            className="rounded-full border-2 border-indigo-100 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-100 to-blue-100 flex items-center justify-center border-2 border-indigo-200">
                            <User className="w-6 h-6 text-indigo-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-gray-900 font-semibold">
                            {u.username}
                          </p>
                          <p className="text-gray-500 text-sm">
                            ID: #{u.user_id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {u.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-linear-to-r from-indigo-100 to-blue-100 text-indigo-700 border border-indigo-200"
                            : "bg-linear-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300"
                        }`}
                      >
                        {u.role === "admin" ? (
                          <Shield className="h-3 w-3 mr-1" />
                        ) : (
                          <User className="h-3 w-3 mr-1" />
                        )}
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(u)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg font-medium transition-colors border border-indigo-200"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(u.user_id)}
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
