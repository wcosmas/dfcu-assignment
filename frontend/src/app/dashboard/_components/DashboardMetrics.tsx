import React from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiDollarSign,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Transaction = {
  status: string;
  transactionReference: string;
  timestamp: string;
  message: string;
};

interface DashboardMetricsProps {
  transactions: Transaction[];
}

export function DashboardMetrics({ transactions }: DashboardMetricsProps) {
  return (
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
                        (transactions.filter((tx) => tx.status === "SUCCESSFUL")
                          .length /
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
  );
}
