import { DashLayout } from "@/components/layouts/_dash-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SearchInput } from "@/components/ui/form";
import { TablePagination, useQueryTable } from "@/components/ui/table";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { useCreateHearing } from "@/features/case/api/create-hearing";
import { useCases } from "@/features/case/api/list-case";
import { CaseTable } from "@/features/case/components/ case.table";
import { HearingForm, HearingFormInputs } from "@/features/case/components/hearing.form";
import { CaseView } from "@/features/case/types/case.type";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { create } from "zustand";

const HearingsPage = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuthorization();

  const table = useQueryTable<CaseView>();
  const hearingsQuery = useCases({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
    },
  });

  const items = hearingsQuery.data?.data?.items ?? [];
  const pagination = hearingsQuery.data?.data?.pagination;

  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.list_hearings"),
      url: "#",
      active: true,
    },
  ];

  const createHearing = useCreateHearing({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("hearings.toast.created_title"),
          description: t("hearings.toast.created_desc"),
          type: "success",
        });
      },
      onError: (err : any) => {
        if (err.response.status  !== 422) {
          toast({
            title: t("hearings.toast.error_create_title"),
            description: err.response.data.message,
            type: "error",
          });
        }
      },
    },
  });

  const handleSubmit = (values: HearingFormInputs) => {
    createHearing.mutate({
      payload: values,
    });
  }
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("hearings.pages.list.title")}
      desc={t("hearings.pages.list.desc")}
    >
      <>
        <Card className="p-2">
          <CardHeader className="flex items-center justify-between p-0">
            <div>
              <CardTitle>{t("hearings.pages.list.subtitle")}</CardTitle>
              <CardDescription className="text-sm text-card-foreground/70">
                {t("hearings.pages.list.sub_desc")}
              </CardDescription>
            </div>
            <div
              data-slot="filters "
              className="flex items-center justify-between gap-2"
            >
              <SearchInput
                className="min-w-90"
                placeholder={t("hearings.actions.search")}
                onChange={(val) => table.setQuery(val)}
                value={table.query}
                delay={600}
              />
              {hasPermission({
                permission: PermissionCode.CREATE_HEARINGS,
              }) && (
                <HearingForm
                  mode="create"
                  title={t("hearings.actions.create")}
                  triggerButton={
                    <Button>
                      <Plus className="size-4" />
                      <span>{t("hearings.actions.add")}</span>
                    </Button>
                  }
                  isDone={createHearing.isSuccess}
                  isLoading={createHearing.isPending}
                  onSubmit={(values) => {                    
                    handleSubmit(values);
                  }}
                />
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-2">
            <CaseTable
              cases={items}
              table={table}
              isLoading={hearingsQuery.isLoading}
            />
          </CardContent>
        </Card>

        <div>
          {pagination && (
            <TablePagination
              page={pagination.page}
              total={pagination.total}
              limit={pagination.limit}
              rootUrl="/hearings"
            />
          )}
        </div>
      </>
    </DashLayout>
  );
};
export default HearingsPage;
