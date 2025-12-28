import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form, Input, SelectField, Textarea } from "@/components/ui/form";
import { PartyTypeSelector } from "@/features/party/party-types/components/party-type.selector";
import { useLegalStatusOptions } from "@/utils/constants";
import { Save } from "lucide-react";
import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  CreateOpponentInputs,
  createOpponentSchema,
} from "../api/create-opponent";
import { updateOpponentSchema } from "../api/update-opponent";
import { OpponentEditView } from "../types/opponent.type";

type OpponentFormProps =
  | {
      mode: "create";
      defaultValues?: Partial<OpponentEditView>;
      onSubmit: (values: CreateOpponentInputs) => void;
      apiErrors: Partial<Record<keyof CreateOpponentInputs, string[]>>;
      isLoading?: boolean;
    }
  | {
      mode: "update";
      defaultValues: Partial<OpponentEditView>;
      onSubmit: (values: CreateOpponentInputs) => void;
      apiErrors: Partial<Record<keyof CreateOpponentInputs, string[]>>;
      isLoading?: boolean;
    };

export const OpponentForm = ({
  defaultValues,
  onSubmit,
  apiErrors,
  isLoading,
  mode,
}: OpponentFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [supportLegalIdentifiers, setSupportLegalIdentifiers] =
    React.useState<boolean>(
      !!defaultValues?.party_type?.support_legal_identifiers || false
    );

  const schema =
    mode === "update" ? updateOpponentSchema : createOpponentSchema;
  const legalStatusOptions = useLegalStatusOptions();
  return (
    <Card className="rounded-sm p-2 mx-2">
      <CardContent className="p-0">
        <Form
          id="client-form"
          options={{
            shouldUnregister: true,
            defaultValues: {
              name: defaultValues?.name,
              national_id: defaultValues?.national_id,
              notes: defaultValues?.notes,
              opponent_type_id: defaultValues?.party_type?.id ?? "",
              contact: {
                email: defaultValues?.contact?.email,
                mobile: defaultValues?.contact?.mobile,
                landline: defaultValues?.contact?.landline,
                address: defaultValues?.contact?.address,
                postal: defaultValues?.contact?.postal,
              },
              legal_profile: {
                legal_status: defaultValues?.legal_profile?.legal_status ?? "",
                ice: defaultValues?.legal_profile?.ice,
                business_register:
                  defaultValues?.legal_profile?.business_register,
                fiscal_id: defaultValues?.legal_profile?.fiscal_id,
                legal_representative:
                  defaultValues?.legal_profile?.legal_representative,
                legal_representative_phone:
                  defaultValues?.legal_profile?.legal_representative_phone,
              },
            },
          }}
          schema={schema}
          onSubmit={onSubmit}
        >
          {({ register, formState, control }) => {
            return (
              <>
                {/* Base Informations */}
                <Card className="p-0 overflow-hidden gap-2">
                  <CardHeader className="border-b  bg-background px-4 [.border-b]:pb-0 h-14 flex items-center">
                    <h3>{t("opponents.form.cards.base_info")}</h3>
                  </CardHeader>
                  <CardContent className="p-4 grid grid-cols-2 gap-2">
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
                      <label className="text-sm font-bold">
                        {t("opponents.fields.national_id.label")}
                      </label>

                      {supportLegalIdentifiers ? (
                        <div className=" rounded-sm flex items-center border  bg-card h-9 mt-1 text-sm text-foreground/50">
                          {t(
                            "opponents.fields.national_id.individual_only_message"
                          )}
                        </div>
                      ) : (
                        <Input
                          id="national_id"
                          type="text"
                          placeholder={t(
                            "opponents.fields.national_id.placeholder"
                          )}
                          error={
                            (formState.errors.national_id &&
                              t(`${formState.errors?.national_id.message}`)) ||
                            apiErrors.national_id?.[0]
                          }
                          registration={register("national_id")}
                          className="focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="opponent_type_id"
                        className="text-sm font-bold"
                      >
                        {t("opponents.fields.opponent_type.label")}
                      </label>
                      <Controller
                        name="opponent_type_id"
                        control={control}
                        defaultValue={defaultValues?.party_type?.id ?? ""}
                        render={({ field, fieldState }) => {
                          return (
                            <PartyTypeSelector
                              val={field.value}
                              initialPartyType={{
                                id: defaultValues?.party_type?.id,
                                name: defaultValues?.party_type?.name,
                                support_legal_identifiers:
                                  defaultValues?.party_type
                                    ?.support_legal_identifiers!,
                              }}
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
                              onChange={(val, option) => {
                                setSupportLegalIdentifiers(
                                  option?.support_legal_identifiers!
                                );
                                field.onChange(val);
                              }}
                            />
                          );
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="note" className="text-sm font-bold">
                        {t("opponents.fields.note.label")}
                      </label>
                      <Textarea
                        id="note"
                        placeholder={t("opponents.fields.note.placeholder")}
                        error={
                          (formState.errors.notes &&
                            t(`${formState.errors?.notes.message}`)) ||
                          apiErrors.notes?.[0]!
                        }
                        registration={register("notes")}
                        className="focus:ring-2 focus:ring-primary  focus:border-primary"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Informations */}
                <Card className="p-0 overflow-hidden gap-2">
                  <CardHeader className="border-b  bg-background px-4 [.border-b]:pb-0 h-14 flex items-center">
                    <h3>{t("opponents.form.cards.contact_info")}</h3>
                  </CardHeader>
                  <CardContent className="p-4 grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="email" className="text-sm font-bold">
                        {t("opponents.fields.contacts.email.label")}
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t(
                          "opponents.fields.contacts.email.placeholder"
                        )}
                        error={
                          formState.errors.contact?.email &&
                          t(`${formState.errors?.contact?.email.message}`)
                        }
                        registration={register("contact.email")}
                        className="focus:ring-2 focus:ring-primary  focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="mobile" className="text-sm font-bold">
                        {t("opponents.fields.contacts.mobile.label")}
                      </label>
                      <Input
                        id="mobile"
                        type="text"
                        placeholder={t(
                          "opponents.fields.contacts.mobile.placeholder"
                        )}
                        error={
                          formState.errors.contact?.mobile &&
                          t(`${formState.errors?.contact?.mobile.message}`)
                        }
                        registration={register("contact.mobile")}
                        className="focus:ring-2 focus:ring-primary  focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="landline" className="text-sm font-bold">
                        {t("opponents.fields.contacts.landline.label")}
                      </label>
                      <Input
                        id="landline"
                        type="text"
                        placeholder={t(
                          "opponents.fields.contacts.landline.placeholder"
                        )}
                        error={
                          formState.errors.contact?.landline &&
                          t(`${formState.errors?.contact?.landline.message}`)
                        }
                        registration={register("contact.landline")}
                        className="focus:ring-2 focus:ring-primary  focus:border-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="postal" className="text-sm font-bold">
                        {t("opponents.fields.contacts.postal.label")}
                      </label>
                      <Input
                        id="postal"
                        type="text"
                        placeholder={t(
                          "opponents.fields.contacts.postal.placeholder"
                        )}
                        error={
                          formState.errors.contact?.postal &&
                          t(`${formState.errors?.contact?.postal.message}`)
                        }
                        registration={register("contact.postal")}
                        className="focus:ring-2 focus:ring-primary  focus:border-primary"
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="address" className="text-sm font-bold">
                        {t("opponents.fields.contacts.address.label")}
                      </label>
                      <Input
                        id="address"
                        type="text"
                        placeholder={t(
                          "opponents.fields.contacts.address.placeholder"
                        )}
                        error={
                          formState.errors.contact?.address &&
                          t(`${formState.errors?.contact?.address.message}`)
                        }
                        registration={register("contact.address")}
                        className="focus:ring-2 focus:ring-primary h-12  focus:border-primary"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Legal Informations */}
                {supportLegalIdentifiers === true && (
                  <Card className="p-0 overflow-hidden gap-2">
                    <CardHeader className="border-b  bg-background px-4 [.border-b]:pb-0 h-14 flex items-center">
                      <h3>{t("opponents.form.cards.legal_info")}</h3>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 gap-2">
                      <div>
                        <label
                          htmlFor="business_register"
                          className="text-sm font-bold"
                        >
                          {t(
                            "opponents.fields.legal_profile.business_register.label"
                          )}
                        </label>
                        <Input
                          id="business_register"
                          type="text"
                          placeholder={t(
                            "opponents.fields.legal_profile.business_register.placeholder"
                          )}
                          error={
                            formState.errors.legal_profile?.business_register &&
                            t(
                              `${formState.errors?.legal_profile?.business_register.message}`
                            )
                          }
                          registration={register(
                            "legal_profile.business_register"
                          )}
                          className="focus:ring-2 focus:ring-primary  focus:border-primary"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="fiscal_id"
                          className="text-sm font-bold"
                        >
                          {t("opponents.fields.legal_profile.fiscal_id.label")}
                        </label>
                        <Input
                          id="fiscal_id"
                          type="text"
                          placeholder={t(
                            "opponents.fields.legal_profile.fiscal_id.placeholder"
                          )}
                          error={
                            formState.errors.legal_profile?.fiscal_id &&
                            t(
                              `${formState.errors?.legal_profile?.fiscal_id.message}`
                            )
                          }
                          registration={register("legal_profile.fiscal_id")}
                          className="focus:ring-2 focus:ring-primary  focus:border-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="ice" className="text-sm font-bold">
                          {t("opponents.fields.legal_profile.ice.label")}
                        </label>
                        <Input
                          id="ice"
                          type="text"
                          placeholder={t(
                            "opponents.fields.legal_profile.ice.placeholder"
                          )}
                          error={
                            formState.errors.legal_profile?.ice &&
                            t(`${formState.errors?.legal_profile?.ice.message}`)
                          }
                          registration={register("legal_profile.ice")}
                          className="focus:ring-2 focus:ring-primary  focus:border-primary"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="legal_representative"
                          className="text-sm font-bold"
                        >
                          {t(
                            "opponents.fields.legal_profile.legal_representative.label"
                          )}
                        </label>
                        <Input
                          id="legal_representative"
                          type="text"
                          placeholder={t(
                            "opponents.fields.legal_profile.legal_representative.placeholder"
                          )}
                          error={
                            formState.errors.legal_profile
                              ?.legal_representative &&
                            t(
                              `${formState.errors?.legal_profile?.legal_representative.message}`
                            )
                          }
                          registration={register(
                            "legal_profile.legal_representative"
                          )}
                          className="focus:ring-2 focus:ring-primary  focus:border-primary"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="legal_representative_phone"
                          className="text-sm font-bold"
                        >
                          {t(
                            "opponents.fields.legal_profile.legal_representative_phone.label"
                          )}
                        </label>
                        <Input
                          id="legal_representative_phone"
                          type="text"
                          placeholder={t(
                            "opponents.fields.legal_profile.legal_representative_phone.placeholder"
                          )}
                          error={
                            formState.errors.legal_profile
                              ?.legal_representative_phone &&
                            t(
                              `${formState.errors?.legal_profile?.legal_representative_phone.message}`
                            )
                          }
                          registration={register(
                            "legal_profile.legal_representative_phone"
                          )}
                          className="focus:ring-2 focus:ring-primary  focus:border-primary"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="legal_status"
                          className="text-sm font-bold"
                        >
                          {t(
                            "opponents.fields.legal_profile.legal_status.label"
                          )}
                        </label>
                        <Controller
                          name="legal_profile.legal_status"
                          control={control}
                          defaultValue={
                            defaultValues?.legal_profile?.legal_status
                          }
                          render={({ field, fieldState }) => {
                            return (
                              <SelectField
                                value={field.value === null ? "" : field.value}
                                onChange={field.onChange}
                                className="focus:ring-2 focus:ring-primary  focus:border-primary"
                                placeholder={t(
                                  "opponents.fields.legal_profile.legal_status.placeholder"
                                )}
                                error={fieldState.error?.message}
                                options={legalStatusOptions}
                              />
                            );
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            );
          }}
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 px-2 ">
        <Button onClick={() => navigate(-1)} variant={"outline"}>
          {t("cancel")}
        </Button>
        <Button form="client-form" type="submit" isLoading={isLoading}>
          <Save className="size-4 ltr:mr-1 rtl:ml-1" />
          {defaultValues
            ? t("opponents.actions.update")
            : t("opponents.actions.create")}
        </Button>
      </CardFooter>
    </Card>
  );
};
