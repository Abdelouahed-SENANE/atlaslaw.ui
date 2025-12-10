import { Button } from "@/components/ui/button";
import { Form, Switch } from "@/components/ui/form";
import { FormDrawer } from "@/components/ui/form/form-drawer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TableBody,
  TableCell,
  TableElement,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast/use-toast";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  assignRolesToUserSchema,
  useAssignRoles,
} from "../api/assign-roles-to-user";
import { useAvailableRoles } from "../api/availables-roles";

type Props = {
  userID: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerButton?: React.ReactElement;
  title: string;
};
export const RoleAssignmentForm = ({
  open,
  onOpenChange,
  triggerButton,
  title,
  userID,
}: Props) => {
  const { t } = useTranslation();
  const { data, isLoading } = useAvailableRoles({
    id: userID,
    queryConfig: { enabled: open },
  });

  const assignRole = useAssignRoles({
    id: userID,
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("roles.toast.updated_title"),
          description: t("roles.toast.updated_desc"),
          type: "success",
        });
      },
      onError: () => {
        toast({
          title: t("roles.toast.error_title"),
          description: t("roles.toast.error_desc"),
          type: "error",
        });
      },
    },
  });

  const userRoles = data?.data;
  const assinged =
    userRoles?.filter((role) => role.assigned).map((role) => role.id) ?? [];

  return (
    <FormDrawer
      title={title}
      triggerButton={triggerButton}
      open={open}
      onOpenChange={onOpenChange}
      isDone={assignRole.isSuccess}
      submitButton={
        <Button
          type="submit"
          form="assign-roles"
          disabled={assignRole.isPending}
          isLoading={assignRole.isPending}
        >
          {t("global.actions.update_changes")}
        </Button>
      }
    >
      {isLoading ? (
        <Skeleton />
      ) : (
        <Form
          key={userID}
          id="assign-roles"
          schema={assignRolesToUserSchema}
          onSubmit={(values) =>
            assignRole.mutate({ id: userID, payload: values })
          }
          options={{
            defaultValues: {
              role_ids: assinged,
            },
          }}
        >
          {({ getValues, setValue }) => {
            return (
              <>
                <TableElement>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roles</TableHead>
                      <TableHead>Assigned</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {isLoading
                      ? [...Array(3)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-5 w-10 rounded-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      : userRoles?.map((role) => (
                          <TableRow key={role.id}>
                            <TableCell>{role.name}</TableCell>
                            <TableCell>
                              <Switch
                                id={`role-${role.id}`}
                                defaultChecked={role.assigned}
                                onCheckedChange={(checked) => {
                                  const current = getValues("role_ids") || [];
                                  if (checked) {
                                    if (!current.includes(role.id)) {
                                      setValue("role_ids", [
                                        ...current,
                                        role.id,
                                      ]);
                                    }
                                  } else {
                                    setValue(
                                      "role_ids",
                                      current.filter((id) => id !== role.id)
                                    );
                                  }
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </TableElement>
              </>
            );
          }}
        </Form>
      )}
    </FormDrawer>
  );
};
