import { DashLayout } from "@/components/layouts/_dash-layout";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { CreateOpponentInputs } from "@/features/opponent/api/create-opponent";
import { useOpponentForEdit } from "@/features/opponent/api/opponent-details-edit";
import {
  UpdateOpponentInputs,
  useUpdateOpponent,
} from "@/features/opponent/api/update-opponent";
import { OpponentForm } from "@/features/opponent/components/opponent.form";
import { OpponentFormSkeleton } from "@/features/opponent/components/opponent.form-sekelton";
import { OpponentEditView } from "@/features/opponent/types/opponent.type";

import { Logger } from "@/utils/logger";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const EditOpponentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreateOpponentInputs, string[]>>
  >({});
  const { id } = useParams();
  if (!id) {
    navigate(paths.tenant.opponents.list.route());
  }

  const opponentQuery = useOpponentForEdit({
    id: id!,
    queryConfig: { enabled: !!id },
  });
  const updateOpponent = useUpdateOpponent({
    id: id!,
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("opponents.toast.updated_title"),
          description: t("opponents.toast.updated_desc"),
          type: "success",
        });
        navigate(-1);
      },
      onError: (error: any) => {
        Logger.error(error);
        if (error.response?.status === 422) {
          setApiErrors(error.response.data.errors);
        }
        toast({
          title: t("opponents.toast.error_update_title"),
          description: error.response.data.message,
          type: "error",
        });
      },
    },
  });

  const defaultValues = opponentQuery.data?.data;
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
  const handleOnsubmit = (values: UpdateOpponentInputs) => {
    updateOpponent.mutate({ id: id!, payload: values });
  };
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("opponents.pages.new.title")}
      desc={t("opponents.pages.new.description")}
    >
      {opponentQuery.isLoading ? (
        <OpponentFormSkeleton />
      ) : (
        <OpponentForm
          mode="update"
          defaultValues={defaultValues as Partial<OpponentEditView>}
          onSubmit={handleOnsubmit}
          isLoading={updateOpponent.isPending}
          apiErrors={apiErrors}
        />
      )}
    </DashLayout>
  );
};

export default EditOpponentPage;
