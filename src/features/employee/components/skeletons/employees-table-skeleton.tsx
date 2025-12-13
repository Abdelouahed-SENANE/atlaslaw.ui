import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableElement,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const EmployeesTableSkeleton = () => {
  return (
    <div className="">
      {/* Breadcrumb + Title area */}
      <Card className="p-2">
        <CardHeader className="flex items-center justify-between p-0">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-72" /> 
          </div>
        </CardHeader>

        <CardContent className="p-0  space-y-2">

          {/* Table skeleton */}
          <TableElement>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 7 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-3 w-32 bg-card/90" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-3 w-28 bg-background" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableElement>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-end">
        <Skeleton className="h-5 w-64" />
      </div>
    </div>
  );
};
