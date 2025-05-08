import React from "react";
import {
  FiClock,
  FiEye,
  FiRefreshCw,
  FiAlertCircle,
  FiFilter,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusBadgeVariant, formatDate } from "./StatusBadgeVariant";
import { PaymentStatus } from "@/types";

interface TransactionsTableProps {
  filteredTransactions: PaymentStatus[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRefetch: () => Promise<void>;
  onViewDetails: (transaction: PaymentStatus) => void;
}

export function TransactionsTable({
  filteredTransactions,
  isLoading,
  isError,
  error,
  onRefetch,
  onViewDetails,
}: TransactionsTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin mr-2">
          <FiRefreshCw className="h-6 w-6 text-primary" />
        </div>
        <span>Loading payments...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-medium">Error loading payments</h3>
        <p className="text-muted-foreground mt-1">
          {error instanceof Error
            ? error.message
            : "An unexpected error occurred"}
        </p>
        <Button onClick={onRefetch} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <div className="text-center py-12">
        <FiFilter className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No payments found</h3>
        <p className="text-muted-foreground mt-1">
          Try changing your filters or search query
        </p>
      </div>
    );
  }

  return (
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
                <Badge variant={getStatusBadgeVariant(transaction.status)}>
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(transaction)}
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
  );
}
