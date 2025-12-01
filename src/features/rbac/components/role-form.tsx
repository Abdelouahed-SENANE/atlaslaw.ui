import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, Input, InputError } from "@/components/ui/form";
import { RadioInput } from "@/components/ui/form/radio-input";
import { Role } from "@/types/api";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CreateRoleInputs, createRoleSchema } from "../api/create-role";

type RoleFormProps = {
  defaultValues?: Role;
  onSubmit: (values: CreateRoleInputs) => void;
  apiErrors: Partial<Record<keyof Role, string[]>>;
  isLoading?: boolean;
};

export const RoleForm = ({
  defaultValues,
  onSubmit,
  apiErrors,
  isLoading,
}: RoleFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Card className="rounded-sm p-5 gap-5">
      <CardContent className="p-0">
        <Form
          id="role-form"
          options={{ defaultValues }}
          schema={createRoleSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState }) => (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label htmlFor="name" className="text-sm font-bold">
                  {t("roles.fields.name.label")}{" "}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("roles.fields.name.placeholder")}
                  error={
                    (formState.errors.name &&
                      t(`${formState.errors.name.message}`)) ||
                    apiErrors.name?.[0]!
                  }
                  registration={register("name")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="description" className="text-sm font-bold">
                  {t("roles.fields.description.label")}
                </label>
                <Input
                  id="description"
                  type="text"
                  placeholder={t("roles.fields.description.placeholder")}
                  error={
                    (formState.errors.description &&
                      t(`${formState.errors.description.message}`)) ||
                    apiErrors.description?.[0]!
                  }
                  registration={register("description")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="scope" className="text-sm font-bold mb-2">
                  {t("roles.fields.scope.label")}
                </label>
                <div className="flex flex-col rounded-sm mt-1">
                  <div className="flex gap-1  max-w-20">
                    <RadioInput
                      id="scope"
                      value={"system"}
                      label={t("roles.fields.scope.system")}
                      registration={register("scope")}
                      className="focus:ring-2 focus:ring-primary  focus:border-primary max-w-4"
                    />
                    <RadioInput
                      id="scope"
                      value={"tenant"}
                      label={t("roles.fields.scope.tenant")}
                      registration={register("scope")}
                      className="focus:ring-2 focus:ring-primary  focus:border-primary"
                    />
                  </div>
                  {formState.errors.scope && (
                    <InputError
                      errorMessage={
                        t(`${formState.errors.scope.message}`) ||
                        apiErrors.scope?.[0]!
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 px-2 ">
        <Button onClick={() => navigate(-1)} variant={"outline"}>
          {t("cancel")}
        </Button>
        <Button form="role-form" type="submit" isLoading={isLoading}>
          <Save className="size-4 ltr:mr-1 rtl:ml-1" />
          {defaultValues ? t("roles.update") : t("roles.create")}
        </Button>
      </CardFooter>
    </Card>
  );
};
