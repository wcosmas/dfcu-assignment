"use client";

import React, { useState } from "react";
import { FiList } from "react-icons/fi";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { PaymentStatus } from "@/types";
import { paymentApi } from "@/api/payment";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";

import { AppLayout } from "@/components/layout/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import components from _components
import {
  TransactionsHeader,
  TransactionsFilters,
  TransactionsTable,
  TransactionDetailsDialog,
} from "./_components";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function TransactionsPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentStatus | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Use React Query to fetch transaction data
  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: [QUERY_KEYS.PAYMENT.HISTORY],
    queryFn: paymentApi.getTransactionHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

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

  // Open transaction details dialog
  const handleViewDetails = (transaction: PaymentStatus) => {
    // Try to extract payee account from message if not directly available
    if (!transaction.payeeAccountNumber && transaction.message) {
      // Pattern matching for account numbers in message (assuming format like AC-XXXXXXXX or similar)
      const accountMatch =
        transaction.message.match(/AC[-\s]?(\d{8,12})/i) ||
        transaction.message.match(/account[-\s:]+(\d{8,12})/i) ||
        transaction.message.match(/\b(\d{10,12})\b/);

      if (accountMatch && accountMatch[1]) {
        transaction = {
          ...transaction,
          payeeAccountNumber: accountMatch[1],
        };
      }

      // Try to extract payee name if not available
      if (!transaction.payee) {
        const nameMatch = transaction.message.match(
          /to\s+([A-Za-z\s]+)(?=\s+completed|\s+pending|\s+failed)/i
        );
        if (nameMatch && nameMatch[1]) {
          transaction = {
            ...transaction,
            payee: nameMatch[1].trim(),
          };
        }
      }

      // Try to extract amount if not available
      if (!transaction.amount) {
        const amountMatch = transaction.message.match(/([0-9,]+\.\d{2})/);
        if (amountMatch && amountMatch[1]) {
          transaction = {
            ...transaction,
            amount: parseFloat(amountMatch[1].replace(/,/g, "")),
            currency: "UGX", // Default currency
          };
        }
      }
    }

    setSelectedTransaction(transaction);
    setShowDetailsDialog(true);
  };

  // Close transaction details dialog
  const handleCloseDetails = () => {
    setShowDetailsDialog(false);
    setTimeout(() => setSelectedTransaction(null), 300); // Clear after animation completes
  };

  // Filter transactions based on status and search query
  const filteredTransactions = (transactions || []).filter((tx) => {
    // Apply status filter
    if (filter !== "all" && tx.status !== filter) {
      return false;
    }

    // Apply search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        tx.transactionReference.toLowerCase().includes(query) ||
        tx.message.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <AppLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <TransactionsHeader
          isLoading={isLoading}
          isRefetching={isRefetching}
          onRefresh={handleRefreshTransactions}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <FiList className="mr-2 h-5 w-5 text-primary" />
                  Outgoing Transaction History
                </CardTitle>
                <CardDescription>
                  {filteredTransactions.length} payments found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsFilters
                  filter={filter}
                  searchQuery={searchQuery}
                  setFilter={setFilter}
                  setSearchQuery={setSearchQuery}
                />

                <TransactionsTable
                  filteredTransactions={filteredTransactions}
                  isLoading={isLoading}
                  isError={isError}
                  error={error}
                  onRefetch={handleRefreshTransactions}
                  onViewDetails={handleViewDetails}
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <TransactionDetailsDialog
        open={showDetailsDialog}
        selectedTransaction={selectedTransaction}
        onClose={handleCloseDetails}
      />
    </AppLayout>
  );
}
