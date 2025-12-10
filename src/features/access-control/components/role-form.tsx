import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, Input } from "@/components/ui/form";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CreateRoleInputs, createRoleSchema } from "../api/create-role";
import { Role } from "../types";

type RoleFormProps = {
  defaultValues?: Partial<Role>;
  onSubmit: (values: CreateRoleInputs) => void;
  apiErrors: Partial<Record<keyof CreateRoleInputs, string[]>>;
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
          options={{
            defaultValues: {
              name: defaultValues?.name ?? "",
              description: defaultValues?.description ?? "",
            },
          }}
          schema={createRoleSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState }) => (
            <div className="grid grid-cols-2 gap-2">
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
