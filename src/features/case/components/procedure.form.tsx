import { Button } from "@/components/ui/button";
import {
  Form,
  Input,
  SelectField,
  Switch,
  Textarea,
} from "@/components/ui/form";
import { DateInput } from "@/components/ui/form/date-input";
import { FormDrawer } from "@/components/ui/form/form-drawer";
import i18n from "@/config/i18n";
import { AppealCourtsSelector } from "@/features/catalog/components/appeal-courts.selector";
import { CodeSelector } from "@/features/catalog/components/codes.selector";
import { PrimaryCourtsSelector } from "@/features/catalog/components/primary-court.selector";
import { Code, Court } from "@/features/catalog/types/catalog.type";
import { toDateOnly } from "@/lib/utils";
import { Lang } from "@/types/api";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import {
  createProcedureSchema,
  updateProcedureSchema,
} from "../api/create-procedure";
import { ProcedureFormView } from "../types/case.type";

export type ProcedureFormInputs = z.infer<
  typeof createProcedureSchema | typeof updateProcedureSchema
>;

type Props = {
  mode: "create" | "update";
  defaultValues?: Partial<ProcedureFormView>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: React.ReactElement;
  title: string;
  prefix: string;
  onSubmit: (values: ProcedureFormInputs) => void;
  isDone: boolean;
  isLoading?: boolean;
};
export const ProcedureForm = ({
  open,
  onOpenChange,
  triggerButton,
  title,
  defaultValues,
  prefix,
  onSubmit,
  isDone,
  isLoading,
  mode,
}: Props) => {
  const { t } = useTranslation();
  const [code, setCode] = React.useState<Code | null>(null);
  const [appeal, setAppeal] = React.useState<Court | null>(null);
  const [isPrimary, setIsPrimary] = React.useState(false);
  const lang = i18n.language;

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      procedure_date: toDateOnly(values.procedure_date),
      court_id: values.court_primary ?? values.court_appeal,
    };

    delete payload.court_appeal;
    delete payload.court_primary;

    onSubmit(payload);
  };

  useEffect(() => {
    if (mode === "update" && defaultValues) {
      setIsPrimary(!!defaultValues.court_primary);
    }
  }, [mode, defaultValues]);

  return (
    <FormDrawer
      title={title}
      className={"data-[vaul-drawer-direction=right]:w-2xl h-auto"}
      triggerButton={triggerButton}
      open={open}
      onOpenChange={onOpenChange}
      isDone={isDone}
      submitButton={
        <Button
          type="submit"
          form="procedure-form"
          disabled={isLoading}
          isLoading={isLoading}
        >
          {t("procedures.actions.save")}
        </Button>
      }
    >
      <Form
        id="procedure-form"
        schema={createProcedureSchema}
        onSubmit={handleSubmit}
        options={{
          defaultValues: {
            procedure_date: defaultValues?.procedure_date,
            number: defaultValues?.number,
            code: defaultValues?.code,
            year: defaultValues?.year,
            criteria: defaultValues?.criteria,
            court_appeal: defaultValues?.court_appeal,
            court_primary: defaultValues?.court_primary,
            note: defaultValues?.note,
          },
        }}
      >
        {({ control, register, formState, setValue }) => {
          return (
            <div className="flex flex-col gap-4  justify-center min-h-200">
              <div>
                <label
                  htmlFor="procedure_date"
                  className="text-sm font-bold text-card-foreground"
                >
                  {t("procedures.fields.procedure_date.label")}
                  <span className="text-error">*</span>
                </label>
                <Controller
                  name="procedure_date"
                  control={control}
                  defaultValue={defaultValues?.procedure_date}
                  render={({ field, fieldState }) => {
                    return (
                      <DateInput
                        label={t("procedures.fields.procedure_date.label")}
                        placeholder={t(
                          "procedures.fields.procedure_date.placeholder",
                        )}
                        error={
                          (fieldState.error?.message &&
                            t(fieldState.error?.message)) ||
                          undefined
                        }
                        val={field.value}
                        onChange={(val) => field.onChange(val)}
                      />
                    );
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <label
                    htmlFor="number"
                    className="text-sm text-card-foreground font-bold"
                  >
                    {t("procedures.fields.number.label")}
                    <span className="text-error">*</span>
                  </label>

                  <Input
                    id="number"
                    inputMode="numeric"
                    placeholder={t("procedures.fields.number.placeholder")}
                    registration={register("number", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    error={
                      (formState.errors.number &&
                        t(`${formState.errors.number.message}`)) ||
                      undefined
                    }
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="code"
                    className="text-sm text-card-foreground font-bold"
                  >
                    {t("procedures.fields.code.label")}
                    <span className="text-error">*</span>
                  </label>

                  <Controller
                    name="code"
                    control={control}
                    defaultValue={defaultValues?.code}
                    render={({ field, fieldState }) => {
                      return (
                        <CodeSelector
                          searchPlaceholder={t(
                            "procedures.fields.code.placeholder",
                          )}
                          prefix={prefix}
                          placeholder={t("procedures.fields.code.placeholder")}
                          error={
                            (fieldState.error?.message &&
                              t(fieldState.error?.message)) ||
                            undefined
                          }
                          val={String(field.value)}
                          onChange={(val) => field.onChange(val)}
                          setCode={(code: Code) => setCode(code)}
                        />
                      );
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="year"
                    className="text-sm text-card-foreground font-bold"
                  >
                    {t("procedures.fields.year.label")}
                    <span className="text-error">*</span>
                  </label>

                  <Input
                    id="year"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    placeholder={t("procedures.fields.year.placeholder")}
                    registration={register("year")}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    error={
                      (formState.errors.year &&
                        t(`${formState.errors.year.message}`)) ||
                      undefined
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label htmlFor="object" className="text-sm font-bold">
                    {t("procedures.fields.object.label")}
                  </label>
                  <Input
                    id="object"
                    placeholder={t("procedures.fields.object.placeholder")}
                    value={code?.label[lang as Lang] ?? ""}
                    readOnly
                    tabIndex={-1}
                    className=" select-none cursor-default focus:ring-0 focus:border-transparent"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="criteria" className="text-sm font-bold">
                    {t("procedures.fields.criteria.label")}
                  </label>
                  <Controller
                    name="criteria"
                    control={control}
                    defaultValue={defaultValues?.criteria}
                    render={({ field, fieldState }) => {
                      return (
                        <SelectField
                          options={[
                            {
                              label: "Plaintiff",
                              value: "plaintiff",
                            },
                            {
                              label: "Defendant",
                              value: "defendant",
                            },
                          ]}
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                          }}
                          error={
                            fieldState.error && t(`${fieldState.error.message}`)
                          }
                          placeholder={t(
                            "procedures.fields.criteria.placeholder",
                          )}
                          className="focus:ring-2 focus:ring-primary  focus:border-primary"
                        />
                      );
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="court_appeal"
                  className="text-sm text-card-foreground font-bold"
                >
                  {t("procedures.fields.court_appeal.label")}
                  <span className="text-error">*</span>
                </label>

                <Controller
                  name="court_appeal"
                  control={control}
                  defaultValue={defaultValues?.court_appeal}
                  render={({ field, fieldState }) => {
                    return (
                      <AppealCourtsSelector
                        searchPlaceholder={t(
                          "procedures.fields.court_appeal.placeholder",
                        )}
                        type={code?.court_type ?? ""}
                        placeholder={t(
                          "procedures.fields.court_appeal.placeholder",
                        )}
                        error={
                          (fieldState.error?.message &&
                            t(fieldState.error?.message)) ||
                          undefined
                        }
                        val={String(field.value)}
                        onChange={(val) => {
                          field.onChange(val);
                          setValue("court_primary", undefined);
                        }}
                        setAppeal={(court: Court) => setAppeal(court)}
                      />
                    );
                  }}
                />
              </div>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="is_primary"
                  className="text-sm font-bold text-nowrap"
                >
                  {t("procedures.fields.is_primary.label")}
                </label>
                <Switch
                  defaultChecked={isPrimary}
                  onCheckedChange={(val) => setIsPrimary(val)}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary  "
                />
              </div>
              {isPrimary && (
                <div>
                  <label
                    htmlFor="court_primary"
                    className="text-sm text-card-foreground font-bold"
                  >
                    {t("procedures.fields.court_primary.label")}
                    <span className="text-error">*</span>
                  </label>

                  <Controller
                    name="court_primary"
                    control={control}
                    defaultValue={defaultValues?.court_primary}
                    render={({ field, fieldState }) => {
                      return (
                        <PrimaryCourtsSelector
                          key={appeal?.code}
                          searchPlaceholder={t(
                            "procedures.fields.court_primary.placeholder",
                          )}
                          type={code?.court_type ?? ""}
                          placeholder={t(
                            "procedures.fields.court_primary.placeholder",
                          )}
                          error={
                            (fieldState.error?.message &&
                              t(fieldState.error?.message)) ||
                            undefined
                          }
                          val={field.value}
                          onChange={(val) => field.onChange(val)}
                          parentCode={appeal?.code}
                        />
                      );
                    }}
                  />
                </div>
              )}
              <div className="col-span-2">
                <label htmlFor="note" className="text-sm font-bold">
                  {t("procedures.fields.note.label")}
                </label>
                <Textarea
                  id="note"
                  placeholder={t("procedures.fields.note.placeholder")}
                  error={
                    formState.errors.note &&
                    t(`${formState.errors?.note.message}`)
                  }
                  registration={register("note")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
            </div>
          );
        }}
      </Form>
    </FormDrawer>
  );
};
