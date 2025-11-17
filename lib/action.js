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
  year_published: z
    .string()
    .regex(/^\d{4}$/, "Tahun harus 4 digit")
    .nullable()
    .optional(),
  stock: z.number().int().nonnegative().default(0),
});

const borrowSchema = z.object({
  user_id: z.number().int(),
  book_id: z.number().int(),
  borrow_date: z.string().optional(),
  return_date: z.string().nullable().optional(),
  status: z.enum(["pending", "progress", "closed"]).default("pending"),
});

const userProfileSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
});

/* USER MANAGEMENT */

// Create user
export async function createUser(formData) {
  const data = userSchema.parse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  const file = formData.get("image");
  let imagePath = null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);
    imagePath = `/uploads/${filename}`;
  }

  const hashed = data.password
    ? bcrypt.hashSync(data.password)
    : bcrypt.hashSync("default123");

  await pool.execute(
    "INSERT INTO users (username, email, password, role, image) VALUES (?, ?, ?, ?, ?)",
    [data.username, data.email, hashed, data.role, imagePath]
  );

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Read all users
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


// Update user
export async function updateUser(id, formData) {
  const data = userSchema.partial().parse({
    username: formData.get("username"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  const file = formData.get("image");
  let imagePath = formData.get("currentImage") || null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);
    imagePath = `/uploads/${filename}`;
  }

  await pool.execute(
    "UPDATE users SET username=?, email=?, role=?, image=? WHERE user_id=?",
    [data.username, data.email, data.role, imagePath, id]
  );

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Delete user
export async function deleteUser(id) {
  await pool.execute("DELETE FROM users WHERE user_id=?", [id]);
  revalidatePath("/dashboard");
}

/* BOOK MANAGEMENT */

// Create book
export async function createBook(formData) {
  const data = bookSchema.parse({
    name: formData.get("name"),
    author: formData.get("author"),
    publisher: formData.get("publisher"),
    year_published: formData.get("year_published"),
    stock: Number(formData.get("stock")) || 0,
  });

  const file = formData.get("image");
  let imagePath = null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);
    imagePath = `/uploads/${filename}`;
  }

  await pool.execute(
    "INSERT INTO books (name, author, publisher, year_published, stock, image) VALUES (?, ?, ?, ?, ?, ?)",
    [
      data.name,
      data.author,
      data.publisher,
      data.year_published,
      data.stock,
      imagePath,
    ]
  );

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Read all books
export async function getBooks() {
  const [rows] = await pool.execute(
    "SELECT * FROM books ORDER BY book_id DESC"
  );
  return rows;
}

// Update book
export async function updateBook(id, formData) {
  const data = bookSchema.partial().parse({
    name: formData.get("name"),
    author: formData.get("author"),
    publisher: formData.get("publisher"),
    year_published: formData.get("year_published"),
    stock: Number(formData.get("stock")),
  });

  const file = formData.get("image");
  let imagePath = formData.get("currentImage") || null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);
    imagePath = `/uploads/${filename}`;
  }

  await pool.execute(
    "UPDATE books SET name=?, author=?, publisher=?, year_published=?, stock=?, image=? WHERE book_id=?",
    [
      data.name,
      data.author,
      data.publisher,
      data.year_published,
      data.stock,
      imagePath,
      id,
    ]
  );

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

// Delete book
export async function deleteBook(id) {
  await pool.execute("DELETE FROM books WHERE book_id=?", [id]);
  revalidatePath("/dashboard/books");
}

/* BORROW MANAGEMENT */

export async function getAllBorrows() {
  const [rows] = await pool.execute(`
    SELECT b.borrow_id, u.username, bo.name AS book_name, b.borrow_date, b.return_date, b.status
    FROM borrows b
    JOIN users u ON b.user_id = u.user_id
    JOIN books bo ON b.book_id = bo.book_id
    ORDER BY b.borrow_id DESC
  `);
  return rows;
}

export async function updateBorrowStatus(id, status) {
  const parsed = borrowSchema.pick({ status: true }).parse({ status });
  await pool.execute("UPDATE borrows SET status=? WHERE borrow_id=?", [
    parsed.status,
    id,
  ]);
  revalidatePath("/dashboard");
}

/* USER PROFILE */

export async function updateUserProfile(userId, formData) {
  const data = userProfileSchema.parse({
    username: formData.get("username"),
    email: formData.get("email"),
  });

  const file = formData.get("image");
  let imagePath = formData.get("currentImage") || null;

  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await writeFile(path.join(uploadDir, filename), buffer);
    imagePath = `/uploads/${filename}`;
  }

  await pool.execute(
    "UPDATE users SET username=?, email=?, image=? WHERE user_id=?",
    [data.username, data.email, imagePath, userId]
  );

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
