import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useCreateProcedure } from "../api/create-procedure";
import { ProcedureForm } from "./procedure.form";
import { toast } from "@/components/ui/toast/use-toast";
import { useProcedures } from "../api/list-procedures";
type Props = {
  prefix: string;
  caseId: string;
};
export const CaseProceduresTab = ({ prefix, caseId }: Props) => {
  const { t } = useTranslation();
  const proceduresQuery = useProcedures({
    caseId,
  });
  const items = proceduresQuery.data?.data?.items ?? [];
  const pagination = proceduresQuery.data?.data?.pagination;

  console.log(items);
  

  const createProcedure = useCreateProcedure({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("procedures.toast.created_title"),
          description: t("procedures.toast.created_desc"),
          type: "success",
        });
      },

      onError: (error: any) => {
          if (error.response.status  !== 422) {
            toast({
              title: t("procedures.toast.error_create_title"),
              description: error.response.data.message,
              type: "error",
            });
          }
      }
    },
  });

  const handleOnsubmit = (values: any) => {
    createProcedure.mutate({
      caseId,
      payload: values,
    });
  };
  return (
    <div className="grid grid-cols-3 gap-4">
      <ProcedureForm
        isDone={createProcedure.isSuccess}
        isLoading={createProcedure.isPending}
        onSubmit={handleOnsubmit}
        prefix={prefix}
        title={t("procedures.form.create")}
        triggerButton={<Button>{t("procedures.actions.add")}</Button>}
      />
    </div>
  );
};
