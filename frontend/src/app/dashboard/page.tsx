"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiCreditCard, FiSearch, FiDollarSign, FiClock } from "react-icons/fi";
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
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <AppLayout>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <p className="text-sm text-muted-foreground">
              Welcome back,{" "}
              <span className="font-medium">{user?.username || "Guest"}</span>
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {/* Quick Actions Grid */}
            <h2 className="text-lg font-medium text-primary mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
              {actionCards.map((card) => (
                <Card
                  key={card.name}
                  className="overflow-hidden shadow-md border-none"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 rounded-md p-3 ${card.bgColor}`}
                      >
                        <card.icon
                          className={`h-6 w-6 ${card.color}`}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium">{card.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      onClick={() => router.push(card.href)}
                      className="w-full"
                      variant={
                        card.name === "Make a Payment" ? "default" : "secondary"
                      }
                    >
                      Go to {card.name}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Recent Transactions */}
            <h2 className="text-lg font-medium text-primary mt-8 mb-4">
              Recent Transactions
            </h2>
            <Card className="shadow-md border-none">
              {displayTransactions.length > 0 ? (
                <ul className="divide-y">
                  {displayTransactions.map((transaction) => (
                    <li key={transaction.transactionReference}>
                      <div className="p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="truncate text-sm font-medium text-primary">
                            {transaction.transactionReference}
                          </div>
                          <div className="ml-2 flex flex-shrink-0">
                            <Badge
                              variant={
                                getStatusBadgeVariant(transaction.status) as any
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="flex">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <FiClock className="mr-1.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                              <p>{formatDate(transaction.timestamp)}</p>
                            </div>
                          </div>
                          <div className="flex items-center text-sm">
                            <Link
                              href={`/payment/status?ref=${transaction.transactionReference}`}
                              className="text-primary underline-offset-4 hover:underline text-sm font-medium"
                            >
                              View details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <CardContent className="py-12 text-center">
                  <FiDollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-medium">No transactions</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You haven't made any transactions yet.
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => router.push("/payment/initiate")}
                      size="sm"
                    >
                      Make your first payment
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
