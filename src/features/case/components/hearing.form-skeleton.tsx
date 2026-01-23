import { Skeleton } from "@/components/ui/skeleton";

export function HearingFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-9 w-full" />

      <Skeleton className="h-4 w-52" />
      <Skeleton className="h-9 w-full" />

      <Skeleton className="h-4 w-52" />
      <Skeleton className="h-9 w-full" />

      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-9 w-full" />

      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>

      <Skeleton className="h-24 w-full" />
    </div>
  );
}
