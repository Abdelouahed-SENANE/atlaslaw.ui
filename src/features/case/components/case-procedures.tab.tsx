import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TablePagination, useQueryTable } from "@/components/ui/table";
import { toast } from "@/components/ui/toast/use-toast";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { useTranslation } from "react-i18next";
import { useCreateProcedure } from "../api/create-procedure";
import { useProcedures } from "../api/list-procedures";
import { ProcedureView } from "../types/case.type";
import { ProcedureForm } from "./procedure.form";
import { ProcedureTable } from "./procedure.table";
import { Plus } from "lucide-react";
type Props = {
  prefix: string;
  caseId: string;
};
export const CaseProceduresTab = ({ prefix, caseId }: Props) => {
  const { t } = useTranslation();
  const { hasPermission } = useAuthorization();
  const proceduresQuery = useProcedures({
    caseId,
  });
  const items = proceduresQuery.data?.data?.items ?? [];
  const pagination = proceduresQuery.data?.data?.pagination;

  const table = useQueryTable<ProcedureView>();
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
        if (error.response.status !== 422) {
          toast({
            title: t("procedures.toast.error_create_title"),
            description: error.response.data.message,
            type: "error",
          });
        }
      },
    },
  });

  const handleOnsubmit = (values: any) => {

    createProcedure.mutate({
      caseId,
      payload: values,
    });
  };
  return (
    <>
      <Card className="p-2">
        <CardHeader className="flex items-center justify-between p-0">
          <div>
            <CardTitle>{t("procedures.pages.list.subtitle")}</CardTitle>
            <CardDescription className="text-sm text-card-foreground/70">
              {t("procedures.pages.list.sub_desc")}
            </CardDescription>
          </div>
          <div
            data-slot="filters "
            className="flex items-center  justify-between gap-2"
          >
            {/* <SearchInput
              className="min-w-90"
              placeholder={t("procedures.actions.search")}
              onChange={(val) => table.setQuery(val)}
              value={table.query}
              delay={600}
            /> */}

            {hasPermission({
              permission: PermissionCode.CREATE_CASE,
            }) && (
              <ProcedureForm
                mode="create"
                isDone={createProcedure.isSuccess}
                isLoading={createProcedure.isPending}
                onSubmit={handleOnsubmit}
                prefix={prefix}
                title={t("procedures.form.create")}
                triggerButton={<Button> <Plus className="mr-1" />{t("procedures.actions.add")}</Button>}
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-2">
          <ProcedureTable
            prefix={prefix}
            procedures={items}
            table={table}
            isLoading={proceduresQuery.isLoading}
          />
        </CardContent>
      </Card>

      <div>
        {pagination && (
          <TablePagination
            page={pagination.page}
            total={pagination.total}
            limit={pagination.limit}
            rootUrl="/procedures"
          />
        )}
      </div>
    </>
  );
};
