import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { loginSchema, useLogin } from "@/lib/auth";
import { useTranslation } from "react-i18next";

type LoginFormProps = {
  onSuccess: () => void;
  onError: (err: any) => void;
};
export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const { t } = useTranslation();
  const login = useLogin({
    onSuccess,
    onError,
  });

  return (
    <Form
      onSubmit={(values) => {
        login.mutate(values);
      }}
      schema={loginSchema}
      className="space-y-4"
    >
      {({ register, formState }) => (
        <>
          <div>
            <label htmlFor="email" className="text-sm font-bold">
              {t("login.email.label")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="email"
              type="text"
              placeholder={t("login.email.placeholder")}
              error={
                formState.errors["email"] &&
                t(`${formState.errors["email"].message}`)
              }
              registration={register("email")}
              className="focus:ring-2 focus:ring-primary  focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-bold">
              {t("login.password.label")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t("login.password.placeholder")}
              error={
                formState.errors["password"] &&
                t(`${formState.errors["password"].message}`)
              }
              registration={register("password")}
              className="focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Button
              className=" font-medium  text-primary-foreground w-full flex items-center justify-center"
              isLoading={login.isPending}
              type="submit"
            >
              {login.isPending ? t("login.loading") : t("login.submit")}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};
