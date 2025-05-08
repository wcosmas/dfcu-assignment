import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FiSearch,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import { usePayment } from "@/hooks/usePayment";

import { FormInput } from "@/components/ui/form-input";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const statusFormSchema = z.object({
  transactionReference: z.string().min(1, "Transaction reference is required"),
});

type StatusFormValues = z.infer<typeof statusFormSchema>;

interface StatusCheckerProps {
  transactionRef?: string | null;
}

export function StatusChecker({ transactionRef }: StatusCheckerProps) {
  const {
    checkPaymentStatus,
    loading,
    error: apiError,
    statusResult,
    resetState,
  } = usePayment();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StatusFormValues>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      transactionReference: transactionRef || "",
    },
  });

  // Auto-check status if transactionRef is provided via URL
  useEffect(() => {
    if (transactionRef) {
      setValue("transactionReference", transactionRef);
      checkPaymentStatus(transactionRef).catch((error) => {
        console.error("Status check error:", error);
        const message =
          error.response?.data?.message ||
          "Failed to check payment status. Please try again.";
        setGeneralError(message);
      });
    }
  }, [transactionRef, checkPaymentStatus, setValue, setGeneralError]);

  const onSubmit = async (data: StatusFormValues) => {
    setGeneralError(null);
    resetState();

    try {
      await checkPaymentStatus(data.transactionReference);
    } catch (error: any) {
      console.error("Status check error:", error);
      const message =
        error.response?.data?.message ||
        "Failed to check payment status. Please try again.";
      setGeneralError(message);
    }
  };

  const handleReset = () => {
    resetState();
  };

  // Function to get appropriate status variant
  const getStatusVariant = (statusCode: number) => {
    switch (statusCode) {
      case 100:
        return "outline"; // pending
      case 200:
        return "success";
      case 400:
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Function to get appropriate status icon
  const getStatusIcon = (statusCode: number) => {
    switch (statusCode) {
      case 100:
        return <FiClock className="h-5 w-5" />;
      case 200:
        return <FiCheckCircle className="h-5 w-5" />;
      case 400:
        return <FiAlertCircle className="h-5 w-5" />;
      default:
        return <FiSearch className="h-5 w-5" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!statusResult ? (
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle>Check Payment Status</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Enter your transaction reference number to check the status
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {generalError && (
              <Alert variant="destructive" className="mb-4">
                <FiAlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            {apiError && (
              <Alert variant="destructive" className="mb-4">
                <FiAlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                id="transactionReference"
                label="Transaction Reference"
                placeholder="Enter transaction reference"
                leftIcon={<FiSearch className="h-5 w-5" />}
                error={errors.transactionReference?.message}
                {...register("transactionReference")}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Checking...
                  </>
                ) : (
                  "Check Status"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle>Transaction Details</CardTitle>
              <Badge variant={getStatusVariant(statusResult.statusCode) as any}>
                {statusResult.status}
              </Badge>
            </div>
            <CardDescription className="text-primary-foreground/80">
              Details of the payment transaction
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center space-x-4 p-4 bg-accent rounded-md">
              <div className="shrink-0 text-primary">
                {getStatusIcon(statusResult.statusCode)}
              </div>
              <div>
                <div className="font-medium">{statusResult.status}</div>
                <p className="text-sm text-muted-foreground">
                  {statusResult.message}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 p-2 rounded-md bg-accent/50">
                <div className="text-sm font-medium">Reference</div>
                <div className="col-span-2 text-sm">
                  {statusResult.transactionReference}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-2">
                <div className="text-sm font-medium">Status Code</div>
                <div className="col-span-2 text-sm">
                  {statusResult.statusCode}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-2 rounded-md bg-accent/50">
                <div className="text-sm font-medium">Message</div>
                <div className="col-span-2 text-sm">{statusResult.message}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-2">
                <div className="text-sm font-medium">Timestamp</div>
                <div className="col-span-2 text-sm">
                  {new Date(statusResult.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="border-t py-4">
            <Button variant="outline" onClick={handleReset} className="w-full">
              Check Another Transaction
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
