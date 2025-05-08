"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
} from "react-icons/fi";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import { PaymentStatus } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

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
  const {
    getTransactionHistory,
    loading: paymentLoading,
    transactions,
  } = usePayment();
  const [recentTransactions, setRecentTransactions] = useState<PaymentStatus[]>(
    []
  );
  const [mockTransactions, setMockTransactions] = useState<PaymentStatus[]>([]);

  // Initialize mock data on client-side only
  useEffect(() => {
    // Create timestamps based on relative time to avoid hydration mismatch
    const now = new Date();
    const oneHourAgo = new Date(now);
    oneHourAgo.setHours(now.getHours() - 1);
    const twoHoursAgo = new Date(now);
    twoHoursAgo.setHours(now.getHours() - 2);

    setMockTransactions([
      {
        transactionReference: "TRX-123456-ABCDEF",
        status: "SUCCESSFUL",
        statusCode: 200,
        message: "Transaction successfully processed",
        timestamp: now.toISOString(),
      },
      {
        transactionReference: "TRX-234567-BCDEFG",
        status: "PENDING",
        statusCode: 100,
        message: "Transaction Pending",
        timestamp: oneHourAgo.toISOString(),
      },
      {
        transactionReference: "TRX-345678-CDEFGH",
        status: "FAILED",
        statusCode: 400,
        message: "Transaction failed: Insufficient funds",
        timestamp: twoHoursAgo.toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        await getTransactionHistory();
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    fetchTransactions();
  }, [getTransactionHistory]);

  useEffect(() => {
    setRecentTransactions(transactions.slice(0, 5));
  }, [transactions]);

  // Use either real data or mock data
  const displayTransactions =
    recentTransactions.length > 0 ? recentTransactions : mockTransactions;

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

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <FiDollarSign className="mr-2 h-5 w-5 text-primary" />
                Recent Transactions
              </h2>
              {displayTransactions.length > 0 && (
                <Link
                  href="/payment/status"
                  className="text-primary text-sm font-medium hover:underline flex items-center"
                >
                  View all
                  <FiArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              )}
            </div>
            <Card className="shadow-sm border-muted/20 backdrop-blur-sm overflow-hidden">
              {displayTransactions.length > 0 ? (
                <ul className="divide-y divide-muted/10">
                  {displayTransactions.map((transaction, idx) => (
                    <motion.li
                      key={transaction.transactionReference}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                    >
                      <div className="p-4 hover:bg-accent/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="truncate text-sm font-medium">
                            {transaction.transactionReference}
                          </div>
                          <div className="ml-2 flex flex-shrink-0">
                            <Badge
                              variant={
                                getStatusBadgeVariant(transaction.status) as any
                              }
                              className="rounded-full px-3"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="flex">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <FiClock className="mr-1.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                              <p>{formatDate(transaction.timestamp)}</p>
                            </div>
                          </div>
                          <Link
                            href={`/payment/status?ref=${transaction.transactionReference}`}
                            className="text-primary flex items-center text-sm font-medium hover:underline"
                          >
                            View details
                            <FiArrowUpRight className="ml-1 h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <CardContent className="py-16 text-center">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                  >
                    <div className="bg-primary/5 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                      <FiDollarSign className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">
                      No transactions yet
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                      When you make payments, they'll appear here for easy
                      tracking and management.
                    </p>
                    <div className="mt-6">
                      <Button
                        onClick={() => router.push("/payment/initiate")}
                        size="lg"
                        className="group"
                      >
                        Make your first payment
                        <FiArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
