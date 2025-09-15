"use client";

import { Suspense } from "react";
import CollectionsPage from "../CollectionsPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <CollectionsPage />
    </Suspense>
  );
}
