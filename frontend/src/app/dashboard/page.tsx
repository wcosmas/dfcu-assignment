"use client";

import React, { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/api";
import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/query-keys";
import { paymentApi } from "@/api/payment";

import { AppLayout } from "@/components/layout/AppLayout";

// Import the components from _components
import {
  ActionCards,
  DashboardHeader,
  DashboardMetrics,
  TransactionsTable,
} from "./_components";

export default function DashboardPage() {
  const { user } = useAuth();

  // Use React Query to fetch transaction data
  const {
    data: transactions = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.PAYMENT.HISTORY],
    queryFn: paymentApi.getTransactionHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Show error toast when transaction error occurs
  useEffect(() => {
    if (isError) {
      toast.error("Error Fetching Transactions", {
        description: "Failed to load your transactions. Please try again.",
      });
    }
  }, [isError]);

  // Handle refreshing transactions with toast feedback
  const handleRefreshTransactions = async () => {
    try {
      await refetch();
    } catch {
      toast.error("Refresh Failed", {
        description: "Could not refresh transactions. Please try again.",
      });
    }
  };

  return (
    <AppLayout>
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <DashboardHeader username={user?.username} />
          <ActionCards />
          <DashboardMetrics transactions={transactions} />
          <TransactionsTable
            transactions={transactions}
            isLoading={isLoading}
            isRefetching={isRefetching}
            onRefresh={handleRefreshTransactions}
          />
        </div>
      </div>
    </AppLayout>
  );
}
