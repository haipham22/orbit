import { SignIn } from "@clerk/nextjs";
import { getTranslations } from "next-intl/server";
import { authProvider } from "@/server/auth/provider";
import { LocalSignInForm } from "@/features/auth/components/local-sign-in-form";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("title") };
}

export default async function SignInPage() {
  const t = await getTranslations("auth");
  return (
    <main className="grid min-h-svh place-items-center bg-background p-5">
      <div className="flex w-full max-w-[400px] flex-col gap-4">
        <header className="flex flex-col items-center gap-1 text-center">
          {/* wordmark DS: "◍ orbit" — h1 ăn mono display từ CSS toàn cục */}
          <h1 className="text-[length:var(--type-size-xl)]">◍ orbit</h1>
          <p className="text-[length:var(--type-size-sm)] text-muted-foreground">{t("tagline")}</p>
        </header>
        {authProvider === "clerk" ? <SignIn /> : <LocalSignInForm />}
        <p className="text-center text-[length:var(--type-size-sm)] text-muted-foreground">{t("footer")}</p>
      </div>
    </main>
  );
}
