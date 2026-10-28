import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner";
import { authProvider } from "@/server/auth/provider";
import { isLocale } from "@/i18n/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orbit",
  description: "Personal management system",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const messages = await getMessages();
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const preset = cookieStore.get("ORBIT_PRESET")?.value ?? "";
  const content =
    authProvider === "clerk" ? <ClerkProvider>{children}</ClerkProvider> : children;

  return (
    <html
      lang={isLocale(cookieLocale) ? cookieLocale : "vi"}
      data-preset={preset || undefined}
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <NextIntlClientProvider messages={messages}>
            {content}
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
