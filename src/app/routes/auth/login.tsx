import { AuthLayout } from "@/components/layouts/_auth-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { LoginForm } from "@/features/auth/components/login-form";
import { useNavigate, useSearchParams } from "react-router";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Card className=" min-w-sm">
        <CardHeader className="flex items-center pt-4 flex-col">
          <div>
            <img src="/assets/logo-sm.png" className="size-9" />
          </div>
          <CardTitle>Let's Get Started Blogger</CardTitle>
          <CardDescription>Sign in to continue to Dastone.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm
            onError={(err: any) => {
              const message = err.response.data.message;
              toast({
                title: "Failed",
                description: message,
                type: "error",
              });
            }}
            onSuccess={() => {
              navigate(
                redirectTo ? redirectTo : paths.admin.dashboard.route(),
                {
                  replace: true,
                }
              );
              toast({
                title: "Success",
                description: "Authenticated Success",
                type: "success",
              });
            }}
          />
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default LoginPage;
