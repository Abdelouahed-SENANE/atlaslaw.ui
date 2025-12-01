import { LineChart } from "@/components/common/line-chart";
import { MetricCard } from "@/components/common/metric-card";
import { RadialChart } from "@/components/common/radial-chart";
import { DashLayout } from "@/components/layouts/_dash-layout";
import { Building, Check, Lock, Users2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const DashboardPage = () => {
  const { t } = useTranslation();
  const metrics = React.useMemo(
    () => [
      {
        title: "Users",
        icon: <Users2 className="size-5" />,
        value: 23000,
        percentage: 2.87,
        color: "#6f6af8",
      },
      {
        title: "Tenants",
        icon: <Building className="size-5" />,
        value: 300,
        percentage: -4.87,
        color: "#49b3ff",
      },
      {
        title: "Roles",
        icon: <Lock className="size-5" />,
        value: 20,
        percentage: -1.87,
        color: "#4cd97b",
      },
      {
        title: "Permissions",
        icon: <Check className="size-5" />,
        value: 20,
        percentage: -1.87,
        color: "#ffb547",
      },
    ],
    []
  );

  const series = [
    {
      name: "Users",
      type: "column",
      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
    },
    {
      name: "Tenants",
      type: "area",
      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
    },
    {
      name: "Profits",
      type: "line",
      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
    },
  ];

  const labels = [
    "2003-01-01",
    "2003-01-02",
    "2003-01-03",
    "2003-01-04",
    "2003-01-05",
    "2003-01-06",
    "2003-01-07",
    "2003-01-08",
    "2003-01-09",
    "2003-01-10",
    "2003-01-11",
  ];

  return (
    <DashLayout
      title={t("dashboard.page.title")}
      desc={t("dashboard.page.desc")}
    >
      <div className="grid grid-cols-8 gap-2">
        {metrics.map((metric) => (
          <MetricCard className="col-span-2" key={metric.title} {...metric} />
        ))}
        <LineChart
          title="Users Growth"
          className="col-span-4"
          series={series}
          labels={labels}
        />
        <RadialChart
          className="col-span-2"
          title="Tenants Statistics"
          series={[44, 55, 67, 83]}
          labels={["Delivered", "Cancelled", "Pending", "Returned"]}
          total={3736}
        />
      </div>
    </DashLayout>
  );
};
export default DashboardPage;
