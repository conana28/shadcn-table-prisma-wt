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
    const [column, order] = (sort?.split(".") as [
      keyof Task | undefined,
      "asc" | "desc" | undefined,
    ]) ?? ["vintage", "asc"]
    // const [column, order] = (sort?.split(".") as [
    //   keyof Task | undefined,
    //   "asc" | "desc" | undefined,
    // ]) ?? ["title", "desc"]

    // const statuses = (status?.split(".") as Task["status"][]) ?? []
    // const priorities = (priority?.split(".") as Task["priority"][]) ?? []

    // function buildWhereClause({
    //   // code,
    //   // title,
    //   // statuses,
    //   // priorities,
    //   vintage,
    //   rack,
    //   shelf,
    // }: {
    //   vintage?: number
    //   rack?: string
    //   shelf?: string

    //   // title?: string
    //   // code?: string
    //   // statuses?: string[]
    //   // priorities?: string[]
    // }): bottlesWhereInput | undefined {
    //   const conditions: Array<bottlesWhereInput> = []

    //   if (vintage) {
    //     conditions.push({ vintage: { equals: vintage } })
    //   }
    //   if (rack) {
    //     conditions.push({ rack: { contains: rack } })
    //   }
    //   if (shelf) {
    //     conditions.push({ shelf: { contains: shelf } })
    //   }

    //   // if (title) {
    //   //   conditions.push({ title: { contains: title } })
    //   // }
    //   // if (code) {
    //   //   conditions.push({ code: { contains: code } })
    //   // }
    //   // if (statuses?.length ?? 0 > 0) {
    //   //   const statusArray: Status[] = statuses as Status[] // Add type assertion here
    //   //   conditions.push({ status: { in: statusArray } })
    //   // }

    //   console.log(conditions)
    //   // Combine conditions with OR if any are present
    //   return conditions.length > 0 ? { OR: conditions } : undefined
    // }

    // const whereClause = buildWhereClause({
    //   vintage: vintage,
    //   rack: rack,
    //   shelf: shelf,

    //   // code: code,
    //   // title: title,
    //   // statuses: statuses,
    //   // priorities: priorities,
    // })

    const whereClause = {}

    const data = await prisma.bottle.findMany({
      where: whereClause,
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
