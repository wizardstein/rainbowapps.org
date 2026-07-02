import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/** Google sign-in with a one-person allowlist: only ADMIN_EMAIL gets a
 *  session. Everyone else is refused at the signIn callback, before any
 *  session exists. JWT sessions — nothing stored in a database. */
export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    signIn({ user }) {
      return Boolean(
        process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL,
      );
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});

/** Server-side gate used by the admin layout and re-checked inside every
 *  admin server action (defense in depth). Returns null when not allowed. */
export async function requireAdmin() {
  if (!process.env.ADMIN_EMAIL) return null;
  const session = await auth();
  if (session?.user?.email !== process.env.ADMIN_EMAIL) return null;
  return session;
}
