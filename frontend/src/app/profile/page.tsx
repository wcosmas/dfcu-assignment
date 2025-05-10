"use client";

import React, { useEffect } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiUser, FiMail, FiLock, FiSave, FiRefreshCw } from "react-icons/fi";

import { useUserProfile } from "@/hooks/api";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";

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
  const { profile, isLoading, updateProfile, isUpdating, updateError } =
    useUserProfile();

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
    if (profile) {
      reset({
        fullName: profile.fullName || "",
        email: profile.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profile, reset]);

  // Show error toast when update error occurs
  useEffect(() => {
    if (updateError) {
      const errorMessage =
        updateError instanceof AxiosError
          ? updateError.response?.data?.message
          : "Failed to update profile. Please try again.";

      toast.error("Update Failed", {
        description: errorMessage,
      });
    }
  }, [updateError]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !profile) {
      router.push("/auth/login");
    }
  }, [isLoading, profile, router]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      // Prepare update data (exclude confirmPassword)
      const updateData: {
        fullName: string;
        email: string;
        currentPassword?: string;
        newPassword?: string;
      } = {
        fullName: data.fullName,
        email: data.email,
      };

      // Only include password fields if they're provided
      if (data.currentPassword && data.newPassword) {
        updateData.currentPassword = data.currentPassword;
        updateData.newPassword = data.newPassword;
      }

      await updateProfile(updateData);

      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully",
      });

      // Clear password fields after successful update
      reset({
        ...data,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      console.error("Profile update error:", err);
    }
  };

  if (isLoading) {
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
                {profile && (
                  <Badge variant="outline" className="text-xs">
                    {profile.role}
                  </Badge>
                )}
              </div>
              <CardDescription>
                Update your personal information and password
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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

                  {profile && profile.accountNumber && (
                    <div className="bg-muted/30 p-4 rounded-md">
                      <div className="text-sm font-medium mb-1">
                        Account Number
                      </div>
                      <div className="text-md font-mono bg-background py-2 px-3 rounded border">
                        {profile.accountNumber}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your account number cannot be changed
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Leave fields empty to keep your current password
                  </p>

                  <FormInput
                    id="currentPassword"
                    type="password"
                    label="Current Password"
                    placeholder="Enter your current password"
                    leftIcon={<FiLock className="h-5 w-5" />}
                    error={errors.currentPassword?.message}
                    {...register("currentPassword")}
                  />

                  <FormInput
                    id="newPassword"
                    type="password"
                    label="New Password"
                    placeholder="Enter a new secure password"
                    leftIcon={<FiLock className="h-5 w-5" />}
                    error={errors.newPassword?.message}
                    {...register("newPassword")}
                  />

                  <FormInput
                    id="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm your new password"
                    leftIcon={<FiLock className="h-5 w-5" />}
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                  />
                </div>

                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <FiRefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
