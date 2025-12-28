import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { CreateOpponentInputs, useCreateOpponent } from "@/features/opponent/api/create-opponent";
import { OpponentForm } from "@/features/opponent/components/opponent.form";
import { Logger } from "@/utils/logger";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const NewOpponentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
    const [apiErrors, setApiErrors] = React.useState<
      Partial<Record<keyof CreateOpponentInputs, string[]>>
    >({});
    const createOpponent = useCreateOpponent({
      mutationConfig: {
        onSuccess: () => {
          setApiErrors({});
          toast({
            title: t("opponents.toast.created_title"),
            description: t("opponents.toast.created_desc"),
            type: "success",
          });
          navigate(-1);
        },
        onError: (error: any) => {
          Logger.error(error);
          setApiErrors(error.response.data.errors);
        },
      },
    });
  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.opponents"),
      url: paths.tenant.opponents.list.route(),
      active: false,
    },
    {
      label: t("opponents.pages.new.title"),
      url: "#",
      active: true,
    },
  ];
    const handleOnsubmit = (values: CreateOpponentInputs) => {
      createOpponent.mutate({ payload: values });
    };
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("opponents.pages.new.title")}
      desc={t("opponents.pages.new.description")}
    >
      
      <OpponentForm
        mode="create"
        onSubmit={handleOnsubmit}
        isLoading={createOpponent.isPending}
        apiErrors={apiErrors}
      />
    </DashLayout>
  );
};

export default NewOpponentPage;
