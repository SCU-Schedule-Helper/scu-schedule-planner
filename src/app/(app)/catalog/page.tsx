"use client";

import { CourseCatalog } from "@/components/CourseCatalog/CourseCatalog";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function CatalogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
        <p className="text-gray-600">
          Search and browse courses to add to your academic plan.
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <CourseCatalog />
      </Suspense>
    </div>
  );
}
