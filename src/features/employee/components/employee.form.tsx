import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, Input } from "@/components/ui/form";
import { DateInput } from "@/components/ui/form/date-input";
import { RadioInput } from "@/components/ui/form/radio-input";
import {  UserSelector } from "@/features/user/components/user-selector";
import { Save } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  CreateEmployeeInputs,
  createEmployeeSchema,
} from "../api/create-employee";
import {
  UpdateEmployeeInputs,
  updateEmployeeSchema,
} from "../api/update-employee";
import { Employee } from "../types";

type EmployeeFormProps =
  | {
      mode: "create";
      defaultValues?: Partial<Employee>;
      onSubmit: (values: CreateEmployeeInputs) => void;
      apiErrors: Partial<Record<keyof CreateEmployeeInputs, string[]>>;
      isLoading?: boolean;
    }
  | {
      mode: "update";
      defaultValues: Partial<Employee>;
      onSubmit: (values: UpdateEmployeeInputs) => void;
      apiErrors: Partial<Record<keyof UpdateEmployeeInputs, string[]>>;
      isLoading?: boolean;
    };

export const EmployeeForm = ({
  defaultValues,
  onSubmit,
  apiErrors,
  isLoading,
  mode,
}: EmployeeFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const EMPLOYEE_STATUS = [
    {
      value: "active",
      label: t("employees.status.active"),
    },
    {
      value: "inactive",
      label: t("employees.status.inactive"),
    },
  ];
  const schema =
    mode === "update" ? updateEmployeeSchema : createEmployeeSchema;

  return (
    <Card className="rounded-sm p-5 gap-5">
      <CardContent className="p-0">
        <Form
          id="employee-form"
          options={{
            defaultValues: {
              status: defaultValues?.status ?? "active",
              ...defaultValues,
            },
          }}
          schema={schema}
          onSubmit={onSubmit}
        >
          {({ register, formState, control }) => (
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label htmlFor="job_title" className="text-sm font-bold">
                  {t("employees.fields.job_title.label")}{" "}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="job_title"
                  type="text"
                  placeholder={t("employees.fields.job_title.placeholder")}
                  error={
                    (formState.errors.job_title &&
                      t(`${formState.errors.job_title.message}`)) ||
                    apiErrors.job_title?.[0]!
                  }
                  registration={register("job_title")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="work_phone" className="text-sm font-bold">
                  {t("employees.fields.work_phone.label")}
                </label>
                <Input
                  id="work_phone"
                  type="text"
                  placeholder={t("employees.fields.work_phone.placeholder")}
                  error={
                    (formState.errors.work_phone &&
                      t(`${formState.errors.work_phone.message}`)) ||
                    apiErrors.work_phone?.[0]!
                  }
                  registration={register("work_phone")}
                  className="focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="hiring_date" className="text-sm font-bold">
                  {t("employees.fields.hiring_date.label")}
                </label>
                <Controller
                  name="hiring_date"
                  control={control}
                  defaultValue={defaultValues?.hiring_date}
                  render={({ field, fieldState }) => {
                    return (
                      <DateInput
                        label={t("employees.fields.hiring_date.label")}
                        placeholder={t(
                          "employees.fields.hiring_date.placeholder"
                        )}
                        error={
                          (fieldState.error?.message &&
                            t(fieldState.error?.message)) ||
                          apiErrors.hiring_date?.[0] ||
                          undefined
                        }
                        val={field.value}
                        onChange={(val) => field.onChange(val)}
                      />
                    );
                  }}
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="status" className="text-sm font-bold mb-2">
                  {t("employees.fields.status.label")}
                </label>
                <div className="flex flex-col rounded-sm mt-1">
                  <div className="flex gap-1  max-w-20">
                    {EMPLOYEE_STATUS.map((s, index) => (
                      <RadioInput
                        key={index}
                        id="status"
                        value={s.value}
                        label={t(`employees.fields.status.options.${s.value}`)}
                        registration={register("status")}
                        className="focus:ring-2 focus:ring-primary  focus:border-primary"
                      />
                    ))}
                  </div>
                </div>
              </div>
              {mode === "create" && (
                <div className="col-span-1">
                  <label htmlFor="owner_id" className="text-sm font-bold mb-2">
                    {t("employees.fields.email.label")}
                  </label>
                  <Controller
                    name={"user_id" as any}
                    control={control}
                    render={({ field, fieldState }) => (
                      <UserSelector
                        error={
                          (fieldState.error?.message &&
                            t(fieldState.error?.message)) ||
                          apiErrors.user_id?.[0] ||
                          undefined
                        }
                        placeholder={t("employees.fields.email.placeholder")}
                        val={field.value as string}
                        onChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 px-2 ">
        <Button onClick={() => navigate(-1)} variant={"outline"}>
          {t("cancel")}
        </Button>
        <Button form="employee-form" type="submit" isLoading={isLoading}>
          <Save className="size-4 ltr:mr-1 rtl:ml-1" />
          {defaultValues
            ? t("employees.actions.update")
            : t("employees.actions.create")}
        </Button>
      </CardFooter>
    </Card>
  );
};
