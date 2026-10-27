import { SignIn } from "@clerk/nextjs";
import { authProvider } from "@/server/auth/provider";
import { LocalSignInForm } from "@/features/auth/components/local-sign-in-form";

export const metadata = { title: "Đăng nhập — orbit" };

export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      {authProvider === "clerk" ? <SignIn /> : <LocalSignInForm />}
    </main>
  );
}
