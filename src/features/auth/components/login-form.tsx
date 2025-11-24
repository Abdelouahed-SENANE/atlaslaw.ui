import { Button } from "@/components/ui/button";
import { Form, Input } from "@/components/ui/form";
import { loginSchema, useLogin } from "@/lib/auth";

type LoginFormProps = {
  onSuccess: () => void;
  onError: (err : any) => void;
};
export const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
  const login = useLogin({
    onSuccess,
    onError,
  });

  return (
    <Form
      onSubmit={(values) => {
        login.mutate(values);
      }}
      schema={loginSchema}
      className="space-y-4"
    >
      {({ register, formState }) => (
        <>
          <div>
            <label htmlFor="username" className="text-sm font-bold">
              Username <span className="text-destructive">*</span>
            </label>
            <Input
              id="username"
              type="username"
              placeholder="Enter username"
              error={formState.errors["username"]}
              registration={register("username")}
              className="focus:ring-2 focus:ring-primary  focus:border-primary"
            />
          </div>

          <div>
            <label htmlFor="username" className="text-sm font-bold">
              Password <span className="text-destructive">*</span>
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              error={formState.errors["password"]}
              registration={register("password")}
              className="focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Button
              className=" font-medium  text-primary-foreground w-full flex items-center justify-center"
              isLoading={login.isPending}
              type="submit"
            >
              {login.isPending ? "" : "Log In"}
            </Button>
          </div>
        </>
      )}
    </Form>
  );
};
