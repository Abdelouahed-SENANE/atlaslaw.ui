import { AuthLayout } from "@/components/layouts/_auth-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast/use-toast";
import { LoginForm } from "@/features/auth/components/login-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const redirectTo = searchParams.get("redirectTo");
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Card className=" min-w-sm">
        <CardHeader className="flex items-center pt-4 flex-col">
          <div>
            <img src="/assets/logo-sm.png" className="size-9" />
          </div>
          <CardTitle>{t("login.title")}</CardTitle>
          <CardDescription>{t("login.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            onError={(err: any) => {
              const message = err.response.data.message;
              toast({
                title: t("login.failed"),
                description: message,
                type: "error",
              });
            }}
            onSuccess={() => {
              toast({
                title: t("login.success"),
                description: t("login.authenticated"),
                type: "success",
              });
              navigate(redirectTo ? redirectTo : "/");
            }}
          />
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
