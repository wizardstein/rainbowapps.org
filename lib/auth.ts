import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/** ADMIN_EMAIL holds one or more comma-separated addresses. */
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

/** Google sign-in with a small allowlist: only addresses in ADMIN_EMAIL get a
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
      return Boolean(user.email && adminEmails().includes(user.email));
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
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !adminEmails().includes(email)) return null;
  return session;
}
