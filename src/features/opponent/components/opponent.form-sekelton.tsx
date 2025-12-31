import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function OpponentFormSkeleton() {
  return (
    <Card className="rounded-sm p-2 mx-2 ">
      <CardContent className="p-0 space-y-4">
        {/* ================= Base Informations ================= */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="border-b [.border-b]:pb-0  bg-background px-4 h-14 flex items-center ">
            <Skeleton className="h-4 w-40" />
          </CardHeader>

          <CardContent className="pb-4 grid grid-cols-2 gap-2">
            <div className="col-span-1 space-y-2">
              <Skeleton className=" w-40 h-3" />
              <Skeleton className=" w-full h-8" />
            </div>
            <div className="col-span-1 space-y-2">
              <Skeleton className=" w-35 h-3" />
              <Skeleton className=" w-full h-8" />
            </div>
            <div className="col-span-1 space-y-2">
              <Skeleton className=" w-45 h-3" />
              <Skeleton className=" w-full h-8" />
            </div>
            <div className="col-span-1 space-y-2">
              <Skeleton className=" w-30 h-3" />
              <Skeleton className=" w-full h-8" />
            </div>
            <div className="col-span-2 space-y-2">
              <Skeleton className=" w-25 h-3" />
              <Skeleton className="col-span-2 w-full h-12" />
            </div>
          </CardContent>
        </Card>

        {/* ================= Legal Informations ================= */}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="border-b [.border-b]:pb-0  bg-background px-4 h-14 flex items-center ">
            <Skeleton className="h-4 w-60" />
          </CardHeader>

          <CardContent className="pb-4 grid grid-cols-2 gap-2">
            <div className="col-span-1 space-y-2">
              <Skeleton className=" w-25 h-3" />
              <Skeleton className=" w-full h-8" />
            </div>
            <div className="col-span-1 space-y-2">
              <Skeleton className=" w-35 h-3" />
              <Skeleton className=" w-full h-8" />
            </div>
            <div className="col-span-1 space-y-2">
              <Skeleton className=" w-40 h-3" />
              <Skeleton className=" w-full h-8" />
            </div>
            <div className="col-span-1 space-y-2">
              <Skeleton className=" w-30 h-3" />
              <Skeleton className=" w-full h-8" />
            </div>
            <div className="col-span-2 space-y-2">
              <Skeleton className=" w-30 h-3" />
              <Skeleton className=" w-full h-10" />
            </div>
          </CardContent>
        </Card>
      </CardContent>

      {/* ================= Footer ================= */}
      <CardFooter className="flex justify-end gap-2 px-2 mt-4">
        <Skeleton className="h-9 w-24 rounded-sm" />
        <Skeleton className="h-9 w-32 rounded-sm" />
      </CardFooter>
    </Card>
  );
}
