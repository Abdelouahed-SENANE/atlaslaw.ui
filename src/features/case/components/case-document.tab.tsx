import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/components/ui/toast/use-toast";
import {
  UploadFilesInputs,
  useUplaodFiles,
} from "@/features/files/api/upload-file";
import { FileForm } from "@/features/files/components/file.form";
import { FileList } from "@/features/files/components/file.list";
import { Upload } from "lucide-react";

type Props = {
  caseId: string;
};

export const CaseDocumentTab = ({ caseId }: Props) => {

  const uploadFiles = useUplaodFiles({
    owner_id: caseId,
    owner_type: "case",
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: "Case Document Uploaded",
          description: "Case Document Uploaded Successfully",
          type: "success",
        });
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });

  const handleOnSubmit = (values: UploadFilesInputs) => {
    uploadFiles.mutate({
      payload: values,
    });
  };
  return (
    <Card className="p-2">
      <CardHeader className="flex items-center p-2 justify-between ">
        <div>
          <h1 className="flex items-center text-xl font-semibold gap-2">
            Upload Case Documents
          </h1>
          <p>Upload case documents here</p>
        </div>
        <FileForm
          ownerId={caseId}
          ownerType={"case"}
          triggerButton={
            <Button className="flex items-center gap-1">
              <span>
                <Upload className="size-4" />
              </span>
              Upload Document
            </Button>
          }
          onSubmit={handleOnSubmit}
          isDone={uploadFiles.isSuccess}
          isLoading={uploadFiles.isPending}
          onClose={() => {}}
        />
      </CardHeader>
      <CardContent className="p-2">
        <FileList
          ownerId={caseId}
          ownerType={'case'}
        />
      </CardContent>
    </Card>
  );
};
