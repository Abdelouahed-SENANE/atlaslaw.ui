import { DashLayout } from "@/components/layouts/_dash-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { paths } from "@/config/paths";
import { useClientDetails } from "@/features/client/api/client-details";
import { ClientDetailsCards } from "@/features/client/components/client-details.cards";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const ClientDetailsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { id } = useParams();
  if (!id) {
    navigate(paths.tenant.clients.list.route());
  }

  const clientQuery = useClientDetails({
    id: id!,
    queryConfig: { enabled: !!id },
  });

  const details = clientQuery.data?.data;

  const breadcrumbs = [
    {
      label: t("menu.dashboard"),
      url: paths.admin.dashboard.route(),
      active: false,
    },
    {
      label: t("menu.clients"),
      url: paths.tenant.clients.list.route(),
      active: false,
    },
    {
      label: t("clients.pages.view.title"),
      url: "#",
      active: true,
    },
  ];
  return (
    <DashLayout
      breadcrumbs={breadcrumbs}
      title={t("clients.pages.view.title")}
      desc={t("clients.pages.view.description")}
    >
      <Tabs defaultValue="info">
        <TabsList className="bg-card border border-border p-1 h-11">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="attachments">Fichiers</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          {clientQuery.isLoading ? (
            <div>Loading...</div>
          ) : (
            <ClientDetailsCards details={details!}  />
          )
          }
        </TabsContent>
        <TabsContent value="attachments">
          <div>Informations</div>
        </TabsContent>
      </Tabs>
    </DashLayout>
  );
};

export default ClientDetailsPage;
