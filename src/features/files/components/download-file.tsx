import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast/use-toast";
import { Download } from "lucide-react";
import { useCallback } from "react";
import { useDownloadFile } from "../api/download-file";

export const DownloadFile = ({ id }: { id: string }) => {
  const downloadFile = useDownloadFile({
    mutationConfig : {
        onSuccess: () => {
            toast({
                title: "File Downloaded",
                description: "File Downloaded Successfully",
                type: "success",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                type: "error",
            });
        }
    }
  });

  const handleDownload = useCallback(async () => {
    const res = await downloadFile.mutateAsync({ id });

    if (!res) {
      toast({
        title: "Error",
        description: "File not found",
        type: "error",
      });
      return;
    }

    const disposition = res.headers?.["content-disposition"];
    const contentType = res.headers?.["content-type"];

    let filename = "file";
    
    if (disposition) {
      const match = disposition.match(/filename="(.+)"/);      
      if (match) {
        filename = match[1];
      }
    }

    const blob = new Blob([res.data], {
      type: contentType ?? "application/octet-stream",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }, [downloadFile, id]);

  return (
    <Button
      onClick={handleDownload}
      size="sm"
      variant="plain"
      className="bg-primary/5 border border-primary/80 hover:bg-primary/20 hover:text-primary p-2  text-primary/80"
    >
      {downloadFile.isPending ? (
        <Spinner size="sm" />
      ) : (
        <Download className="size-4" />
      )}
    </Button>
  );
};
