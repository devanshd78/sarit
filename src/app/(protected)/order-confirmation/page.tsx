"use client";

import { Suspense } from "react";
import OrderConfirmationPage from "./OrderConfirmation";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <OrderConfirmationPage />
    </Suspense>
  );
}
