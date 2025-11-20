"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import Modal from "../components/Modal";
import Buttons from "../components/Buttons";

import {
  getAllUsers,
  getBooks,
  getAllBorrows,
  createUser,
  updateUser,
  deleteUser,
  createBook,
  updateBook,
  deleteBook,
  updateBorrowStatus,
} from "@/lib/action";
import { useSession } from "next-auth/react";
import { forbidden } from "next/navigation";
import { Book, User, CheckCircle } from "lucide-react";

export default function DashboardContent() {
  const [activeMenu, setActiveMenu] = useState("users");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showEditBookModal, setShowEditBookModal] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [statusSuccess, setStatusSuccess] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      if (activeMenu === "users") setUsers(await getAllUsers());
      if (activeMenu === "books") setBooks(await getBooks());
      if (activeMenu === "borrows") setBorrows(await getAllBorrows());
    });
  }, [activeMenu]);

  async function handleDeleteUser(id) {
    await deleteUser(id);
    setUsers(await getAllUsers());
  }

  async function handleDeleteBook(id) {
    await deleteBook(id);
    setBooks(await getBooks());
  }

  async function handleStatusChange(id, status) {
    setUpdatingStatus(id);
    try {
      const result = await updateBorrowStatus(id, status);
      if (result.success) {
        const updatedBorrows = await getAllBorrows();
        setBorrows(updatedBorrows);
        setStatusSuccess(true);
        setTimeout(() => setStatusSuccess(false), 3000);
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating the status");
    } finally {
      setUpdatingStatus(null);
    }
  }

  const formatDate = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const { data: session, status } = useSession();

  const user = session?.user;

  if (user?.role === "user") {
    forbidden();
  }

  return (
    <SidebarProvider>
      <AppSidebar setActiveMenu={setActiveMenu} user={user} />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b bg-white">
          <div className="flex items-center gap-2 px-6">
            <SidebarTrigger className="-ml-1 text-gray-600 hover:text-indigo-600 transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/dashboard"
                    className="text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent font-medium capitalize">
                    {activeMenu}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Success Notification */}
        {statusSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
            <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Status updated successfully!</p>
                <p className="text-sm text-green-100">Borrow record updated</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-6 p-6 bg-gray-50 min-h-screen">
          {/* USERS */}
          {activeMenu === "users" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Users Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage all system users and their permissions
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Username
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Email
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Role
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Image
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u.user_id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-900 font-medium">
                          {u.username}
                        </td>
                        <td className="p-4 text-gray-700">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              u.role === "admin"
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4">
                          {u.image ? (
                            <Image
                              src={u.image}
                              alt={u.username}
                              width={40}
                              height={40}
                              className="rounded-full border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400"></User>
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setEditUser(u);
                                setShowEditUserModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.user_id)}
                              className="text-red-600 hover:text-red-800 font-medium transition-colors flex items-center gap-1"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BOOKS */}
          {activeMenu === "books" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Books Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage library books inventory and details
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBookModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  Add Book
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Name
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Author
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Publisher
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Year
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Stock
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Image
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((b) => (
                      <tr
                        key={b.book_id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-900 font-medium">
                          {b.name}
                        </td>
                        <td className="p-4 text-gray-700">{b.author}</td>
                        <td className="p-4 text-gray-700">{b.publisher}</td>
                        <td className="p-4 text-gray-700">
                          {b.year_published}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              b.stock > 5
                                ? "bg-green-100 text-green-800"
                                : b.stock > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {b.stock} in stock
                          </span>
                        </td>
                        <td className="p-4">
                          {b.image ? (
                            <Image
                              src={b.image}
                              alt={b.name}
                              width={40}
                              height={40}
                              className="rounded border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                              <Book className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setEditBook(b);
                                setShowEditBookModal(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteBook(b.book_id)}
                              className="text-red-600 hover:text-red-800 font-medium transition-colors flex items-center gap-1"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BORROWS */}
          {activeMenu === "borrows" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Borrow Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Track and manage book borrowing activities
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left p-4 font-semibold text-gray-700">
                        ID
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Username
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Book
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Borrow Date
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Return Date
                      </th>
                      <th className="text-left p-4 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrows.map((br) => (
                      <tr
                        key={br.borrow_id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-4 text-gray-700 font-mono">
                          #{br.borrow_id}
                        </td>
                        <td className="p-4 text-gray-900 font-medium">
                          {br.username}
                        </td>
                        <td className="p-4 text-gray-700">{br.book_name}</td>
                        <td className="p-4 text-gray-700">
                          {formatDate(br.borrow_date)}
                        </td>
                        <td className="p-4 text-gray-700">
                          {formatDate(br.return_date)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={br.status}
                              onChange={(e) =>
                                handleStatusChange(br.borrow_id, e.target.value)
                              }
                              disabled={updatingStatus === br.borrow_id}
                              className={`border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                updatingStatus === br.borrow_id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <option
                                value="pending"
                                className="text-yellow-600"
                              >
                                Pending
                              </option>
                              <option
                                value="progress"
                                className="text-blue-600"
                              >
                                Progress
                              </option>
                              <option value="closed" className="text-green-600">
                                Closed
                              </option>
                            </select>
                            {updatingStatus === br.borrow_id && (
                              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ADD + EDIT MODALS */}

        {/* Add User */}
        {showAddUserModal && (
          <Modal
            title="Add New User"
            onClose={() => setShowAddUserModal(false)}
          >
            <form action={createUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  name="username"
                  required
                  placeholder="Enter username"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <input
                  name="image"
                  type="file"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <Buttons onCancel={() => setShowAddUserModal(false)} />
            </form>
          </Modal>
        )}

        {/* Edit User */}
        {showEditUserModal && editUser && (
          <Modal title="Edit User" onClose={() => setShowEditUserModal(false)}>
            <form
              action={(formData) => updateUser(editUser.user_id, formData)}
              className="space-y-4"
            >
              <input type="hidden" name="currentImage" value={editUser.image} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  name="username"
                  defaultValue={editUser.username}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  defaultValue={editUser.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  defaultValue={editUser.role}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <input
                  name="image"
                  type="file"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <Buttons onCancel={() => setShowEditUserModal(false)} />
            </form>
          </Modal>
        )}

        {/* Add Book */}
        {showAddBookModal && (
          <Modal
            title="Add New Book"
            onClose={() => setShowAddBookModal(false)}
          >
            <form action={createBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Name
                </label>
                <input
                  name="name"
                  required
                  placeholder="Enter book name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  name="author"
                  placeholder="Enter author name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher
                </label>
                <input
                  name="publisher"
                  placeholder="Enter publisher"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Published
                </label>
                <input
                  name="year_published"
                  type="number"
                  placeholder="Enter publication year"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  name="stock"
                  type="number"
                  placeholder="Enter stock quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Cover
                </label>
                <input
                  name="image"
                  type="file"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <Buttons onCancel={() => setShowAddBookModal(false)} />
            </form>
          </Modal>
        )}

        {/* Edit Book */}
        {showEditBookModal && editBook && (
          <Modal title="Edit Book" onClose={() => setShowEditBookModal(false)}>
            <form
              action={(formData) => updateBook(editBook.book_id, formData)}
              className="space-y-4"
            >
              <input type="hidden" name="currentImage" value={editBook.image} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Name
                </label>
                <input
                  name="name"
                  defaultValue={editBook.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author
                </label>
                <input
                  name="author"
                  defaultValue={editBook.author}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Publisher
                </label>
                <input
                  name="publisher"
                  defaultValue={editBook.publisher}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year Published
                </label>
                <input
                  name="year_published"
                  defaultValue={editBook.year_published}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  name="stock"
                  defaultValue={editBook.stock}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Book Cover
                </label>
                <input
                  name="image"
                  type="file"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              <Buttons onCancel={() => setShowEditBookModal(false)} />
            </form>
          </Modal>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
