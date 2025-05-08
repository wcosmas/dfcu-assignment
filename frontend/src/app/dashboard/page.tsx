"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  FiCreditCard,
  FiSearch,
  FiDollarSign,
  FiClock,
  FiArrowUpRight,
  FiTrendingUp,
  FiTarget,
  FiActivity,
  FiRefreshCw,
} from "react-icons/fi";

import { useAuth } from "@/hooks/api";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";
import { paymentApi } from "@/api/payment";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define cards outside the component to avoid recreation on each render
const actionCards = [
  {
    name: "Make a Payment",
    description: "Send money quickly and securely",
    icon: FiCreditCard,
    href: "/payment/initiate",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    name: "Check Status",
    description: "Track your payment status",
    icon: FiSearch,
    href: "/payment/status",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];

// Animation variants
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

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

  // Show error toast when transaction error occurs
  useEffect(() => {
    if (isError && error) {
      toast.error("Error Fetching Transactions", {
        description: "Failed to load your transactions. Please try again.",
      });
    }
  }, [isError, error]);

  // Handle refreshing transactions with toast feedback
  const handleRefreshTransactions = async () => {
    try {
      await refetch();
    } catch (error) {
      toast.error("Refresh Failed", {
        description: "Could not refresh transactions. Please try again.",
      });
    }
  };

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

  // Format date consistently
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <AppLayout>
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
          >
            <div className="flex items-center space-x-3">
              <div className="h-12 w-1.5 bg-gradient-to-b from-primary to-primary/40 rounded-full"></div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back,{" "}
                  <span className="font-medium text-primary">
                    {user?.username || "Guest"}
                  </span>
                </p>
              </div>
            </div>

            <Button
              onClick={() => router.push("/payment/initiate")}
              className="mt-4 md:mt-0 group"
              size="sm"
            >
              New Payment
              <FiArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Button>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiTarget className="mr-2 h-5 w-5 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {actionCards.map((card, idx) => (
                <motion.div key={card.name} variants={itemVariants}>
                  <Card className="overflow-hidden backdrop-blur-sm bg-gradient-to-br from-background/80 to-background border border-muted/20 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 rounded-xl p-3 ${card.bgColor}`}
                        >
                          <card.icon
                            className={`h-6 w-6 ${card.color}`}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="ml-5">
                          <h3 className="text-lg font-semibold">{card.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {card.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        onClick={() => router.push(card.href)}
                        className="w-full group"
                        variant={
                          card.name === "Make a Payment"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {card.name}
                        <FiArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard metrics section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiActivity className="mr-2 h-5 w-5 text-primary" />
              Overview
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-medium text-muted-foreground">
                    Total Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="rounded-full bg-primary/10 p-2 mr-4">
                      <FiDollarSign className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">
                        {transactions?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Since account creation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-medium text-muted-foreground">
                    Pending Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="rounded-full bg-orange-100 p-2 mr-4">
                      <FiClock className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">
                        {transactions.filter((tx) => tx.status === "PENDING")
                          .length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Awaiting confirmation
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-md font-medium text-muted-foreground">
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="rounded-full bg-green-100 p-2 mr-4">
                      <FiTrendingUp className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">
                        {transactions.length === 0
                          ? "0%"
                          : `${Math.round(
                              (transactions.filter(
                                (tx) => tx.status === "SUCCESSFUL"
                              ).length /
                                transactions.length) *
                                100
                            )}%`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Successful transactions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FiCreditCard className="mr-2 h-5 w-5 text-primary" />
                Recent Transactions
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshTransactions}
                disabled={isLoading || isRefetching}
                className="flex items-center gap-1"
              >
                <FiRefreshCw
                  className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
                />
                {isRefetching ? "Refreshing..." : "Refresh"}
              </Button>
            </div>

            <Card className="shadow-sm overflow-hidden">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Reference
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 hidden md:table-cell"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 hidden sm:table-cell"
                      >
                        Message
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted">
                    {isLoading ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-muted-foreground"
                        >
                          <div className="flex justify-center items-center">
                            <FiRefreshCw className="h-5 w-5 mr-2 animate-spin text-primary" />
                            <span>Loading transactions...</span>
                          </div>
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-12 text-center text-muted-foreground"
                        >
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      transactions.slice(0, 5).map((transaction) => (
                        <tr
                          key={transaction.transactionReference}
                          className="bg-background hover:bg-muted/20 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium">
                            {transaction.transactionReference.substring(0, 8)}
                            ...
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={getStatusBadgeVariant(
                                transaction.status
                              )}
                            >
                              {transaction.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            {transaction.timestamp
                              ? formatDate(transaction.timestamp)
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell text-muted-foreground truncate max-w-[200px]">
                            {transaction.message}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                router.push(
                                  `/payment/status?ref=${transaction.transactionReference}`
                                )
                              }
                              className="text-xs h-auto py-1"
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <CardFooter className="border-t flex justify-between p-4">
                <p className="text-xs text-muted-foreground">
                  Showing {Math.min(transactions.length, 5)} of{" "}
                  {transactions?.length || 0} transactions
                </p>

                <Link
                  href="/transactions"
                  className="text-xs text-primary hover:underline"
                >
                  View All
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
