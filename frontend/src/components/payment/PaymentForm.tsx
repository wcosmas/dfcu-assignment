import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FiUser,
  FiUsers,
  FiDollarSign,
  FiGlobe,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
import { usePayment } from "@/hooks/usePayment";
import { PaymentRequest, PaymentResponse } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const paymentFormSchema = z.object({
  payer: z
    .string()
    .min(1, "Payer account is required")
    .length(10, "Payer account must be 10 digits")
    .regex(/^\d+$/, "Payer account must contain only numbers"),
  payee: z
    .string()
    .min(1, "Payee account is required")
    .length(10, "Payee account must be 10 digits")
    .regex(/^\d+$/, "Payee account must contain only numbers"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number",
    }),
  currency: z.enum(["UGX", "USD", "EUR", "GBP"], {
    errorMap: () => ({ message: "Please select a valid currency" }),
  }),
  payerReference: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function PaymentForm() {
  const {
    initiatePayment,
    loading,
    error: apiError,
    paymentResult,
    resetState,
  } = usePayment();
  const [generalError, setGeneralError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      payer: "",
      payee: "",
      amount: "",
      currency: "UGX",
      payerReference: "",
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    setGeneralError(null);
    resetState();

    try {
      const paymentRequest: PaymentRequest = {
        payer: data.payer,
        payee: data.payee,
        amount: parseFloat(data.amount),
        currency: data.currency,
        payerReference: data.payerReference,
      };

      await initiatePayment(paymentRequest);
    } catch (error: any) {
      console.error("Payment error:", error);
      const message =
        error.response?.data?.message || "Payment failed. Please try again.";
      setGeneralError(message);
    }
  };

  const handleNewPayment = () => {
    resetState();
    reset();
  };

  // Status indicator colors based on status code
  const getStatusColor = (statusCode?: number) => {
    if (!statusCode) return "gray";

    switch (statusCode) {
      case 100:
        return "yellow";
      case 200:
        return "green";
      case 400:
        return "red";
      default:
        return "gray";
    }
  };

  // Show the payment result if we have one
  if (paymentResult) {
    const statusColor = getStatusColor(paymentResult.statusCode);

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Transaction Complete</CardTitle>
          <CardDescription>Your payment has been processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`rounded-md bg-${statusColor}-50 p-4 mb-6`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {paymentResult.statusCode === 200 ? (
                  <FiCheckCircle
                    className={`h-5 w-5 text-${statusColor}-400`}
                  />
                ) : (
                  <FiAlertCircle
                    className={`h-5 w-5 text-${statusColor}-400`}
                  />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium text-${statusColor}-800`}>
                  {paymentResult.status || "Transaction processed"}
                </h3>
                <div className={`mt-2 text-sm text-${statusColor}-700`}>
                  <p>{paymentResult.message}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-5 sm:px-6">
              <h3 className="text-base font-medium text-gray-900">
                Transaction Details
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-white px-4 py-5 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Transaction Reference
                  </dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {paymentResult.transactionReference}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {paymentResult.status || "Processed"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 grid grid-cols-3 gap-4">
                  <dt className="text-sm font-medium text-gray-500">Message</dt>
                  <dd className="text-sm text-gray-900 col-span-2">
                    {paymentResult.message}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            fullWidth
            onClick={handleNewPayment}
            size="lg"
            leftIcon={<FiArrowLeft />}
          >
            Make Another Payment
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Make a Payment</CardTitle>
        <CardDescription>
          Transfer funds between accounts securely
        </CardDescription>
      </CardHeader>
      <CardContent>
        {generalError && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {generalError}
                </h3>
              </div>
            </div>
          </div>
        )}

        {apiError && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{apiError}</h3>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            id="payer"
            type="text"
            label="Payer Account"
            placeholder="10-digit account number"
            leftIcon={<FiUser className="h-5 w-5" />}
            error={errors.payer?.message}
            {...register("payer")}
          />

          <FormInput
            id="payee"
            type="text"
            label="Payee Account"
            placeholder="10-digit account number"
            leftIcon={<FiUsers className="h-5 w-5" />}
            error={errors.payee?.message}
            {...register("payee")}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="amount"
              type="text"
              label="Amount"
              placeholder="e.g. 1000.00"
              leftIcon={<FiDollarSign className="h-5 w-5" />}
              error={errors.amount?.message}
              {...register("amount")}
            />

            <div className="space-y-1.5">
              <label
                className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300"
                htmlFor="currency"
              >
                Currency
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <FiGlobe className="h-5 w-5" />
                </div>
                <select
                  id="currency"
                  className="flex h-9 w-full rounded-md border border-gray-300 bg-transparent pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                  {...register("currency")}
                >
                  <option value="UGX">UGX</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              {errors.currency?.message && (
                <p className="text-sm text-red-500">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>

          <FormInput
            id="payerReference"
            type="text"
            label="Reference (Optional)"
            placeholder="Optional payment reference"
            leftIcon={<FiFileText className="h-5 w-5" />}
            error={errors.payerReference?.message}
            {...register("payerReference")}
          />

          <Button type="submit" fullWidth size="lg" isLoading={loading}>
            Make Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
