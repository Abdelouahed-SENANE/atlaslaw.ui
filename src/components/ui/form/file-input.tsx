import * as React from "react";
import imageCompression from "browser-image-compression";
import { type UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";
import { cn } from "@/lib/utils";
import { UploadCloud, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Props                                                              */
/* ------------------------------------------------------------------ */
export type FileInputProps = FieldWrapperPassThroughProps & {
  registration?: Partial<UseFormRegisterReturn>;
  onFileSelect?: (file: File | null) => void;
  compress?: boolean;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
};

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      label,
      error,
      registration,
      onFileSelect,
      compress = true,
      maxSizeMB = 1,
      accept = "image/*",
      className,
      ...props
    },
    ref
  ) => {
    const [preview, setPreview] = React.useState<string | null>(null);
    const [fileName, setFileName] = React.useState<string | null>(null);
    const [isCompressing, setIsCompressing] = React.useState(false);

    /* -------------------------------------------------------------- */
    /* Handle File Selection                                          */
    /* -------------------------------------------------------------- */
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        let finalFile = file;

        if (compress && file.type.startsWith("image/")) {
          setIsCompressing(true);
          const compressed = await imageCompression(file, {
            maxSizeMB,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
          });
          finalFile = compressed;
        }
        const url = URL.createObjectURL(finalFile);
        setPreview(url);
        setFileName(finalFile.name);
        onFileSelect?.(finalFile);
      } catch (err) {
        console.error("Compression failed:", err);
        onFileSelect?.(file);
      } finally {
        setIsCompressing(false);
      }
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      setPreview(null);
      setFileName(null);
      onFileSelect?.(null);
    };

    return (
      <FieldWrapper label={label} error={error}>
        <div
          className={cn(
            "relative border-1 border-dashed rounded-sm bg-card p-3 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:ring-[3px] hover:ring-primary/50 transition-colors",
            className
          )}
        >
          <input
            type="file"
            accept={accept}
            className="absolute inset-0 opacity-0 cursor-pointer"
            ref={ref}
            {...registration}
            {...props}
            onChange={handleFileChange}
          />

          {/* Preview / Placeholder */}
          {preview ? (
            <div className="relative w-full flex flex-col items-center space-y-2">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded-md object-contain border border-border"
              />
              <div className="flex items-center justify-between w-full text-xs text-foreground/70">
                <span className="truncate">{fileName}</span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center gap-1 text-danger hover:text-danger/80"
                >
                  <X className="size-3.5" /> Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-foreground/70">
              <UploadCloud className="w-6 h-6 mb-2 text-primary" />
              <p className="text-sm">
                {isCompressing ? "Compressing image..." : "Click or drag to upload"}
              </p>
              <p className="text-xs text-foreground/50">PNG, JPG, or PDF up to {maxSizeMB}MB</p>
            </div>
          )}
        </div>
      </FieldWrapper>
    );
  }
);

FileInput.displayName = "FileInput";
