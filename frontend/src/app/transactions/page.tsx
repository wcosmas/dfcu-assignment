"use client";

import React, { useState } from "react";
import {
  FiRefreshCw,
  FiClock,
  FiList,
  FiFilter,
  FiSearch,
  FiEye,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiClock as FiClockCircle,
} from "react-icons/fi";
import { AppLayout } from "@/components/layout/AppLayout";
import { PaymentStatus } from "@/types";
import { paymentApi } from "@/api/payment";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
    } catch (err) {
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

  // Status badge variants
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "outline";
      case "SUCCESSFUL":
        return "success";
      case "FAILED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Status icon component
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case "PENDING":
        return <FiClockCircle className="h-5 w-5 text-yellow-500" />;
      case "SUCCESSFUL":
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case "FAILED":
        return <FiAlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Format date consistently
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <AppLayout>
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div className="flex items-center space-x-3">
            <div className="h-12 w-1.5 bg-gradient-to-b from-primary to-primary/40 rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Outgoing Payments
              </h1>
              <p className="text-muted-foreground mt-1">
                View and manage your payment transactions
              </p>
            </div>
          </div>

          <Button
            onClick={handleRefreshTransactions}
            className="mt-4 md:mt-0 flex items-center"
            disabled={isLoading || isRefetching}
            variant="outline"
            size="sm"
          >
            <FiRefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </motion.div>

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
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="w-full sm:w-1/3">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Payments</SelectItem>
                        <SelectItem value="SUCCESSFUL">Successful</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-2/3">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search by reference or description"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin mr-2">
                      <FiRefreshCw className="h-6 w-6 text-primary" />
                    </div>
                    <span>Loading payments...</span>
                  </div>
                ) : isError ? (
                  <div className="text-center py-12">
                    <FiAlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
                    <h3 className="text-lg font-medium">
                      Error loading payments
                    </h3>
                    <p className="text-muted-foreground mt-1">
                      {error instanceof Error
                        ? error.message
                        : "An unexpected error occurred"}
                    </p>
                    <Button
                      onClick={handleRefreshTransactions}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <FiFilter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No payments found</h3>
                    <p className="text-muted-foreground mt-1">
                      Try changing your filters or search query
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reference</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>To Account</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((transaction) => (
                          <TableRow
                            key={transaction.transactionReference}
                            className="cursor-pointer hover:bg-muted/50"
                          >
                            <TableCell className="font-mono text-xs">
                              {transaction.transactionReference}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <div className="flex items-center">
                                <FiClock className="mr-1 h-3 w-3 text-muted-foreground" />
                                {formatDate(transaction.timestamp)}
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <span className="font-mono text-xs">
                                {transaction.payeeAccountNumber}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-md truncate">
                              {transaction.message}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={getStatusBadgeVariant(
                                  transaction.status
                                )}
                              >
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(transaction)}
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">View details</span>
                                <FiEye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <StatusIcon status={selectedTransaction?.status || "PENDING"} />
              Payment Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about this outgoing payment
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction ID Banner */}
              <div className="bg-primary/10 p-3 rounded-md flex flex-col items-center">
                <span className="text-xs text-muted-foreground">
                  Transaction Reference
                </span>
                <span className="font-mono text-xs mt-1">
                  {selectedTransaction.transactionReference}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status and Time Column */}
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">
                        Status
                      </span>
                      <div className="flex items-center">
                        <StatusIcon status={selectedTransaction.status} />
                        <Badge
                          variant={getStatusBadgeVariant(
                            selectedTransaction.status
                          )}
                          className="ml-2"
                        >
                          {selectedTransaction.status}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">
                        Date & Time
                      </span>
                      <div className="flex items-center">
                        <FiClock className="mr-2 h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(selectedTransaction.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">
                        Status Code
                      </span>
                      <span className="text-sm font-mono">
                        {selectedTransaction.statusCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Details Column */}
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                    {selectedTransaction.payee && (
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Payee
                        </span>
                        <span className="text-sm font-medium">
                          {selectedTransaction.payee}
                        </span>
                      </div>
                    )}

                    {selectedTransaction.payeeAccountNumber && (
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">
                          Account Number
                        </span>
                        <span className="text-sm font-mono">
                          {selectedTransaction.payeeAccountNumber}
                        </span>
                      </div>
                    )}

                    {selectedTransaction.amount &&
                      selectedTransaction.currency && (
                        <div>
                          <span className="text-xs text-muted-foreground block mb-1">
                            Amount
                          </span>
                          <span className="text-sm font-semibold">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: selectedTransaction.currency,
                            }).format(selectedTransaction.amount)}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground block">
                  Description
                </span>
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                  {selectedTransaction.message}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button onClick={handleCloseDetails} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
