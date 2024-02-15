"use server"

import type { SearchParams } from "@/types"
import type { Prisma } from "@prisma/client"

// import { filterColumn } from "@/lib/filter-column"
import prisma from "@/lib/prisma"
import { searchParamsSchema } from "@/lib/validations/params"

// type Task = {
//   id: string
//   code: string
//   title: string
//   status: "todo" | "in_progress" | "done" | "canceled"
//   label: "bug" | "feature" | "enhancement" | "documentation"
//   priority: "low" | "medium" | "high"
// }

type bottlesWhereInput = Prisma.BottleWhereInput

export async function getBottles(searchParams: SearchParams) {
  console.log("GetBottle searchParams:", searchParams)
  try {
    // const { page, per_page, sort, title, code, status, priority, operator } =
    const {
      page,
      per_page,
      sort,
      wname,
      vintage,
      rack,
      shelf,
      country,
      operator,
    } = searchParamsSchema.parse(searchParams)

    console.log("sort:", sort)
    const pageAsNumber = Number(page)
    const fallbackPage =
      isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber
    const perPageAsNumber = Number(per_page)
    const limit = isNaN(perPageAsNumber) ? 10 : perPageAsNumber
    const offset = fallbackPage > 0 ? (fallbackPage - 1) * limit : 0
    // go through sort and see if it needs sorting
    // const [column, order] =
    //   (sort?.split(".") as [
    //     keyof Task | undefined,
    //     "asc" | "desc" | undefined,
    //   ]) ?? []
    // ]) ?? ["vintage", "asc"]

    // const statuses = (status?.split(".") as Task["status"][]) ?? []
    // const priorities = (priority?.split(".") as Task["priority"][]) ?? []

    function buildWhereClause({
      wname,
      vintage,
      rack,
      shelf,
      country,
    }: {
      wname?: string
      vintage?: string
      rack?: string
      shelf?: string
      country?: string
    }): bottlesWhereInput | undefined {
      const conditions: Array<bottlesWhereInput> = []
      if (wname) {
        conditions.push({
          wine: {
            OR: [
              {
                producer: {
                  contains: wname,
                  mode: "insensitive",
                },
              },
              {
                wineName: {
                  contains: wname,
                  mode: "insensitive",
                },
              },
            ],
          },
        })
      }
      // if (wname) {
      //   conditions.push({
      //     wine: {
      //       producer: {
      //         contains: wname,
      //       },
      //     },
      //   })
      // }
      if (vintage) {
        conditions.push({ vintage: { equals: parseInt(vintage) } })
      }
      if (rack) {
        conditions.push({ rack: { contains: rack, mode: "insensitive" } })
      }
      if (shelf) {
        conditions.push({ shelf: { contains: shelf, mode: "insensitive" } })
      }
      if (country) {
        conditions.push({
          wine: {
            country: {
              contains: country,
            },
          },
        })
      }
      // if (statuses?.length ?? 0 > 0) {
      //   const statusArray: Status[] = statuses as Status[] // Add type assertion here
      //   conditions.push({ status: { in: statusArray } })
      // }

      console.log("Conditions", conditions)
      // Combine conditions with AND / OR if any are present
      // return conditions.length > 0 ? { OR: conditions } : undefined
      return conditions.length > 0 ? { AND: conditions } : undefined
    }

    const whereClause = buildWhereClause({
      wname: wname,
      vintage: vintage,
      rack: rack,
      shelf: shelf,
      country: country,
      // statuses: statuses,
      // priorities: priorities,
    })

    // const whereClause = {}

    const data = await prisma.bottle.findMany({
      where: whereClause,
      // if no column is provided, default to sorting by id/desc
      // orderBy: {
      //   [column ?? "id"]: order ?? "desc",
      // },
      orderBy: { id: "desc" },
      skip: offset,
      take: limit,
      // include wine data
      include: {
        wine: {
          select: {
            id: true,
            producer: true,
            wineName: true,
            country: true,
          },
        },
      },
    })

    const newData = data.map((item) => ({
      id: item.id,
      vintage: item.vintage,
      rack: item.rack,
      shelf: item.shelf,
      cost: item.cost,
      consume: item.consume,
      occasion: item.occasion,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      wineId: item.wineId,
      wname: item.wine.producer + " " + item.wine.wineName,
      // producer: item.wine.producer,
      // wineName: item.wine.wineName,
      country: item.wine.country,
    }))

    const count = await prisma.bottle.count({
      where: whereClause,
    })

    const pageCount = Math.ceil(count / limit)
    return { newData, pageCount }
  } catch (err) {
    console.log(err)
    return { data: [], pageCount: 0 }
  }
}
