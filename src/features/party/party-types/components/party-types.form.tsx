import { Button } from "@/components/ui/button";
import { Form, Input, Switch } from "@/components/ui/form";
import { FormModal } from "@/components/ui/form/form-modal";
import { useTranslation } from "react-i18next";
import {
  CreatePartyTypeInputs,
  createPartyTypeSchema,
} from "../api/create-party-type";
import { PartyType } from "../types/party-type";

export type PartyTypeFormProps =
  | {
      mode: "create";
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      onClose?: () => void;
      triggerButton?: React.ReactElement;
      onSubmit: (values: CreatePartyTypeInputs) => void;
      isDone: boolean;
      isLoading?: boolean;
      apiErrors: Partial<Record<keyof CreatePartyTypeInputs, string[]>>;
      defaultValues?: Partial<PartyType>;
    }
  | {
      mode: "update";
      open?: boolean;
      onOpenChange?: (open: boolean) => void;
      onClose?: () => void;
      triggerButton?: React.ReactElement;
      onSubmit: (values: CreatePartyTypeInputs) => void;
      isDone: boolean;
      defaultValues?: Partial<PartyType>;
      apiErrors: Partial<Record<keyof CreatePartyTypeInputs, string[]>>;
      isLoading?: boolean;
    };

export const PartyTypeForm = ({
  triggerButton,
  mode,
  onSubmit,
  isDone,
  isLoading,
  apiErrors,
  defaultValues,
  open,
  onOpenChange,
  onClose,
}: PartyTypeFormProps) => {
  const { t } = useTranslation();

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      title={t(
        mode === "create"
          ? "party_types.modal.create_title"
          : "party_types.modal.update_title"
      )}
      triggerButton={triggerButton}
      isDone={isDone}
      submitButton={
        <Button form="party-types-form" type="submit" isLoading={isLoading}>
          {mode === "create"
            ? t("party_types.actions.create")
            : t("party_types.actions.update")}
        </Button>
      }
    >
      <Form
        id="party-types-form"
        schema={
          mode === "create" ? createPartyTypeSchema : createPartyTypeSchema
        }
        onSubmit={onSubmit}
        options={{
          defaultValues: {
            ...defaultValues,
            is_active: defaultValues?.is_active ?? true,
            support_legal_identifiers:
              defaultValues?.support_legal_identifiers ?? false,
          },
        }}
      >
        {({ register, formState, setValue }) => {
          return (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="name_fr" className="text-sm font-bold">
                  {t("party_types.fields.name.label.fr")}{" "}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="name_fr"
                  type="text"
                  placeholder={t("party_types.fields.name.placeholder.fr")}
                  error={
                    (formState.errors.name?.fr &&
                      t(`${formState.errors.name.fr.message}`)) ||
                    apiErrors.name?.[0]!
                  }
                  registration={register("name.fr")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="name_ar" className="text-sm font-bold">
                  {t("party_types.fields.name.label.ar")}{" "}
                  <span className="text-error">*</span>
                </label>
                <Input
                  id="name_ar"
                  type="text"
                  placeholder={t("party_types.fields.name.placeholder.ar")}
                  error={
                    (formState.errors.name?.ar &&
                      t(`${formState.errors.name.ar.message}`)) ||
                    apiErrors.name?.[0]!
                  }
                  registration={register("name.ar")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="description_ar" className="text-sm font-bold">
                  {t("party_types.fields.description.label.ar")}{" "}
                </label>
                <Input
                  id="description_ar"
                  type="text"
                  placeholder={t(
                    "party_types.fields.description.placeholder.ar"
                  )}
                  error={
                    (formState.errors.description?.ar &&
                      t(`${formState.errors.description.ar.message}`)) ||
                    apiErrors.description?.[0]!
                  }
                  registration={register("description.ar")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="description_fr" className="text-sm font-bold">
                  {t("party_types.fields.description.label.fr")}{" "}
                </label>
                <Input
                  id="description_fr"
                  type="text"
                  placeholder={t(
                    "party_types.fields.description.placeholder.fr"
                  )}
                  error={
                    (formState.errors.description?.fr &&
                      t(`${formState.errors.description.fr.message}`)) ||
                    apiErrors.description?.[0]!
                  }
                  registration={register("description.fr")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label htmlFor="is_active" className="text-sm font-bold">
                  {t("party_types.fields.is_active.label.fr")}{" "}
                </label>
                <Switch
                  id="is_active"
                  defaultChecked={formState.defaultValues?.is_active}
                  onCheckedChange={(checked) => {
                    setValue("is_active", checked);
                  }}
                  error={
                    (formState.errors.is_active &&
                      t(`${formState.errors.is_active.message}`)) ||
                    apiErrors.is_active?.[0]!
                  }
                  registration={register("is_active")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="support_legal_identifiers"
                  className="text-sm font-bold"
                >
                  {t("party_types.fields.support_legal_identifiers.label")}{" "}
                </label>
                <Switch
                  id="support_legal_identifiers"
                  defaultChecked={
                    formState.defaultValues?.support_legal_identifiers
                  }
                  onCheckedChange={(checked) => {
                    setValue("support_legal_identifiers", checked);
                  }}
                  error={
                    (formState.errors.support_legal_identifiers &&
                      t(
                        `${formState.errors.support_legal_identifiers.message}`
                      )) ||
                    apiErrors.support_legal_identifiers?.[0]!
                  }
                  registration={register("support_legal_identifiers")}
                  className="focus:ring-2 focus:ring-primary  focus:border-primary"
                />
              </div>
            </div>
          );
        }}
      </Form>
    </FormModal>
  );
};
