/* SINH TỰ ĐỘNG từ components/Comp_Toast.mdx — không sửa tay, chạy make package */

// Standalone — deps: react, sonner
import { toast } from "sonner"

const Spin = () => (
  <span aria-hidden className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
)

export const Comp_Toast = {
  success: (t: string, d?: string) => toast.success(t, { description: d }),
  sending: (t: string, d?: string) => toast(t, { description: d, icon: <Spin /> }),
  error: (t: string, d?: string) => toast.error(t, { description: d }),
}
