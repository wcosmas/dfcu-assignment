import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiCreditCard, FiRefreshCw } from "react-icons/fi";

import { Button } from "@/components/ui/Button";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  status: string;
  transactionReference: string;
  timestamp: string;
  message: string;
};

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => Promise<void>;
}

export function TransactionsTable({
  transactions,
  isLoading,
  isRefetching,
  onRefresh,
}: TransactionsTableProps) {
  const router = useRouter();

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
          onClick={onRefresh}
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
                <th scope="col" className="px-6 py-3 hidden md:table-cell">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 hidden sm:table-cell">
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
                        variant={getStatusBadgeVariant(transaction.status)}
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
  );
}
