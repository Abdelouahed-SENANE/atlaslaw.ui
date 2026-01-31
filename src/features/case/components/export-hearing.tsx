import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast/use-toast";
import { Download } from "lucide-react";
import { useCallback } from "react";
import { useExportHearings } from "../api/export-hearings";
import { HearingCriteria } from "../types/case.type";

type ExportHearingProps = {
    hearingFilter: HearingCriteria;
}
export const ExportHearing = ({ hearingFilter }: ExportHearingProps) => {
  const exportHearings = useExportHearings({
    mutationConfig : {
        onSuccess: () => {
            toast({
                title: "Exported",
                description: "File Exported Successfully",
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
    const res = await exportHearings.mutateAsync(hearingFilter);

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
  }, [exportHearings, hearingFilter]);

  return (
    <Button
      onClick={handleDownload}
      variant="plain"
      className="bg-emerald-600 hover:bg-emerald-800   text-white rounded-xs"
    >
      {exportHearings.isPending ? (
        <>
        <Spinner size="sm" variant="light" /> <span className="ml-1">Exporting...</span>
        </>
      ) : (
        <>
        <Download className="size-4" /> <span>Export Audiences</span>
        </>
      )}
    </Button>
  );
};
