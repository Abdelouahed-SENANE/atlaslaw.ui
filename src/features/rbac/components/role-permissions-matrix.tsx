import { Button } from "@/components/ui/button";
import { Checkbox, Form } from "@/components/ui/form";
import {
  TableBody,
  TableCell,
  TableElement,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast/use-toast";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  updateRolePermissionsSchema,
  useUpdateRolePermissions,
} from "../api/update-role-permissions";
import { Permission } from "../types";

type Props = {
  groups: Record<string, Permission[]>;
  roleID: string;
};

const ACTIONS = ["create", "update", "list", "delete"] as const;
export const RolePermissionsMatrix = ({ groups, roleID }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const updateRolePermissions = useUpdateRolePermissions({
    id: roleID,
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: t("roles.toast.updated_title"),
          description: t("roles.toast.updated_desc"),
          type: "success",
        });
        navigate(-1);
      },
    },
  });
  const buildMatrix = () => {
    const matrix: Record<string, Record<string, boolean>> = {};
    Object.entries(groups).forEach(([resource, permissions]) => {
      const resourceActions: Record<string, boolean> = {};
      ACTIONS.forEach((action) => {
        const perm = permissions.find((p) => p.code.startsWith(action));
        resourceActions[action] = perm?.assigned ?? false;
      });
      matrix[resource] = resourceActions;
    });
    return matrix;
  };

  const initialState = useMemo(() => buildMatrix(), [groups]);

  const [state, setState] =
    React.useState<Record<string, Record<string, boolean>>>(initialState);

  const isDirty = React.useMemo(
    () => JSON.stringify(state) !== JSON.stringify(initialState),
    [state, initialState]
  );

  const handleToggle = (resource: string, action: string) => {
    setState({
      ...state,
      [resource]: {
        ...state[resource],
        [action]: !state[resource]?.[action],
      },
    });
  };

  const buildPayload = () => {
    const codes: string[] = [];

    Object.entries(state).forEach(([resource, actions]) => {
      Object.entries(actions).forEach(([action, checked]) => {
        if (checked) {
          console.log(`${action}:${resource}`);
          codes.push(`${action}:${resource}`);
        }
      });
    });

    return { codes };
  };

  return (
    <Form
      id="role-permissions-matrix"
      schema={updateRolePermissionsSchema}
      // options={{ defaultValues: buildPayload() }}
      onSubmit={() => {
        if (!isDirty) {
          toast({
            title: t("roles.toast.no_changes_title"),
            description: t("roles.toast.no_changes_desc"),
            type: "info",
          });
          return;
        }
        const payload = buildPayload();
        updateRolePermissions.mutate({ id: roleID, payload });
      }}
    >
      {({}) => (
        <React.Fragment>
          <TableElement className="w-full overflow-hidden">
            <TableHeader className="bg-background w-full">
              <TableRow className="border-none">
                <TableHead className="w-1/3 ">Ressources</TableHead>
                {ACTIONS.map((action) => (
                  <TableHead
                    key={action}
                    className="capitalize font-semibold  text-center"
                  >
                    {action}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="w-full">
              {Object.entries(groups).map(([resource]) => (
                <TableRow key={resource}>
                  <TableCell
                    key={resource}
                    className="text-base font-semibold capitalize w-1/3"
                  >
                    {resource}
                  </TableCell>
                  {ACTIONS.map((action) => (
                    <TableCell className="px-2" key={action}>
                      <Checkbox
                        onCheckedChange={() => handleToggle(resource, action)}
                        checked={state[resource]?.[action] ?? false}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </TableElement>
          <div className="flex justify-end gap-2 mt-8">
            <Button variant={"outline"} type="reset">
              {t("roles.actions.reset")}
            </Button>
            <Button
              form="role-permissions-matrix"
              isLoading={updateRolePermissions.isPending}
              disabled={updateRolePermissions.isPending}
              type="submit"
            >
              {updateRolePermissions.isPending
                ? t("roles.actions.saving")
                : t("roles.actions.save")}
            </Button>
          </div>
        </React.Fragment>
      )}
    </Form>
  );
};
