import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-slate-100/5 shimmer shimmer-bg shimmer-speed-400 shimmer-duration-1000 shimmer-color-slate-50/5 rounded-xs", className)}
      {...props}
    />
  )
}

export { Skeleton }
