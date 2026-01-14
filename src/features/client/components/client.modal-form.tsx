import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { FormModal } from "@/components/ui/form/form-modal";
import { toast } from "@/components/ui/toast/use-toast";
import { PartyTypeSelector } from "@/features/party/party-types/components/party-type.selector";
import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  CreateClientInputs,
  createClientSchema,
  useCreateClient,
} from "../api/create-client";

export type ClientModalFormProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  triggerButton?: React.ReactElement;
};

export const ClientModalForm = ({
  triggerButton,
  onClose,
  onOpenChange,
  open,
}: ClientModalFormProps) => {
    console.log(open);
    
  const { t } = useTranslation();
  const createClient = useCreateClient({
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("clients.toast.created_title"),
          description: t("clients.toast.created_desc"),
          type: "success",
        });
      },
      onError: (error: any) => {
        if (error.response.status === 422) {
          setApiErrors(error.response.data.errors);
        } else {
          toast({
            title: t("clients.toast.error_create_title"),
            description: error.response.data.message,
            type: "error",
          });
        }
      },
    },
  });
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreateClientInputs, string[]>>
  >({});
  const handleSubmit = useCallback((payload: CreateClientInputs) => {
    console.log(payload);
    
    createClient.mutate({ payload });
  }, []);
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      title={t("clients.modal.create_title")}
      triggerButton={triggerButton}
      isDone={createClient.isSuccess}
      submitButton={
        <Button
          form="client-form"
          type="submit"
          isLoading={createClient.isPending}
        >
          {t("clients.actions.create")}
        </Button>
      }
    >
      <Form
        id="client-form"
        schema={createClientSchema}
        onSubmit={handleSubmit}
      >
        {({ register, formState, control }) => {
            console.log(formState.errors);
          
          return (
            <>
              <div>
                <label htmlFor="name_fr" className="text-sm font-bold">
                  {t("clients.fields.name.label.fr")}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="name_fr"
                  type="text"
                  placeholder={t("clients.fields.name.placeholder.fr")}
                  error={
                    (formState.errors.name?.fr &&
                      t(`${formState.errors?.name?.fr.message}`)) ||
                    apiErrors.name?.[0]!
                  }
                  registration={register("name.fr")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="name.ar" className="text-sm font-bold">
                  {t("clients.fields.name.label.ar")}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="name.ar"
                  type="text"
                  placeholder={t("clients.fields.name.placeholder.ar")}
                  error={
                    (formState.errors.name?.ar &&
                      t(`${formState.errors?.name?.ar.message}`)) ||
                    apiErrors.name?.[0]!
                  }
                  registration={register("name.ar")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="client_type_id" className="text-sm font-bold">
                  {t("clients.fields.client_type.label")}
                </label>
                <Controller
                  name="client_type_id"
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <PartyTypeSelector
                        val={field.value}
                        searchPlaceholder={t(
                          "clients.fields.client_type.search_placeholder"
                        )}
                        error={
                          (fieldState.error?.message &&
                            t(fieldState.error?.message)) ||
                          apiErrors.client_type_id?.[0] ||
                          undefined
                        }
                        placeholder={t(
                          "clients.fields.client_type.placeholder"
                        )}
                        onChange={(val) => {
                          field.onChange(val);
                        }}
                      />
                    );
                  }}
                />
              </div>
            </>
          );
        }}
      </Form>
    </FormModal>
  );
};
