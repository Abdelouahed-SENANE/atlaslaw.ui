import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, Input, Textarea } from "@/components/ui/form";
import { DateInput } from "@/components/ui/form/date-input";
import { ClientModalForm } from "@/features/client/components/client.modal-form";
import { ClientSelector } from "@/features/client/components/client.selector";
import { CodeCaseSelector } from "@/features/code-case/components/code-case.selector";
import { EmployeeSelector } from "@/features/employee/components/employee.selector";
import { OpponentModalForm } from "@/features/opponent/components/opponent.form-modal";
import { OpponentSelector } from "@/features/opponent/components/opponent.selector";
import { User } from "@/features/user/types";
import { useDisclosure } from "@/hooks/use-disclosure";
import { Plus, Save } from "lucide-react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import z from "zod";
import { createCaseSchema } from "../api/create-case";
import { updateCaseSchema } from "../api/update-case";
import { CaseDetails } from "../types/case.type";

export type CaseFormInputs = z.infer<typeof createCaseSchema>;
type CaseFormProps = {
  mode: "create" | "update";
  defaultValues?: Partial<CaseDetails>;
  onSubmit: (values: CaseFormInputs) => void;
  apiErrors: Partial<Record<keyof CaseFormInputs, string[]>>;
  isLoading?: boolean;
};

export const CaseForm = ({
  defaultValues,
  onSubmit,
  apiErrors,
  isLoading,
  mode,
}: CaseFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    isOpen: isClientModalOpen,
    open: openClientModal,
    close: closeClientModal,
  } = useDisclosure();
  const {
    isOpen: isOpponentModalOpen,
    open: openOpponentModal,
    close: closeOpponentModal,
  } = useDisclosure();

  const schema = mode === "update" ? updateCaseSchema : createCaseSchema;
  return (
    <Card className="rounded-sm p-2 mx-2">
      <CardContent className="p-0">
        <Form
          id="case-form"
          options={{
            shouldUnregister: true,
            defaultValues: {
              case_ref: defaultValues?.case_ref,
              client_id: defaultValues?.client_id,
              opponent_id: defaultValues?.opponent_id,
              code_case_id: defaultValues?.code_case_id,
              case_manager_id: defaultValues?.case_manager_id,
              note: defaultValues?.note,
              opening_date: defaultValues?.opening_date,
            },
          }}
          schema={schema}
          onSubmit={onSubmit}
        >
          {({ register, formState, control, setValue, watch }) => {
            const formatCaseRef = (value: string) => {
              const v = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

              const part1 = v.slice(0, 2);
              const part2 = v.slice(2, 6);
              const part3 = v.slice(6, 10);

              let result = part1;
              if (part2) result += part2;
              if (part3) result += `/${part3}`;

              return result;
            };            
            return (
              <>
                <div>
                  <h3 className="text-lg font-semibold">
                    {t("cases.form.title")}
                  </h3>
                  <p className="text-sm text-foreground/50">
                    {t("cases.form.description")}
                  </p>
                </div>
                <Card className="p-0 overflow-hidden gap-2">
                  <CardContent className="p-4 grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="case_ref" className="text-sm font-bold">
                        {t("cases.fields.case_ref.label")}
                        <span className="text-error">*</span>
                      </label>

                      <Input
                        id="case_ref"
                        placeholder="DR578/2024"
                        value={watch("case_ref") || ""}
                        registration={register("case_ref")}
                        onChange={(e) =>
                          setValue("case_ref", formatCaseRef(e.target.value))
                        }
                        error={
                          (formState.errors.case_ref &&
                            t(`${formState.errors.case_ref.message}`)) ||
                          apiErrors.case_ref?.[0]
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="opening_date"
                        className="text-sm font-bold"
                      >
                        {t("cases.fields.opening_date.label")}
                        <span className="text-error">*</span>
                      </label>
                      <Controller
                        name="opening_date"
                        control={control}
                        defaultValue={defaultValues?.opening_date}
                        render={({ field, fieldState }) => {
                          return (
                            <DateInput
                              label={t("cases.fields.opening_date.label")}
                              placeholder={t(
                                "cases.fields.opening_date.placeholder"
                              )}
                              error={
                                (fieldState.error?.message &&
                                  t(fieldState.error?.message)) ||
                                apiErrors.opening_date?.[0] ||
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
                      <label htmlFor="client_id" className="text-sm font-bold">
                        {t("cases.fields.client_id.label")}
                        <span className="text-error">*</span>
                      </label>
                      <Controller
                        name="client_id"
                        control={control}
                        defaultValue={defaultValues?.client_id ?? ""}
                        render={({ field, fieldState }) => {
                          return (
                            <ClientSelector
                              val={field.value}
                              searchPlaceholder={t(
                                "cases.fields.client.search_placeholder"
                              )}
                              initialClient={{
                                id: defaultValues?.client_id,
                                name: defaultValues?.client_name,
                              }}
                              error={
                                (fieldState.error?.message &&
                                  t(fieldState.error?.message)) ||
                                apiErrors.client_id?.[0] ||
                                undefined
                              }
                              placeholder={t(
                                "cases.fields.client_id.placeholder"
                              )}
                              onChange={(val) => field.onChange(val)}
                              renderFooter={() => (
                                <Button
                                  type="button"
                                  onClick={openClientModal}
                                  variant={"plain"}
                                  className="w-full hover:text-primary flex items-center justify-left!"
                                >
                                  <Plus className="size-4" />{" "}
                                  {t("clients.actions.add")}
                                </Button>
                              )}
                            />
                          );
                        }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="opponent_id"
                        className="text-sm font-bold"
                      >
                        {t("cases.fields.opponent_id.label")}
                        <span className="text-error">*</span>
                      </label>
                      <Controller
                        name="opponent_id"
                        control={control}
                        defaultValue={defaultValues?.opponent_id ?? ""}
                        render={({ field, fieldState }) => {
                          return (
                            <OpponentSelector
                              val={field.value}
                              searchPlaceholder={t(
                                "cases.fields.client.search_placeholder"
                              )}
                              initialOpponent={{
                                id: defaultValues?.opponent_id,
                                name: defaultValues?.opponent_name,
                              }}
                              error={
                                (fieldState.error?.message &&
                                  t(fieldState.error?.message)) ||
                                apiErrors.opponent_id?.[0] ||
                                undefined
                              }
                              placeholder={t(
                                "cases.fields.opponent_id.placeholder"
                              )}
                              onChange={(val) => field.onChange(val)}
                              renderFooter={() => (
                                <Button
                                  type="button"
                                  onClick={openOpponentModal}
                                  variant={"plain"}
                                  className="w-full hover:text-primary flex items-center justify-left!"
                                >
                                  <Plus className="size-4" />
                                  {t("opponents.actions.add")}
                                </Button>
                              )}
                            />
                          );
                        }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="code_case_id"
                        className="text-sm font-bold"
                      >
                        {t("cases.fields.code_case_id.label")}
                        <span className="text-error">*</span>
                      </label>
                      <Controller
                        name="code_case_id"
                        control={control}
                        defaultValue={defaultValues?.code_case_id ?? ""}
                        render={({ field, fieldState }) => {
                          return (
                            <CodeCaseSelector
                              val={field.value}
                              searchPlaceholder={t(
                                "cases.fields.client.search_placeholder"
                              )}
                              initialCodeCase={{
                                id: defaultValues?.code_case_id,
                                label: defaultValues?.code_case_name,
                              }}
                              error={
                                (fieldState.error?.message &&
                                  t(fieldState.error?.message)) ||
                                apiErrors.code_case_id?.[0] ||
                                undefined
                              }
                              placeholder={t(
                                "cases.fields.code_case_id.placeholder"
                              )}
                              onChange={(val) => field.onChange(val)}
                            />
                          );
                        }}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="case_manager_id"
                        className="text-sm font-bold"
                      >
                        {t("cases.fields.case_manager_id.label")}
                        <span className="text-error">*</span>
                      </label>
                      <Controller
                        name="case_manager_id"
                        control={control}
                        defaultValue={defaultValues?.case_manager_id ?? ""}
                        render={({ field, fieldState }) => {
                          return (
                            <EmployeeSelector
                              val={field.value}
                              searchPlaceholder={t(
                                "cases.fields.client.search_placeholder"
                              )}
                              initialEmployee={{
                                id: defaultValues?.case_manager_id,
                                user: {
                                  name: defaultValues?.case_manager_name!,
                                } as User,
                              }}
                              error={
                                (fieldState.error?.message &&
                                  t(fieldState.error?.message)) ||
                                apiErrors.case_manager_id?.[0] ||
                                undefined
                              }
                              placeholder={t(
                                "cases.fields.case_manager_id.placeholder"
                              )}
                              onChange={(val) => field.onChange(val)}
                            />
                          );
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="note" className="text-sm font-bold">
                        {t("cases.fields.note.label")}
                      </label>
                      <Textarea
                        id="note"
                        placeholder={t("cases.fields.note.placeholder")}
                        error={
                          (formState.errors.note &&
                            t(`${formState.errors?.note.message}`)) ||
                          apiErrors.note?.[0]!
                        }
                        registration={register("note")}
                        className="focus:ring-2 focus:ring-primary  focus:border-primary"
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          }}
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 px-2 ">
        <Button onClick={() => navigate(-1)} variant={"outline"}>
          {t("cancel")}
        </Button>
        <Button form="case-form" type="submit" isLoading={isLoading}>
          <Save className="size-4 ltr:mr-1 rtl:ml-1" />
          {defaultValues
            ? t("cases.actions.update")
            : t("cases.actions.create")}
        </Button>
      </CardFooter>
      <ClientModalForm
        open={isClientModalOpen}
        onOpenChange={() =>
          isClientModalOpen ? closeClientModal() : openClientModal()
        }
        onClose={closeClientModal}
      />
      <OpponentModalForm
        open={isOpponentModalOpen}
        onOpenChange={() =>
          isOpponentModalOpen ? closeOpponentModal() : openOpponentModal()
        }
        onClose={closeOpponentModal}
      />
    </Card>
  );
};
