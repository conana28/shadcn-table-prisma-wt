import * as React from "react"
import type { SearchParams } from "@/types"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { Shell } from "@/components/shell"

import { BottlesTable } from "./_components/bottles-table"
import { getBottles } from "./_lib/b_queries"

export const dynamic = "force-dynamic"

export interface IndexPageProps {
  searchParams: SearchParams
}

export default function IndexPage({ searchParams }: IndexPageProps) {
  const bottlesPromise = getBottles(searchParams)

  return (
    <Shell>
      <React.Suspense
        fallback={
          <DataTableSkeleton columnCount={6} filterableColumnCount={4} />
        }
      >
        {/**
         * The `BottlesTable` component is used to render the `DataTable` component within it.
         * This is done because the table columns need to be memoized, and the `useDataTable` hook needs to be called in a client component.
         * By encapsulating the `DataTable` component within the `tasktableshell` component, we can ensure that the necessary logic and state management is handled correctly.
         */}
        <BottlesTable bottlesPromise={bottlesPromise} />
      </React.Suspense>
    </Shell>
  )
}
