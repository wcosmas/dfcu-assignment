"use client";

import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm />
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>DFCU Bank Payment Gateway | Secure Financial Services</p>
        </div>
      </div>
    </div>
  );
}
