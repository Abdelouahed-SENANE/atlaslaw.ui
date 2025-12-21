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
import {
  CreatePartyTypeInputs,
  useCreatePartyType,
} from "@/features/party/party-types/api/create-party-type";
import { usePartyTypess } from "@/features/party/party-types/api/list-party-types";
import { PartyTypeForm } from "@/features/party/party-types/components/party-types.form";
import { PartyTypeTable } from "@/features/party/party-types/components/party-types.table";
import { PartyType } from "@/features/party/party-types/types/party-type";

import { PermissionCode, useAuthorization } from "@/lib/authorization";
import { Logger } from "@/utils/logger";
import { Plus } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const PartyTypesPage = () => {
  const { t } = useTranslation();
  const { hasPermission } = useAuthorization();
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreatePartyTypeInputs, string[]>>
  >({});
  const table = useQueryTable<PartyType>();
  const partyTypesQuery = usePartyTypess({
    params: {
      page: table.page,
      query: table.query,
      limit: table.limit,
    },
  });

  const items = partyTypesQuery.data?.data?.items ?? [];
  const pagination = partyTypesQuery.data?.data?.pagination;
  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.party_types"),
      url: "#",
      active: true,
    },
  ];

  const createPartyType = useCreatePartyType({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("party_types.toast.created_title"),
          description: t("party_types.toast.created_desc"),
          type: "success",
        });
        setApiErrors({});
      },
      onError: (error: any) => {
        Logger.error(error);
        if (error.response.status === 422) {
          setApiErrors(error.response.data.errors);
        }

        toast({
          title: t("party_types.toast.error_title"),
          description: error.response.data.message,
          type: "error",
        });
      },
    },
  });

  const handleOnsubmit = (values: CreatePartyTypeInputs) => {
    createPartyType.mutate({ payload: values });
  };

  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("party_types.pages.list.title")}
      desc={t("party_types.pages.list.desc")}
    >
      <>
        <Card className="p-2">
          <CardHeader className="flex items-center justify-between p-0">
            <div>
              <CardTitle>{t("employees.pages.list.subtitle")}</CardTitle>
              <CardDescription className="text-sm text-card-foreground/70">
                {t("employees.pages.list.sub_desc")}
              </CardDescription>
            </div>
            <div
              data-slot="filters "
              className="flex items-center  justify-between gap-2"
            >
              <SearchInput
                className="min-w-90"
                placeholder={t("party_types.actions.search")}
                onChange={(val) => table.setQuery(val)}
                value={table.query}
                delay={600}
              />
              {hasPermission({
                permission: PermissionCode.CREATE_PARTY_TYPES,
              }) && (
                <PartyTypeForm
                  isDone={createPartyType.isSuccess}
                  mode="create"
                  isLoading={createPartyType.isPending}
                  onSubmit={(values) => handleOnsubmit(values)}
                  triggerButton={
                    <Button>
                      <Plus className="size-4" />
                      <span>{t("party_types.actions.add")}</span>
                    </Button>
                  }
                  apiErrors={apiErrors}
                />
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-2">
            <PartyTypeTable
              partyTypes={items}
              table={table}
              isLoading={partyTypesQuery.isLoading}
            />
          </CardContent>
        </Card>

        <div>
          {pagination && (
            <TablePagination
              page={pagination.page}
              total={pagination.total}
              limit={pagination.limit}
              rootUrl="/partys/types"
            />
          )}
        </div>
      </>
    </DashLayout>
  );
};
export default PartyTypesPage;
