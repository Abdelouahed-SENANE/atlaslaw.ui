import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

type PreviewFileProps = {
  id: string;
};

export function PreviewFile({ id }: PreviewFileProps) {
  const [open, setOpen] = useState(false);

  const previewUrl = `${API_URL}/files/${id}/preview`;

  return (
    <>
      {/* Preview button */}
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        variant="plain"
        className="bg-blue-500/5 text-blue-500 border border-blue-500/80 hover:bg-blue-500/20 p-2"
      >
        <Eye className="size-4" />
      </Button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/50 backdrop-blur flex items-center justify-center">
          <div className="bg-card w-[90vw] h-[90vh] rounded-md overflow-hidden relative shadow-xl">

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute text-card-foreground top-2 right-2 z-10 rounded-full p-1 shadow"
            >
              <X className="size-4" />
            </button>

            {/* Preview */}
            <object
              data={previewUrl}
              className="w-full h-full"
            >
              {/* Fallback if browser cannot preview */}
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4">
                <p className="text-muted-foreground text-center">
                  Preview not supported for this file type.
                </p>
              </div>
            </object>

          </div>
        </div>
      )}
    </>
  );
}
