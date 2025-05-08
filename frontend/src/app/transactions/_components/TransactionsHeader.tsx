import React from "react";
import { motion } from "framer-motion";
import { FiRefreshCw } from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface TransactionsHeaderProps {
  isLoading: boolean;
  isRefetching: boolean;
  onRefresh: () => Promise<void>;
}

export function TransactionsHeader({
  isLoading,
  isRefetching,
  onRefresh,
}: TransactionsHeaderProps) {
  return (
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
        onClick={onRefresh}
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
  );
}
