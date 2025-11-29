import { AuthLayout } from "@/components/layouts/_auth-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useTranslation } from "react-i18next";

const RegisterPage = () => {
  const { t } = useTranslation();

  return (
    <AuthLayout>
      <Card className=" min-w-sm">
        <CardHeader className="flex items-center pt-4 flex-col">
          <div>
            <img src="/assets/logo-sm.png" className="size-9" />
          </div>
          <CardTitle>{t("register.title")}</CardTitle>
          <CardDescription>{t("register.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default RegisterPage;
