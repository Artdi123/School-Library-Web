import { cn } from "@/lib/utils";
import { Button } from "@/app/components/login-ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/app/components/login-ui/field";
import { Input } from "@/app/components/login-ui/input";

export function LoginForm({ className, ...props }) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </Field>
        <Field>
          <Button className="bg-indigo-600" type="submit">
            Login
          </Button>
        </Field>
        <FieldDescription className="text-center">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
