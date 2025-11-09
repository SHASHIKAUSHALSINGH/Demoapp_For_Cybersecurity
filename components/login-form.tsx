"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Determine which endpoint to use based on demo mode
      const endpoint = demoMode ? "/auth/login-vulnerable" : "/auth/login";

      // In demo mode, try to parse as JSON for NoSQL injection payloads
      let requestBody;
      if (demoMode) {
        try {
          // Try to parse email and password as JSON for injection
          const emailPayload = email.startsWith("{")
            ? JSON.parse(email)
            : email;
          const passwordPayload = password.startsWith("{")
            ? JSON.parse(password)
            : password;
          requestBody = JSON.stringify({
            email: emailPayload,
            password: passwordPayload,
          });
        } catch {
          // If parsing fails, use as strings
          requestBody = JSON.stringify({ email, password });
        }
      } else {
        requestBody = JSON.stringify({ email, password });
      }

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
        }${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: requestBody,
        }
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          message?: string;
        };
        setError(data.message ?? "Login failed. Please try again.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (cause) {
      console.error("Login failed", cause);
      setError("Unable to reach the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              {/* Demo Mode Toggle */}
              <Field>
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                  <input
                    type="checkbox"
                    id="demoMode"
                    checked={demoMode}
                    onChange={(e) => setDemoMode(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="demoMode" className="text-sm cursor-pointer">
                    <strong>⚠️ Demo Mode (Vulnerable Endpoint)</strong>
                    <br />
                    <span className="text-xs text-muted-foreground">
                      Try: {`{"$ne": null}`} in both fields to bypass auth
                    </span>
                  </label>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type={demoMode ? "text" : "email"}
                  placeholder={demoMode ? '{"$ne": null}' : "m@example.com"}
                  name="email"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {!demoMode && (
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  type={demoMode ? "text" : "password"}
                  placeholder={demoMode ? '{"$ne": null}' : ""}
                  name="password"
                  autoComplete="current-password"
                  required
                />
                {demoMode && (
                  <FieldDescription className="text-amber-600 dark:text-amber-400 text-xs">
                    💡 This uses the vulnerable endpoint that accepts MongoDB
                    operators
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button" disabled={isLoading}>
                  Login with Google
                </Button>
                {error && (
                  <FieldDescription className="text-destructive text-center">
                    {error}
                  </FieldDescription>
                )}
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="/signup">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
