"use client";

import React from "react";
import { FiArrowRight, FiShield } from "react-icons/fi";

import { AppLayout } from "@/components/layout/AppLayout";
import { PaymentForm } from "@/components/payment/PaymentForm";

export default function PaymentInitiatePage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="md:mx-0 mb-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-4">
              <FiShield className="mr-1.5 h-3.5 w-3.5" />
              <span>Secure Transaction</span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Make a Payment
            </h1>

            <p className="text-md text-slate-600 dark:text-slate-300 leading-relaxed">
              Transfer funds between accounts quickly and securely with our
              state-of-the-art payment system. All transactions are encrypted
              and processed in real-time for your peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 md:col-span-2">
              <PaymentForm />
            </div>

            <div className="col-span-1 hidden md:block">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm p-6 sticky top-6">
                <h3 className="font-semibold text-lg mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
                  Payment Tips
                </h3>
                <ul className="space-y-4">
                  <li className="flex">
                    <FiArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Double-check account numbers before submitting
                    </span>
                  </li>
                  <li className="flex">
                    <FiArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Include a reference for easy tracking
                    </span>
                  </li>
                  <li className="flex">
                    <FiArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Payments are usually processed within minutes
                    </span>
                  </li>
                  <li className="flex">
                    <FiArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Keep your transaction reference for support inquiries
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
