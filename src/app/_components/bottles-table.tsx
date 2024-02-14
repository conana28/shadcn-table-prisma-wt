"use client"

import * as React from "react"
import { TB } from "@/types"
import { Bottle } from "@prisma/client"
import { type ColumnDef } from "@tanstack/react-table"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"

import { type getBottles } from "../_lib/b_queries"
import { BottlesTableFloatingBarContent } from "./bottles-table-action"
// import {
//   deleteSelectedRows,
//   TasksTableFloatingBarContent,
// } from "./tasks-table-actions"
import {
  fetchBottlesTableColumnDefs,
  // fetchTasksTableColumnDefs,
  filterableColumns,
  searchableColumns,
} from "./bottles-table-column-def"

interface TasksTableProps {
  bottlesPromise: ReturnType<typeof getBottles>
}

export function BottlesTable({ bottlesPromise }: TasksTableProps) {
  // Learn more about React.use here: https://react.dev/reference/react/use
  // const { data, pageCount } = React.use(bottlesPromise)

  const [data, setData] = React.useState<TB[]>([])
  const [pageCount, setPageCount] = React.useState<number>(0)

  const [isPending, startTransition] = React.useTransition()

  React.useEffect(() => {
    bottlesPromise.then((data) => {
      if (data) {
        setData(data.newData as TB[])
        setPageCount(data.pageCount)
      }
    })
  }, [bottlesPromise])

  // Memoize the columns so they don't re-render on every render
  const columns = React.useMemo<ColumnDef<TB, unknown>[]>(
    () => fetchBottlesTableColumnDefs(isPending, startTransition),
    [isPending]
  )

  const { dataTable } = useDataTable({
    data,
    columns,
    pageCount,
    searchableColumns,
    filterableColumns,
  })

  return (
    <DataTable
      dataTable={dataTable}
      columns={columns}
      searchableColumns={searchableColumns}
      filterableColumns={filterableColumns}
      floatingBarContent={BottlesTableFloatingBarContent(dataTable)}
      // deleteRowsAction={(event) => deleteSelectedRows(dataTable, event)}
    />
  )
}
