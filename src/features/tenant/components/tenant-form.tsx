import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, Input } from "@/components/ui/form";
import { RadioInput } from "@/components/ui/form/radio-input";
import { UserSelector } from "@/features/user/components/user-selector";
import { Save } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CreateTenantInputs, createTenantSchema } from "../api/create-tenant";
import { Tenant, TenantStatus } from "../types";

type Props = {
  defaultValues?: Partial<Tenant>;
  onSubmit: (values: CreateTenantInputs) => void;
  apiErrors: Partial<Record<keyof CreateTenantInputs, string[]>>;
  isLoading?: boolean;
};

export const TenantForm = ({
  defaultValues,
  onSubmit,
  apiErrors,
  isLoading,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const TENANT_STATUS = [
    {
      value: TenantStatus.ACTIVE,
      label: t("tenants.fields.status.options.active"),
    },
    {
      value: TenantStatus.SUSPENDED,
      label: t("tenants.fields.status.options.suspended"),
    },
  ];

  return (
    <Card className="rounded-sm p-5 gap-5">
      <CardContent className="p-0">
        <Form
          id="tenant-form"
          options={{
            defaultValues,
          }}
          schema={createTenantSchema}
          onSubmit={onSubmit}
        >
          {({ register, formState, control }) => (
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-1">
                <label htmlFor="name" className="text-sm font-bold">
                  {t("tenants.fields.name.label")}{" "}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t("tenants.fields.name.placeholder")}
                  error={
                    (formState.errors.name &&
                      t(`${formState.errors.name.message}`)) ||
                    apiErrors.name?.[0] ||
                    undefined
                  }
                  registration={register("name")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="slug" className="text-sm font-bold">
                  {t("tenants.fields.slug.label")}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="slug"
                  type="text"
                  placeholder={t("tenants.fields.slug.placeholder")}
                  error={
                    (formState.errors.slug &&
                      t(`${formState.errors.slug.message}`)) ||
                    apiErrors.slug?.[0] ||
                    undefined
                  }
                  registration={register("slug")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="owner_id" className="text-sm font-bold mb-2">
                  {t("tenants.fields.owner_id.label")}
                </label>
                <Controller
                  name="owner_id"
                  control={control}
                  defaultValue={defaultValues?.owner?.id}
                  render={({ field, fieldState }) => (
                    <UserSelector
                      error={
                        (fieldState.error?.message &&
                          t(fieldState.error?.message)) ||
                        apiErrors.owner_id?.[0] ||
                        undefined
                      }
                      initialUser={defaultValues?.owner}
                      placeholder={t("tenants.fields.owner_id.placeholder")}
                      val={field.value}
                      onChange={(val) => field.onChange(val)}
                    />
                  )}
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="status" className="text-sm font-bold mb-2">
                  {t("tenants.fields.status.label")}
                </label>
                <div className="flex flex-col rounded-sm mt-1">
                  <div className="flex gap-1  max-w-20">
                    {TENANT_STATUS.map((s, index) => (
                      <RadioInput
                        key={index}
                        id="status"
                        value={s.value}
                        label={t(`tenants.fields.status.options.${s.value}`)}
                        registration={register("status")}
                        className="focus:ring-2 focus:ring-primary  focus:border-primary"
                      />
                    ))}
                  </div>
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
        <Button form="tenant-form" type="submit" isLoading={isLoading}>
          <Save className="size-4 ltr:mr-1 rtl:ml-1" />
          {defaultValues
            ? t("tenants.actions.update")
            : t("tenants.actions.create")}
        </Button>
      </CardFooter>
    </Card>
  );
};
