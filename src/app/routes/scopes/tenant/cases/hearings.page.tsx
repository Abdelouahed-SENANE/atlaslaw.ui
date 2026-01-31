import { DashLayout } from "@/components/layouts/_dash-layout";
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
import i18n from "@/config/i18n";
import { paths } from "@/config/paths";
import { useCreateHearing } from "@/features/case/api/create-hearing";
import { useHearings } from "@/features/case/api/list-hearings";
import { ExportHearing } from "@/features/case/components/export-hearing";
import { HearingActiveFilters } from "@/features/case/components/hearing-active.filter";
import { HearingFilter } from "@/features/case/components/hearing.filter";
import {
  HearingForm,
  HearingFormInputs,
} from "@/features/case/components/hearing.form";
import { HearingTable } from "@/features/case/components/hearing.table";
import { HearingCriteria, HearingView } from "@/features/case/types/case.type";
import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Lang } from "@/types/api";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const HearingsPage = () => {
  const { t } = useTranslation();
  const lang = i18n.language;
  const { hasPermission } = useAuthorization();
  const [hearingFilter, setHearingFilter] = useState<HearingCriteria>({
    hearing_date: undefined,
    next_hearing_at: undefined,
    category_id: undefined,
    court_ids: undefined,
  });
  const table = useQueryTable<HearingView>();
  const hearingsQuery = useHearings({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
      ...hearingFilter,
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
      onError: (err: any) => {
        if (err.response.status !== 422) {
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
  };

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
              <ExportHearing hearingFilter={hearingFilter} />
              <HearingFilter
                criteria={hearingFilter}
                onCriteriaChange={setHearingFilter}
              />
              {hasPermission({
                permission: PermissionCode.CREATE_HEARINGS,
              }) && (
                <HearingForm
                  mode="create"
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
          <HearingActiveFilters
            criteria={hearingFilter}
            lang={lang as Lang}
            t={t}
            onChange={setHearingFilter}
          />

          <CardContent className="p-0 space-y-2">
            <HearingTable
              hearings={items}
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
