import React from "react";
import { FiClock } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PaymentStatus } from "@/types";
import {
  StatusIcon,
  getStatusBadgeVariant,
  formatDate,
} from "./StatusBadgeVariant";

interface TransactionDetailsDialogProps {
  open: boolean;
  selectedTransaction: PaymentStatus | null;
  onClose: () => void;
}

export function TransactionDetailsDialog({
  open,
  selectedTransaction,
  onClose,
}: TransactionDetailsDialogProps) {
  if (!selectedTransaction) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StatusIcon status={selectedTransaction.status} />
            Payment Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about this outgoing payment
          </DialogDescription>
        </DialogHeader>

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

                {selectedTransaction.amount && selectedTransaction.currency && (
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

        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
