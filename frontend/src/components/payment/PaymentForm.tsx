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
} from "react-icons/fi";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { usePayment } from "@/hooks/usePayment";
import { PaymentRequest, PaymentResponse } from "@/types";

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
      <div className="w-full max-w-md mx-auto">
        <div className={`rounded-md bg-${statusColor}-50 p-4 mb-6`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {paymentResult.statusCode === 200 ? (
                <FiCheckCircle className={`h-5 w-5 text-${statusColor}-400`} />
              ) : (
                <FiAlertCircle className={`h-5 w-5 text-${statusColor}-400`} />
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

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Transaction Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Payment transaction reference and status
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Transaction Reference
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {paymentResult.transactionReference}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {paymentResult.status || "Processed"}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Message</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                  {paymentResult.message}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6">
          <Button fullWidth onClick={handleNewPayment} size="lg">
            Make Another Payment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Payment</h2>

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
        <Input
          id="payer"
          type="text"
          label="Payer Account"
          placeholder="10-digit account number"
          leftIcon={<FiUser className="h-5 w-5" />}
          error={errors.payer?.message}
          {...register("payer")}
        />

        <Input
          id="payee"
          type="text"
          label="Payee Account"
          placeholder="10-digit account number"
          leftIcon={<FiUsers className="h-5 w-5" />}
          error={errors.payee?.message}
          {...register("payee")}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="amount"
            type="text"
            label="Amount"
            placeholder="e.g. 1000.00"
            leftIcon={<FiDollarSign className="h-5 w-5" />}
            error={errors.amount?.message}
            {...register("amount")}
          />

          <div className="space-y-1">
            <label
              className="text-sm font-medium leading-none text-gray-700"
              htmlFor="currency"
            >
              Currency
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <FiGlobe className="h-5 w-5" />
              </div>
              <select
                id="currency"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                {...register("currency")}
              >
                <option value="UGX">UGX</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            {errors.currency?.message && (
              <p className="text-sm text-red-500">{errors.currency.message}</p>
            )}
          </div>
        </div>

        <Input
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
    </div>
  );
}
