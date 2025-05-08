import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  username: string | undefined;
}

export function DashboardHeader({ username }: DashboardHeaderProps) {
  const router = useRouter();

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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back,{" "}
            <span className="font-medium text-primary">
              {username || "Guest"}
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
  );
}
