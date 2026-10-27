/* SINH TỰ ĐỘNG từ components/Comp_Toast.mdx — không sửa tay, chạy make package */

import { toast } from "sonner"

export const Comp_Toast = {
  success: (t: string, d?: string) => toast.success(t, { description: d }),
  sending: (t: string, d?: string) => toast(t, { description: d, icon: <Spinner /> }),
  error: (t: string, d?: string) => toast.error(t, { description: d }),
}
