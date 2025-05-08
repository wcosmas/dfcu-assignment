"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatusChecker } from "@/components/payment/StatusChecker";
import { RefreshCw } from "lucide-react";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  // You can log or use the ref parameter
  useEffect(() => {
    console.log("Transaction Reference:", ref);
  }, [ref]);

  return (
    <AppLayout>
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-1.5 bg-primary rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Payment Status
                </h1>
                <p className="mt-1 text-base text-muted-foreground">
                  Track and verify your transaction status in real-time
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
              <span>Updates automatically</span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <StatusChecker transactionRef={ref} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
