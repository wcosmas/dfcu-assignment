"use client";

import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PaymentForm } from "@/components/payment/PaymentForm";

export default function PaymentInitiatePage() {
  return (
    <AppLayout>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold">Make a Payment</h1>
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <p className="text-sm text-muted-foreground">
              Send money quickly and securely
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <PaymentForm />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
