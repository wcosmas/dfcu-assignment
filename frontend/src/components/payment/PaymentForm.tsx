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

import { usePaymentWithToast } from "@/hooks/api";
import { PaymentRequest } from "@/types";

import { FormInput } from "@/components/ui/FormInput";
import { Button } from "@/components/ui/Button";
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
  const { initiatePayment, loading, paymentResult } = usePaymentWithToast();

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
    }
  };

  const handleNewPayment = () => {
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
              placeholder="0.00"
              leftIcon={<FiDollarSign className="h-5 w-5" />}
              error={errors.amount?.message}
              {...register("amount")}
            />

            <div className="space-y-2">
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-gray-700"
              >
                Currency
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiGlobe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="currency"
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
                    errors.currency ? "border-red-500" : ""
                  }`}
                  {...register("currency")}
                >
                  <option value="UGX">UGX</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                {errors.currency && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.currency.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <FormInput
            id="payerReference"
            type="text"
            label="Reference (Optional)"
            placeholder="Enter reference for this payment"
            leftIcon={<FiFileText className="h-5 w-5" />}
            error={errors.payerReference?.message}
            {...register("payerReference")}
          />

          <Button
            fullWidth
            type="submit"
            size="lg"
            isLoading={loading}
            disabled={loading}
          >
            {loading ? "Processing..." : "Make Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
