import { Button } from "@/components/ui/button";
import { Form, Input, Textarea } from "@/components/ui/form";
import { DateInput } from "@/components/ui/form/date-input";
import { FormDrawer } from "@/components/ui/form/form-drawer";
import { InputDateTime } from "@/components/ui/form/input-datetime";
// import i18n from "@/config/i18n";
import { toDateOnly, toDateTime } from "@/lib/utils";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import z from "zod";
import {
  createHearingSchema,
  updateHearingSchema,
} from "../api/create-hearing";
import { HearingView } from "../types/case.type";
import { CaseSelector } from "./case.selector";
import { HearingFormSkeleton } from "./hearing.form-skeleton";
import { ProcedureSelector } from "./procedure.selector";

export type HearingFormInputs = z.infer<
  typeof createHearingSchema | typeof updateHearingSchema
>;

type Props = {
  mode: "create" | "update";
  defaultValues?: Partial<HearingView>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: React.ReactElement;
  onSubmit: (values: HearingFormInputs) => void;
  isDone: boolean;
  isLoading?: boolean;
  caseId?: string;
};
export const HearingForm = ({
  open,
  onOpenChange,
  triggerButton,
  defaultValues,
  onSubmit,
  isDone,
  isLoading,
  mode,
  caseId: defaultCaseId,
}: Props) => {
  const { t } = useTranslation();
  const [caseId, setCaseId] = React.useState<string | undefined>(defaultCaseId);
  const [ready, setReady] = React.useState(false);

  const handleSubmit = React.useCallback(
    (values: HearingFormInputs) => {
      const payload = {
        ...values,
        hearing_date: toDateOnly(values.hearing_date),
        next_hearing_at: toDateTime(values.next_hearing_at),
        note: values.note?.trim() || undefined,
      };

      onSubmit(payload);
    },
    [onSubmit],
  );
  const schema = mode === "update" ? createHearingSchema : createHearingSchema;

  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setReady(true);
        });
      });
    } else {
      setReady(false);
    }
  }, [open]);
  const memoDefaultValues = React.useMemo(() => defaultValues, [defaultValues]);
  return (
    <FormDrawer
      title={
        mode === "create"
          ? t("hearings.form.create_title")
          : t("hearings.form.update_title")
      }
      className={"data-[vaul-drawer-direction=right]:w-2xl h-auto"}
      triggerButton={triggerButton}
      open={open}
      onOpenChange={onOpenChange}
      isDone={isDone}
      submitButton={
        <Button
          type="submit"
          form="hearing-form"
          disabled={isLoading}
          isLoading={isLoading}
        >
          {mode === "create"
            ? t("hearings.actions.create")
            : t("hearings.actions.update")}
        </Button>
      }
    >
      {ready || !open ? (
        <Form
          id="hearing-form"
          schema={schema}
          onSubmit={handleSubmit}
          options={{
            defaultValues: {
              ...memoDefaultValues,
              hearing_date: memoDefaultValues?.hearing_date
                ? new Date(memoDefaultValues.hearing_date)
                : undefined,

              next_hearing_at: memoDefaultValues?.next_hearing_at
                ? new Date(memoDefaultValues.next_hearing_at)
                : undefined,
            },
          }}
        >
          {({ control, register, formState }) => {
            return (
              <div className="flex flex-col gap-4 justify-center min-h-200">
                <div>
                  <label
                    htmlFor="hearing_date"
                    className="text-sm font-bold text-card-foreground"
                  >
                    {t("hearings.fields.hearing_date.label")}
                    <span className="text-error">*</span>
                  </label>
                  <Controller
                    name="hearing_date"
                    control={control}
                    render={({ field, fieldState }) => {
                      return (
                        <DateInput
                          label={t("hearings.fields.hearing_date.label")}
                          placeholder={t(
                            "hearings.fields.hearing_date.placeholder",
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
                <div>
                  <label
                    htmlFor="next_hearing_at"
                    className="text-sm font-bold text-card-foreground"
                  >
                    {t("hearings.fields.next_hearing_at.label")}
                    <span className="text-error">*</span>
                  </label>
                  <Controller
                    name="next_hearing_at"
                    control={control}
                    render={({ field, fieldState }) => {
                      return (
                        <InputDateTime
                          label={t("hearings.fields.next_hearing_at.label")}
                          placeholder={t(
                            "hearings.fields.next_hearing_at.placeholder",
                          )}
                          error={
                            (fieldState.error?.message &&
                              t(fieldState.error?.message)) ||
                            undefined
                          }
                          value={
                            field.value instanceof Date
                              ? field.value
                              : undefined
                          }
                          onChange={(val) => field.onChange(val)}
                        />
                      );
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="case"
                    className="text-sm font-bold text-card-foreground"
                  >
                    {t("hearings.fields.case.label")}
                  </label>
                  <CaseSelector
                    placeholder={t("hearings.fields.case.placeholder")}
                    val={caseId}
                    onChange={(val) => setCaseId(val)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="procedure"
                    className="text-sm font-bold text-card-foreground"
                  >
                    {t("hearings.fields.procedure.label")}
                    <span className="text-error">*</span>
                  </label>
                  <Controller
                    name="procedure_id"
                    control={control}
                    render={({ field, fieldState }) => {
                      return (
                        <ProcedureSelector
                          placeholder={t(
                            "hearings.fields.procedure.placeholder",
                          )}
                          caseId={caseId}
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
                <div>
                  <label
                    htmlFor="hearing_type"
                    className="text-sm font-bold text-card-foreground"
                  >
                    {t("hearings.fields.hearing_type.label")}
                    <span className="text-error">*</span>
                  </label>
                  <Input
                    id="hearing_type"
                    type="text"
                    placeholder={t("hearings.fields.hearing_type.placeholder")}
                    error={
                      formState.errors.hearing_type &&
                      t(`${formState.errors?.hearing_type.message}`)
                    }
                    registration={register("hearing_type")}
                    className="focus:ring-2 focus:ring-primary  focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2">
                  <div>
                    <label
                      htmlFor="judge_name"
                      className="text-sm font-bold text-card-foreground"
                    >
                      {t("hearings.fields.judge_name.label")}
                    </label>
                    <Input
                      id="judge_name"
                      type="text"
                      placeholder={t("hearings.fields.judge_name.placeholder")}
                      error={
                        formState.errors.judge_name &&
                        t(`${formState.errors?.judge_name.message}`)
                      }
                      registration={register("judge_name")}
                      className="focus:ring-2 focus:ring-primary  focus:border-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="room_number"
                      className="text-sm font-bold text-card-foreground"
                    >
                      {t("hearings.fields.room_number.label")}
                    </label>
                    <Input
                      id="room_number"
                      type="text"
                      placeholder={t("hearings.fields.room_number.placeholder")}
                      error={
                        formState.errors.room_number &&
                        t(`${formState.errors?.room_number.message}`)
                      }
                      registration={register("room_number")}
                      className="focus:ring-2 focus:ring-primary  focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="note"
                    className="text-sm font-bold text-card-foreground"
                  >
                    {t("hearings.fields.note.label")}
                  </label>
                  <Textarea
                    id="note"
                    placeholder={t("hearings.fields.note.placeholder")}
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
      ) : (
        <HearingFormSkeleton />
      )}
    </FormDrawer>
  );
};
