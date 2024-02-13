"use server"

import { SearchParams } from "@/types"
import { Prisma } from "@prisma/client"

import { filterColumn } from "@/lib/filter-column"
import prisma from "@/lib/prisma"
import { searchParamsSchema } from "@/lib/validations/params"

type Task = {
  id: string
  code: string
  title: string
  status: "todo" | "in_progress" | "done" | "canceled"
  label: "bug" | "feature" | "enhancement" | "documentation"
  priority: "low" | "medium" | "high"
}

type bottlesWhereInput = Prisma.BottleWhereInput

export async function getBottles(searchParams: SearchParams) {
  console.log("GetBottle searchParams:", searchParams)
  try {
    // const { page, per_page, sort, title, code, status, priority, operator } =
    const { page, per_page, sort, vintage, rack, shelf, operator } =
      searchParamsSchema.parse(searchParams)

    console.log("sort:", sort)
    const pageAsNumber = Number(page)
    const fallbackPage =
      isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
    const perPageAsNumber = Number(per_page)
    const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
    const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
    // go through sort and see if it needs sorting
    const [column, order] =
      (sort?.split(".") as [
        keyof Task | undefined,
        "asc" | "desc" | undefined,
      ]) ?? []
    // ]) ?? ["vintage", "asc"]

    // const statuses = (status?.split(".") as Task["status"][]) ?? []
    // const priorities = (priority?.split(".") as Task["priority"][]) ?? []

    function buildWhereClause({
      vintage,
      rack,
      shelf,
    }: {
      vintage?: string
      rack?: string
      shelf?: string
    }): bottlesWhereInput | undefined {
      const conditions: Array<bottlesWhereInput> = []

      if (vintage) {
        conditions.push({ vintage: { equals: parseInt(vintage) } })
      }
      if (rack) {
        conditions.push({ rack: { contains: rack } })
      }
      if (shelf) {
        conditions.push({ shelf: { contains: shelf } })
      }

      // if (statuses?.length ?? 0 > 0) {
      //   const statusArray: Status[] = statuses as Status[] // Add type assertion here
      //   conditions.push({ status: { in: statusArray } })
      // }

      console.log(conditions)
      // Combine conditions with AND / OR if any are present
      // return conditions.length > 0 ? { OR: conditions } : undefined
      return conditions.length > 0 ? { AND: conditions } : undefined
    }

    const whereClause = buildWhereClause({
      vintage: vintage,
      rack: rack,
      shelf: shelf,
      // statuses: statuses,
      // priorities: priorities,
    })

    // const whereClause = {}

    const data = await prisma.bottle.findMany({
      where: whereClause,
      // if no column is provided, default to sorting by id/desc
      orderBy: {
        [column ?? "id"]: order ?? "desc",
      },
      skip: offset,
      take: limit,
    })

    const count = await prisma.bottle.count({
      where: whereClause,
    })

    const pageCount = Math.ceil(count / limit)
    return { data, pageCount }
  } catch (err) {
    console.log(err)
    return { data: [], pageCount: 0 }
  }
}
