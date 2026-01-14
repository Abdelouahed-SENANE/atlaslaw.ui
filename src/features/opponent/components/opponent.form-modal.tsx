import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { FormModal } from "@/components/ui/form/form-modal";
import { toast } from "@/components/ui/toast/use-toast";
import { PartyTypeSelector } from "@/features/party/party-types/components/party-type.selector";
import React, { useCallback } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CreateOpponentInputs, createOpponentSchema, useCreateOpponent } from "../api/create-opponent";


export type OpponentModalFormProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  triggerButton?: React.ReactElement;
};

export const OpponentModalForm = ({
  triggerButton,
  onClose,
  onOpenChange,
  open,
}: OpponentModalFormProps) => {    
  const { t } = useTranslation();
  const createOpponent = useCreateOpponent({
    mutationConfig: {
      onSuccess: () => {
        setApiErrors({});
        toast({
          title: t("opponents.toast.created_title"),
          description: t("opponents.toast.created_desc"),
          type: "success",
        });
      },
      onError: (error: any) => {
        if (error.response.status === 422) {
          setApiErrors(error.response.data.errors);
        } else {
          toast({
            title: t("opponents.toast.error_create_title"),
            description: error.response.data.message,
            type: "error",
          });
        }
      },
    },
  });
  const [apiErrors, setApiErrors] = React.useState<
    Partial<Record<keyof CreateOpponentInputs, string[]>>
  >({});
  const handleSubmit = useCallback((payload: CreateOpponentInputs) => {    
    createOpponent.mutate({ payload });
  }, []);
  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      title={t("opponents.modal.create_title")}
      triggerButton={triggerButton}
      isDone={createOpponent.isSuccess}
      submitButton={
        <Button
          form="opponent-form"
          type="submit"
          isLoading={createOpponent.isPending}
        >
          {t("opponents.actions.create")}
        </Button>
      }
    >
      <Form
        id="opponent-form"
        schema={createOpponentSchema}
        onSubmit={handleSubmit}
      >
        {({ register, formState, control }) => {
            console.log(formState.errors);
          
          return (
            <>
              <div>
                <label htmlFor="name_fr" className="text-sm font-bold">
                  {t("opponents.fields.name.label.fr")}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="name_fr"
                  type="text"
                  placeholder={t("opponents.fields.name.placeholder.fr")}
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
                  {t("opponents.fields.name.label.ar")}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="name.ar"
                  type="text"
                  placeholder={t("opponents.fields.name.placeholder.ar")}
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
                <label htmlFor="opponent_type_id" className="text-sm font-bold">
                  {t("opponents.fields.opponent_type.label")}
                </label>
                <Controller
                  name="opponent_type_id"
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <PartyTypeSelector
                        val={field.value}
                        searchPlaceholder={t(
                          "opponents.fields.opponent_type.search_placeholder"
                        )}
                        error={
                          (fieldState.error?.message &&
                            t(fieldState.error?.message)) ||
                          apiErrors.opponent_type_id?.[0] ||
                          undefined
                        }
                        placeholder={t(
                          "opponents.fields.opponent_type.placeholder"
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
