import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form, Input } from "@/components/ui/form";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { CreateClientInputs, createClientSchema } from "../api/client-create";
import { Client } from "../types/client.type";

type ClientFormProps =
  | {
      mode: "create";
      defaultValues?: Partial<Client>;
      onSubmit: (values: CreateClientInputs) => void;
      apiErrors: Partial<Record<keyof CreateClientInputs, string[]>>;
      isLoading?: boolean;
    }
  | {
      mode: "update";
      defaultValues: Partial<Client>;
      onSubmit: (values: CreateClientInputs) => void;
      apiErrors: Partial<Record<keyof CreateClientInputs, string[]>>;
      isLoading?: boolean;
    };

export const ClientForm = ({
  defaultValues,
  onSubmit,
  apiErrors,
  isLoading,
  mode,
}: ClientFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();


  const schema = mode === "update" ? createClientSchema : createClientSchema;

  return (
    <Card className="rounded-sm p-5 gap-5">
      <CardContent className="p-0">
        <Form
          id="employee-form"
          options={{
            defaultValues: {
              party: {
                name: defaultValues?.name,
              },
              contact: {},
              legal_profile: {},
            },
          }}
          schema={schema}
          onSubmit={onSubmit}
        >
          {({ register, formState }) => (
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
                    (formState.errors.party?.name?.ar &&
                      t(`${formState.errors.party?.name?.ar.message}`)) ||
                    apiErrors.party?.[0]
                  }
                  registration={register("party.name.ar")}
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
