"use client"

import { Suspense } from "react"
import ResultsPage from "@/components/results-page"

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResultsPage />
    </Suspense>
  )
}
