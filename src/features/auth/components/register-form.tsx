import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { RouterLink } from "@/components/ui/link";
import { toast } from "@/components/ui/toast/use-toast";
import { paths } from "@/config/paths";
import { registerSchema, useRegister } from "@/lib/auth";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [apiErrors, setApiErrors] = React.useState<Record<string, string[]>>({
    name: [],
    email: [],
    password: [],
  });
  const r = useRegister({
    onSuccess: () => {
      setApiErrors({});
      toast({
        title: t("register.success"),
        description: t("register.registered"),
        type: "success",
      })
      navigate(paths.login.root);
    },
    onError: (e: any) => {
      setApiErrors(e.response?.data?.errors);
    },
  });

  return (
    <Form
      onSubmit={(values) => {
        r.mutate(values);
      }}
      schema={registerSchema}
      className="space-y-4"
    >
      {({ register, formState }) => (
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-1">
            <label htmlFor="name_ar" className="text-sm font-bold">
              {t("user.name.label.ar")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="name_ar"
              type="text"
              placeholder={t("user.name.placeholder.ar")}
              error={
                formState.errors.name?.ar &&
                t(`${formState.errors.name?.ar?.message}`)
              }
              registration={register("name.ar")}
              className="focus:ring-2 focus:ring-primary  focus:border-primary"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="name_fr" className="text-sm font-bold">
              {t("user.name.label.fr")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="name_fr"
              type="text"
              placeholder={t("user.name.placeholder.fr")}
              error={
                formState.errors.name?.fr &&
                t(`${formState.errors.name?.fr?.message}`)
              }
              registration={register("name.fr")}
              className="focus:ring-2 focus:ring-primary  focus:border-primary"
            />
          </div>

          <div className="col-span-1">
            <label htmlFor="email" className="text-sm font-bold">
              {t("user.email.label")}{" "}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="email"
              type="text"
              placeholder={t("user.email.placeholder")}
              error={
                (formState.errors.email &&
                  t(`${formState.errors.email.message}`)) ||
              apiErrors?.email?.[0]
              }
              registration={register("email")}
              className="focus:ring-2 focus:ring-primary  focus:border-primary"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="phone" className="text-sm font-bold">
              {t("user.phone.label")}
            </label>
            <Input
              id="phone"
              type="text"
              placeholder={t("user.phone.placeholder")}
              error={
                formState.errors.phone && t(`${formState.errors.phone.message}`)
              }
              registration={register("phone")}
              className="focus:ring-2 focus:ring-primary  focus:border-primary"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="password" className="text-sm font-bold">
              {t("user.password.label")}
              <span className="text-destructive">*</span>
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t("user.password.placeholder")}
              error={
                formState.errors["password"] &&
                t(`${formState.errors["password"].message}`)
              }
              registration={register("password")}
              className="focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="col-span-2 my-5 flex flex-col">
            <Button
              className=" font-medium py-2 rounded-sm text-primary-foreground w-full flex items-center justify-center"
              isLoading={r.isPending}
              type="submit"
            >
              {r.isPending ? t("register.loading") : t("register.submit")}
            </Button>
            <RouterLink
              to={paths.login.root}
              className="text-sm font-medium self-end text-primary/90 hover:text-primary mt-3"
            >
              {t("login.link")}
            </RouterLink>
          </div>
        </div>
      )}
    </Form>
  );
};
