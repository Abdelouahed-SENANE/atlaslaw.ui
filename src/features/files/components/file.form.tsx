import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FileInput } from "@/components/ui/form/file-input";
import { FormModal } from "@/components/ui/form/form-modal";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { uploadFilesSchema } from "../api/upload-file";
import { normalizeFilesErrors } from "@/lib/utils";
export type FileFormProps = {
  open?: boolean;
  ownerId: string;
  ownerType: string;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  triggerButton?: React.ReactElement;
  onSubmit: (values: any) => void;
  isDone: boolean;
  isLoading?: boolean;
};

export const FileForm = ({
  triggerButton,
  onSubmit,
  isDone,
  isLoading,
  open,
  onOpenChange,
  onClose,
  ownerId,
  ownerType,
}: FileFormProps) => {
  const { t } = useTranslation();

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      title={t("files.form.title")}
      triggerButton={triggerButton}
      isDone={isDone}
      className="w-md"
      submitButton={
        <Button form="file-form" type="submit" isLoading={isLoading}>
          {t("files.form.upload")}
        </Button>
      }
    >
      <Form
        id="file-form"
        options={{
          criteriaMode: "all",
          defaultValues: {
            files: [],
            owner_type : ownerType,
            owner_id : ownerId,
          }
        }}
        onSubmit={onSubmit}
        schema={uploadFilesSchema}
      >
        {({ control }) => {
          return (
            <Controller
              name="files"
              control={control}
              render={({ field, fieldState }) => {

                const errors = normalizeFilesErrors(fieldState.error);
                return (
                  <FileInput
                    label={t("files.label")}
                    accept="application/pdf,image/*"
                    onFilesSelect={field.onChange}
                    error={errors.join(", ")}
                  />
                );
              }}
            />
          );
        }}
      </Form>
    </FormModal>
  );
};
