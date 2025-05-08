import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiUser, FiLock } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "../ui/form-input";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/api";
import { LoginRequest } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { AxiosError } from "axios";

const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data as LoginRequest);
      toast.success("Login Successful", {
        description: "Welcome back! Redirecting to dashboard...",
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Login error:", error);
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Login failed. Please try again.";
      toast.error("Login Failed", {
        description: message,
      });
    }
  };

  return (
    <Card className="w-full max-w-md border-none shadow-lg">
      <CardHeader className="space-y-1 bg-primary text-primary-foreground rounded-t-lg pb-6">
        <div className="flex justify-center mb-4">
          <img src="/logo.svg" alt="DFCU Bank" className="h-10 w-auto" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          Sign in to your account
        </CardTitle>
        <CardDescription className="text-center text-primary-foreground/80">
          Access the DFCU Payment Gateway
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            id="username"
            type="text"
            label="Username"
            placeholder="Enter your username"
            leftIcon={<FiUser className="h-5 w-5" />}
            error={errors.username?.message}
            {...register("username")}
          />

          <FormInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            leftIcon={<FiLock className="h-5 w-5" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t py-4">
        <p className="text-sm text-muted-foreground text-center">
          Demo credentials: <span className="font-medium">john_doe</span> /{" "}
          <span className="font-medium">User@123</span>
        </p>
      </CardFooter>
    </Card>
  );
}
