"use server";

import bcrypt from "bcryptjs";
import pool from "./database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import path from "path";
import { writeFile } from "fs/promises";

/* VALIDATION SCHEMAS */
const userSchema = z.object({
  username: z.string().min(3, "Username terlalu pendek"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional(),
  role: z.enum(["user", "admin"]).default("user"),
});

const bookSchema = z.object({
  name: z.string().min(1, "Nama buku harus diisi"),
  author: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: z
    .enum([
      "fiction",
      "non-fiction",
      "science",
      "technology",
      "history",
      "biography",
      "children",
      "education",
      "reference",
      "other",
    ])
    .default("other"),
  year_published: z
    .string()
    .regex(/^\d{4}$/, "Tahun harus 4 digit")
    .nullable()
    .optional(),
  stock: z.number().int().nonnegative().default(0),
});

const userProfileSchema = z.object({ username: z.string().min(3) });

/* HELPER: Upload file */
async function uploadFile(file) {
  if (!file || file.size === 0) return null;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/${filename}`;
}

/* USER MANAGEMENT */
export async function createUser(formData) {
  const data = userSchema.parse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  const imagePath = await uploadFile(formData.get("image"));
  const hashed = data.password
    ? bcrypt.hashSync(data.password)
    : bcrypt.hashSync("default123");

  await pool.execute(
    "INSERT INTO users (username, email, password, role, image) VALUES (?, ?, ?, ?, ?)",
    [data.username, data.email, hashed, data.role, imagePath]
  );

  revalidatePath("/dashboard");
}

export async function getAllUsers() {
  const [rows] = await pool.execute(
    "SELECT * FROM users ORDER BY user_id DESC"
  );
  return rows;
}

export async function getUserByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

export async function updateUser(id, formData) {
  const data = userSchema.partial().parse({
    username: formData.get("username"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  const file = formData.get("image");
  let imagePath = formData.get("currentImage") || null;
  if (file && file.size > 0) imagePath = await uploadFile(file);

  await pool.execute(
    "UPDATE users SET username=?, email=?, role=?, image=? WHERE user_id=?",
    [data.username, data.email, data.role, imagePath, id]
  );

  revalidatePath("/dashboard");
}

export async function deleteUser(id) {
  await pool.execute("DELETE FROM users WHERE user_id=?", [id]);
  revalidatePath("/dashboard");
}

/* BOOK MANAGEMENT */
export async function createBook(formData) {
  const data = bookSchema.parse({
    name: formData.get("name"),
    author: formData.get("author"),
    publisher: formData.get("publisher"),
    description: formData.get("description"),
    category: formData.get("category") || "other",
    year_published: formData.get("year_published"),
    stock: Number(formData.get("stock")) || 0,
  });

  const imagePath = await uploadFile(formData.get("image"));

  await pool.execute(
    "INSERT INTO books (name, author, publisher, description, category, year_published, stock, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      data.name,
      data.author,
      data.publisher,
      data.description,
      data.category,
      data.year_published,
      data.stock,
      imagePath,
    ]
  );

  revalidatePath("/dashboard");
}

export async function getBooks() {
  const [rows] = await pool.execute(
    "SELECT * FROM books ORDER BY book_id DESC"
  );
  return rows;
}

export async function updateBook(id, formData) {
  const data = bookSchema.partial().parse({
    name: formData.get("name"),
    author: formData.get("author"),
    publisher: formData.get("publisher"),
    description: formData.get("description"),
    category: formData.get("category"),
    year_published: formData.get("year_published"),
    stock: Number(formData.get("stock")),
  });

  const file = formData.get("image");
  let imagePath = formData.get("currentImage") || null;
  if (file && file.size > 0) imagePath = await uploadFile(file);

  await pool.execute(
    "UPDATE books SET name=?, author=?, publisher=?, description=?, category=?, year_published=?, stock=?, image=? WHERE book_id=?",
    [
      data.name,
      data.author,
      data.publisher,
      data.description,
      data.category,
      data.year_published,
      data.stock,
      imagePath,
      id,
    ]
  );

  revalidatePath("/dashboard");
}

export async function deleteBook(id) {
  await pool.execute("DELETE FROM books WHERE book_id=?", [id]);
  revalidatePath("/dashboard");
}

export async function getBookById(id) {
  const [rows] = await pool.execute(
    "SELECT * FROM books WHERE book_id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

/* BORROW MANAGEMENT */
export async function getAllBorrows() {
  const [rows] = await pool.execute(`
    SELECT b.borrow_id, b.user_id, u.username, u.image as user_image, 
      bo.name AS book_name, bo.image AS book_image,
      DATE_FORMAT(b.borrow_date, '%Y-%m-%d') as borrow_date,
      DATE_FORMAT(b.due_date, '%Y-%m-%d') as due_date,
      DATE_FORMAT(b.return_date, '%Y-%m-%d') as return_date,
      b.status, b.fine
    FROM borrows b
    JOIN users u ON b.user_id = u.user_id
    JOIN books bo ON b.book_id = bo.book_id
    ORDER BY b.borrow_id DESC
  `);
  return rows;
}

export async function getUserBorrows(userId) {
  const [rows] = await pool.execute(
    `
    SELECT b.borrow_id, b.book_id, bo.name AS book_name, bo.image AS book_image,
      bo.author, bo.publisher, bo.category,
      DATE_FORMAT(b.borrow_date, '%Y-%m-%d') as borrow_date,
      DATE_FORMAT(b.due_date, '%Y-%m-%d') as due_date,
      DATE_FORMAT(b.return_date, '%Y-%m-%d') as return_date,
      b.status, b.fine
    FROM borrows b
    JOIN books bo ON b.book_id = bo.book_id
    WHERE b.user_id = ?
    ORDER BY b.borrow_id DESC
  `,
    [userId]
  );
  return rows;
}

export async function borrowBook(userId, bookId) {
  const [[book]] = await pool.execute(
    "SELECT name, stock FROM books WHERE book_id = ?",
    [bookId]
  );
  if (!book || book.stock <= 0)
    return { success: false, message: "Book not available" };

  const [[user]] = await pool.execute(
    "SELECT username FROM users WHERE user_id = ?",
    [userId]
  );

  await pool.execute(
    `INSERT INTO borrows (user_id, book_id, borrow_date, due_date, status, fine) 
     VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), 'pending', 0)`,
    [userId, bookId]
  );

  // Notify user
  await createNotification(
    userId,
    `Your borrow request for "${book.name}" is pending approval.`,
    "borrow"
  );

  // Notify ALL admins about new borrow request
  await notifyAdminsAboutBorrow(user.username, book.name, userId);

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateBorrowStatus(borrowId, newStatus) {
  const [[borrow]] = await pool.execute(
    `
    SELECT b.user_id, b.borrow_date, b.due_date, b.book_id, b.status as currentStatus,
           bo.name as book_name, bo.stock, u.username
    FROM borrows b 
    JOIN books bo ON b.book_id = bo.book_id 
    JOIN users u ON b.user_id = u.user_id
    WHERE b.borrow_id = ?
  `,
    [borrowId]
  );

  if (!borrow) return { success: false, message: "Borrow not found" };

  if (newStatus === "rejected") {
    await pool.execute("UPDATE borrows SET status=? WHERE borrow_id=?", [
      newStatus,
      borrowId,
    ]);

    await createNotification(
      borrow.user_id,
      `Your borrow request for "${borrow.book_name}" has been rejected.`,
      "borrow"
    );

    await notifyAdmins(
      `Borrow rejected: ${borrow.username}'s request for "${borrow.book_name}" was rejected`,
      "admin_alert",
      borrow.user_id
    );

    revalidatePath("/dashboard");
    return { success: true };
  }

  if (newStatus === "progress") {
    if (borrow.stock <= 0) {
      return { success: false, message: "Book no longer available" };
    }

    // Decrease stock when approving
    await pool.execute("UPDATE books SET stock = stock - 1 WHERE book_id = ?", [
      borrow.book_id,
    ]);

    await pool.execute("UPDATE borrows SET status=? WHERE borrow_id=?", [
      newStatus,
      borrowId,
    ]);

    const dueDate = new Date(borrow.due_date);
    const formattedDue = dueDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    await createNotification(
      borrow.user_id,
      `Your borrow request for "${borrow.book_name}" has been approved! Due date: ${formattedDue}`,
      "borrow"
    );

    await notifyAdmins(
      `Borrow approved: ${borrow.username}'s request for "${borrow.book_name}" was approved`,
      "admin_alert",
      borrow.user_id
    );

    revalidatePath("/dashboard");
    return { success: true };
  }

  if (newStatus === "closed") {
    const today = new Date();
    const due = new Date(borrow.due_date);
    let fine = 0;

    if (today > due) {
      const daysLate = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
      fine = daysLate * 1000;
    }

    await pool.execute(
      "UPDATE borrows SET status=?, return_date=NOW(), fine=? WHERE borrow_id=?",
      [newStatus, fine, borrowId]
    );

    // Return stock when book is returned
    await pool.execute("UPDATE books SET stock = stock + 1 WHERE book_id = ?", [
      borrow.book_id,
    ]);

    if (fine > 0) {
      await createNotification(
        borrow.user_id,
        `Your borrow for "${
          borrow.book_name
        }" is closed. Fine: Rp ${fine.toLocaleString()} for late return.`,
        "fine"
      );
    } else {
      await createNotification(
        borrow.user_id,
        `Your borrow for "${borrow.book_name}" has been closed. Thank you for returning on time!`,
        "return"
      );
    }

    await notifyAdmins(
      `Book returned: ${borrow.username} returned "${borrow.book_name}"${
        fine > 0 ? ` (Fine: Rp ${fine.toLocaleString()})` : ""
      }`,
      "admin_alert",
      borrow.user_id
    );

    revalidatePath("/dashboard");
    return { success: true, fine };
  }

  await pool.execute("UPDATE borrows SET status=? WHERE borrow_id=?", [
    newStatus,
    borrowId,
  ]);

  revalidatePath("/dashboard");
  return { success: true };
}

/* ADMIN NOTIFICATIONS */
async function notifyAdminsAboutBorrow(
  username,
  bookName,
  excludeUserId = null
) {
  const [admins] = await pool.execute(
    "SELECT user_id FROM users WHERE role = 'admin'"
  );

  for (const admin of admins) {
    if (admin.user_id !== excludeUserId) {
      await createNotification(
        admin.user_id,
        `📚 New borrow request: ${username} wants to borrow "${bookName}"`,
        "admin_alert"
      );
    }
  }
}

async function notifyAdmins(
  message,
  type = "admin_alert",
  excludeUserId = null
) {
  const [admins] = await pool.execute(
    "SELECT user_id FROM users WHERE role = 'admin'"
  );

  for (const admin of admins) {
    if (admin.user_id !== excludeUserId) {
      await createNotification(admin.user_id, message, type);
    }
  }
}

/* USER PROFILE */
export async function updateUserProfile(userId, formData) {
  const data = userProfileSchema.parse({ username: formData.get("username") });

  const file = formData.get("image");
  let imagePath = formData.get("currentImage") || null;
  if (file && file.size > 0) imagePath = await uploadFile(file);

  await pool.execute("UPDATE users SET username=?, image=? WHERE user_id=?", [
    data.username,
    imagePath,
    userId,
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/profile");
  revalidatePath("/home");

  return { success: true, username: data.username, image: imagePath };
}

/* BOOKMARK SYSTEM */
export async function addBookmark(userId, bookId) {
  const [[book]] = await pool.execute(
    "SELECT name FROM books WHERE book_id = ?",
    [bookId]
  );
  await pool.execute(
    `INSERT IGNORE INTO bookmarks (user_id, book_id, created_at) VALUES (?, ?, NOW())`,
    [userId, bookId]
  );
  await createNotification(
    userId,
    `"${book.name}" has been added to your bookmarks.`,
    "bookmark"
  );
  revalidatePath("/bookmarks");
  return { success: true };
}

export async function removeBookmark(userId, bookId) {
  await pool.execute(
    `DELETE FROM bookmarks WHERE user_id = ? AND book_id = ?`,
    [userId, bookId]
  );
  revalidatePath("/bookmarks");
  return { success: true };
}

export async function getBookmarks(userId) {
  const [rows] = await pool.execute(
    `
    SELECT b.*, bm.created_at as bookmarked_at
    FROM bookmarks bm JOIN books b ON bm.book_id = b.book_id
    WHERE bm.user_id = ? ORDER BY bm.created_at DESC
  `,
    [userId]
  );
  return rows;
}

export async function isBookmarked(userId, bookId) {
  const [rows] = await pool.execute(
    `SELECT * FROM bookmarks WHERE user_id = ? AND book_id = ?`,
    [userId, bookId]
  );
  return rows.length > 0;
}

/* NOTIFICATION SYSTEM */
export async function createNotification(userId, message, type = "general") {
  await pool.execute(
    "INSERT INTO notifications (user_id, message, type, is_read, created_at) VALUES (?, ?, ?, FALSE, NOW())",
    [userId, message, type]
  );
  revalidatePath("/dashboard");
  revalidatePath("/notifications");
}

export async function getNotifications(userId) {
  const [rows] = await pool.execute(
    `
    SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
  `,
    [userId]
  );
  return rows;
}

export async function getUnreadNotificationCount(userId) {
  const [[result]] = await pool.execute(
    "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE",
    [userId]
  );
  return result.count;
}

export async function markNotificationRead(id) {
  await pool.execute(
    "UPDATE notifications SET is_read = TRUE WHERE notification_id = ?",
    [id]
  );
  revalidatePath("/dashboard");
  revalidatePath("/notifications");
}

export async function markAllNotificationsRead(userId) {
  await pool.execute(
    "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
    [userId]
  );
  revalidatePath("/dashboard");
  revalidatePath("/notifications");
}

export async function deleteNotification(id) {
  await pool.execute("DELETE FROM notifications WHERE notification_id = ?", [
    id,
  ]);
  revalidatePath("/dashboard");
  revalidatePath("/notifications");
}

/* EXPORT BORROWS TO EXCEL */
export async function getBorrowsForExport() {
  const [rows] = await pool.execute(`
    SELECT 
      b.borrow_id as 'Borrow ID',
      u.username as 'Username',
      bo.name AS 'Book Name',
      bo.author as 'Author',
      DATE_FORMAT(b.borrow_date, '%Y-%m-%d') as 'Borrow Date',
      DATE_FORMAT(b.due_date, '%Y-%m-%d') as 'Due Date',
      DATE_FORMAT(b.return_date, '%Y-%m-%d') as 'Return Date',
      b.status as 'Status',
      CONCAT('Rp ', FORMAT(b.fine, 0)) as 'Fine'
    FROM borrows b
    JOIN users u ON b.user_id = u.user_id
    JOIN books bo ON b.book_id = bo.book_id
    ORDER BY b.borrow_id DESC
  `);
  return rows;
}
