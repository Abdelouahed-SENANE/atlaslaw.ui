import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDisclosure } from "@/hooks/use-disclosure";
import { FileImage, FileSpreadsheet, FileText, Trash2Icon } from "lucide-react";
import React from "react";
import { useFiles } from "../api/get-files";
import { FileOwnerType } from "../types/file.type";
import { DownloadFile } from "./download-file";
import { ConfirmFileDelation } from "./file.delete-dialog";
import { PreviewFile } from "./preview-file";

type Props = {
  ownerId: string;
  ownerType: FileOwnerType;
};
export const FileList = ({ ownerId, ownerType }: Props) => {
  const [id, setId] = React.useState<string | undefined>(undefined);
  const { isOpen, open, close } = useDisclosure();

  const filesQuery = useFiles({
    ownerId,
    ownerType,
  });

  const files = filesQuery.data?.data ?? [];
  const isLoading = filesQuery.isLoading;
  const FileIcon = ({ type }: { type: string }) => {
    if (type === "application/pdf") {
      return <FileText className="size-6 text-danger" />;
    }

    if (type.startsWith("image/")) {
      return <FileImage className="size-6 text-primary" />;
    }

    if (type.includes("spreadsheet") || type.includes("excel")) {
      return <FileSpreadsheet className="size-6 text-success" />;
    }

    return <FileText className="size-6 text-muted-foreground" />;
  };

  const handleSelect = (id: string) => {
    if (!id) return;
    setId(id);
    open();
  };
  const handleReset = () => {
    setId(undefined);
    close();
  };
  return (
    <>
      <ul className="grid grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, i) => (
            <li
              key={i}
              className="flex items-center gap-2 bg-background rounded-sm "
            >
              <Skeleton className="size-14 flex items-center justify-center bg-primary/10 text-primary rounded-sm"></Skeleton>
              <div className="flex-1 space-y-2">
                <Skeleton className="text-md w-45 h-3 font-semibold"></Skeleton>
                <div className="flex items-center gap-1">
                  <Skeleton className="text-xs w-20 h-2 text-foreground/90"></Skeleton>
                  <Skeleton className="text-xs w-35 h-2 text-foreground/90"></Skeleton>
                </div>
              </div>
              <div className="flex items-center p-2 gap-2">
                <Skeleton className="size-8 flex items-center justify-center bg-primary/10 text-primary rounded-sm"></Skeleton>
                <Skeleton className="size-8 flex items-center justify-center bg-primary/10 text-primary rounded-sm"></Skeleton>
              </div>
            </li>
          ))
        ) : files.length > 0 ? (
          files.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-2 bg-background rounded-sm border border-border"
            >
              <span className="size-14 flex items-center justify-center bg-foreground/10 text-primary ">
                <FileIcon type={item.type} />
              </span>
              <div className="flex-1">
                <p className="text-md font-semibold">{item.file_name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-foreground/90">{item.size}</p>
                  <p className="text-xs text-foreground/90">
                    {item.created_at}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-2 gap-2">
                <PreviewFile id={item.id} />
                <DownloadFile id={item.id} />
                <Button
                  onClick={() => handleSelect(item.id)}
                  size="sm"
                  variant="plain"
                  className="bg-danger/5 border border-danger/80 hover:bg-danger/20 hover:text-danger p-2 text-danger/80"
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="flex items-center gap-2 justify-center col-span-3 h-14 rounded-sm">
            <span className=" flex items-center justify-center bg-primary/10 text-primary rounded-sm">
              <FileText className="size-6 text-foreground" />
            </span>
            <div className="">
              <p className="text-md font-semibold">No files found</p>
            </div>
          </li>
        )}
      </ul>
      <ConfirmFileDelation
        open={isOpen}
        onOpenChange={close}
        id={id}
        onDeleted={handleReset}
      />
    </>
  );
};
