"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" className="justify-start px-2" onClick={onLogout}>
      Đăng xuất
    </Button>
  );
}
