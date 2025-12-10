import { Button } from "@/components/ui/button";
import { Form, Input, Switch } from "@/components/ui/form";
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
import React from "react";
import { useTranslation } from "react-i18next";
import { assignRolesSchema } from "../api/assign-roles";
import { useAvailableRoles } from "../api/availables-roles";

type Props = {
  userID: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isDone: boolean;
  triggerButton?: React.ReactElement;
  title: string;
};
export const RoleAssignmentForm = ({
  open,
  onOpenChange,
  isDone,
  triggerButton,
  title,
  userID,
}: Props) => {
  const { t } = useTranslation();
  const { data, isLoading } = useAvailableRoles({
    id: userID,
    queryConfig: { enabled: open },
  });

  const userRoles = data?.data;
  const assinged =
    userRoles?.filter((role) => role.assigned).map((role) => role.id) ?? [];
    // if (isLoading) return <Skeleton />;

  return (
    <FormDrawer
      title={title}
      triggerButton={triggerButton}
      open={open}
      onOpenChange={onOpenChange}
      isDone={isDone}
      submitButton={
        <Button type="submit" form="assign-roles">
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
          schema={assignRolesSchema}
          onSubmit={(values) => console.log(values)}
          options={{
            defaultValues: {
              roleIds: assinged,
              userId: userID,
            },
          }}
        >
          {({ register, formState, getValues, setValue }) => {
            return (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="hidden"
                    id={userID}
                    error={formState.errors.userId?.message}
                    registration={register("userId")}
                    value={userID}
                  />
                </div>
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
                                  const current = getValues("roleIds") || [];
                                  if (checked) {
                                    if (!current.includes(role.id)) {
                                      setValue("roleIds", [
                                        ...current,
                                        role.id,
                                      ]);
                                    }
                                  } else {
                                    setValue(
                                      "roleIds",
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
