import { getUserByEmail } from "@/lib/action";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOption = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        // 1. unboxing data email & password
        const email = credentials.email;
        const password = credentials.password;

        // 2. cari user berdasarkan emailnya
        const user = await getUserByEmail(email);
        if (!user) return null;

        // 3. mengcompare password
        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        // 4. return user ke session
        return {
          id: user.user_id.toString(),
          name: user.username,
          email: user.email,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Tambahkan role ke token jika user ada (saat login)
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Tambahkan role ke session dari token
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
};


const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
