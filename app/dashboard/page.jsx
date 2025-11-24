"use client";

import { useState, useEffect, useTransition } from "react";
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

import UsersTable from "../components/UsersTable";
import BooksTable from "../components/BooksTable";
import BorrowsTable from "../components/BorrowsTable";
import UserModal from "../components/UserModal";
import BookModal from "../components/BookModal";
import NotificationDropdown from "../components/NotificationDropdown";

import {
  getAllUsers,
  getBooks,
  getAllBorrows,
  getBorrowsForExport,
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
import { CheckCircle, Plus, FileDown } from "lucide-react";
import { exportBorrowsToExcel } from "@/lib/ExportToExcel";

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
  const [isExporting, setIsExporting] = useState(false);

  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    startTransition(async () => {
      if (activeMenu === "users") setUsers(await getAllUsers());
      if (activeMenu === "books") setBooks(await getBooks());
      if (activeMenu === "borrows") setBorrows(await getAllBorrows());
    });
  }, [activeMenu]);

  async function handleDeleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    await deleteUser(id);
    setUsers(await getAllUsers());
  }

  async function handleDeleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) return;
    await deleteBook(id);
    setBooks(await getBooks());
  }

  async function handleStatusChange(id, status) {
    setUpdatingStatus(id);
    const result = await updateBorrowStatus(id, status);
    if (result.success) {
      const updatedBorrows = await getAllBorrows();
      setBorrows(updatedBorrows);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 3000);
    }
    setUpdatingStatus(null);
  }

  async function handleCreateUser(formData) {
    await createUser(formData);
    setShowAddUserModal(false);
    setUsers(await getAllUsers());
  }

  async function handleUpdateUser(formData) {
    await updateUser(editUser.user_id, formData);
    setShowEditUserModal(false);
    setEditUser(null);
    setUsers(await getAllUsers());
  }

  async function handleCreateBook(formData) {
    await createBook(formData);
    setShowAddBookModal(false);
    setBooks(await getBooks());
  }

  async function handleUpdateBook(formData) {
    await updateBook(editBook.book_id, formData);
    setShowEditBookModal(false);
    setEditBook(null);
    setBooks(await getBooks());
  }

  async function handleExportBorrows() {
    try {
      setIsExporting(true);
      const data = await getBorrowsForExport();
      exportBorrowsToExcel(data);
      setIsExporting(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export data. Please try again.");
      setIsExporting(false);
    }
  }

  if (user?.role === "user") {
    forbidden();
  }

  const userId = user?.id || user?.user_id || user?.sub;

  return (
    <SidebarProvider>
      <AppSidebar setActiveMenu={setActiveMenu} user={user} />
      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b bg-white shadow-sm">
          <div className="flex items-center justify-between w-full px-6">
            <div className="flex items-center gap-2">
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

            {/* Notification Dropdown */}
            <NotificationDropdown userId={userId} />
          </div>
        </header>

        {statusSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-5">
            <div className="bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Status updated successfully!</p>
                <p className="text-sm text-green-100">
                  Borrow record has been updated
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-1 flex-col gap-6 p-6 bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
          {/* USERS SECTION */}
          {activeMenu === "users" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    Users Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage all system users and their permissions
                  </p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add User
                </button>
              </div>
              <UsersTable
                users={users}
                onEdit={(u) => {
                  setEditUser(u);
                  setShowEditUserModal(true);
                }}
                onDelete={handleDeleteUser}
              />
            </div>
          )}

          {/* BOOKS SECTION */}
          {activeMenu === "books" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Books Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Manage library books inventory and details
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBookModal(true)}
                  className="bg-linear-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Add Book
                </button>
              </div>
              <BooksTable
                books={books}
                onEdit={(b) => {
                  setEditBook(b);
                  setShowEditBookModal(true);
                }}
                onDelete={handleDeleteBook}
              />
            </div>
          )}

          {/* BORROWS SECTION */}
          {activeMenu === "borrows" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Borrow Management
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Track and manage book borrowing activities
                  </p>
                </div>
                <button
                  onClick={handleExportBorrows}
                  disabled={isExporting || borrows.length === 0}
                  className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <FileDown className="w-5 h-5" />
                  {isExporting ? "Exporting..." : "Export to Excel"}
                </button>
              </div>
              <BorrowsTable
                borrows={borrows}
                onStatusChange={handleStatusChange}
                updatingStatus={updatingStatus}
              />
            </div>
          )}
        </div>

        {/* MODALS */}
        {showAddUserModal && (
          <UserModal
            mode="add"
            onClose={() => setShowAddUserModal(false)}
            onSubmit={handleCreateUser}
          />
        )}

        {showEditUserModal && editUser && (
          <UserModal
            mode="edit"
            user={editUser}
            onClose={() => {
              setShowEditUserModal(false);
              setEditUser(null);
            }}
            onSubmit={handleUpdateUser}
          />
        )}

        {showAddBookModal && (
          <BookModal
            mode="add"
            onClose={() => setShowAddBookModal(false)}
            onSubmit={handleCreateBook}
          />
        )}

        {showEditBookModal && editBook && (
          <BookModal
            mode="edit"
            book={editBook}
            onClose={() => {
              setShowEditBookModal(false);
              setEditBook(null);
            }}
            onSubmit={handleUpdateBook}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
