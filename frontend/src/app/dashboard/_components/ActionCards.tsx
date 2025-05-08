import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiCreditCard,
  FiSearch,
  FiTarget,
} from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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

export function ActionCards() {
  const router = useRouter();

  return (
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
        {actionCards.map((card) => (
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
                    card.name === "Make a Payment" ? "default" : "secondary"
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
  );
}
