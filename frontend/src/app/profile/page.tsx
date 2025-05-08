"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { FormInput } from "@/components/ui/form-input";
import { useAuth } from "@/hooks/useAuth";
import { FiUser, FiMail, FiLock, FiSave, FiRefreshCw } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Form validation schema
const profileSchema = z
  .object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    currentPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      // If currentPassword is provided, newPassword must also be provided
      if (data.currentPassword && !data.newPassword) {
        return false;
      }
      // If newPassword is provided, currentPassword must also be provided
      if (!data.currentPassword && data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Both current and new password are required to change password",
      path: ["currentPassword"],
    }
  )
  .refine(
    (data) => {
      // If newPassword is provided, it must match confirmPassword
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [user, reset]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
    }
  }, [authLoading, user, router]);

  const onSubmit = async (data: ProfileFormValues) => {
    setError(null);
    setSuccess(null);
    setUpdating(true);

    try {
      // Prepare update data (exclude confirmPassword)
      const updateData: any = {
        fullName: data.fullName,
        email: data.email,
      };

      // Only include password fields if they're provided
      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      await updateProfile(updateData);
      setSuccess("Profile updated successfully");

      // Clear password fields after successful update
      reset({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex flex-col items-center">
            <FiRefreshCw className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 md:px-8">
          <div className="mb-8 flex items-center space-x-4">
            <div className="h-10 w-1.5 bg-primary rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
              <p className="mt-1 text-base text-muted-foreground">
                Manage your account information
              </p>
            </div>
          </div>

          <Card className="border shadow-sm">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle>Account Information</CardTitle>
                {user && (
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                )}
              </div>
              <CardDescription>
                Update your personal information and password
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>

                  <FormInput
                    id="fullName"
                    label="Full Name"
                    placeholder="Your full name"
                    leftIcon={<FiUser className="h-5 w-5" />}
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />

                  <FormInput
                    id="email"
                    label="Email"
                    placeholder="Your email address"
                    leftIcon={<FiMail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register("email")}
                  />

                  {user && (
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="text-sm font-medium mb-1">
                        Account Number
                      </div>
                      <div className="text-md font-mono bg-background py-2 px-3 rounded border">
                        {user.accountNumber}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your account number cannot be changed
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Leave the password fields empty if you don't want to change
                    it
                  </p>

                  <FormInput
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                    leftIcon={<FiLock className="h-5 w-5" />}
                    error={errors.currentPassword?.message}
                    {...register("currentPassword")}
                  />

                  <FormInput
                    id="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="Enter a new password"
                    leftIcon={<FiLock className="h-5 w-5" />}
                    error={errors.newPassword?.message}
                    {...register("newPassword")}
                  />

                  <FormInput
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your new password"
                    leftIcon={<FiLock className="h-5 w-5" />}
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full" disabled={updating}>
                    {updating ? (
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
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiSave className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
