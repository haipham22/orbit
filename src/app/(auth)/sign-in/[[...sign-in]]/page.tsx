import { SignIn } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { authProvider } from "@/server/auth/provider";
import { LocalSignInForm } from "@/features/auth/components/local-sign-in-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("title") };
}

export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      {authProvider === "clerk" ? <SignIn /> : <LocalSignInForm />}
    </main>
  );
}
