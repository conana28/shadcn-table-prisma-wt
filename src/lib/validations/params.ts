import * as z from "zod"

export const searchParamsSchema = z.object({
  page: z.string().default("1"),
  per_page: z.string().default("5"),
  sort: z.string().optional(),
  name: z.string().optional(),
  // title: z.string().optional(),
  // code: z.string().optional(),
  category: z.string().optional(),
  store: z.string().optional(),
  // status: z.string().optional(),
  // priority: z.string().optional(),
  operator: z.string().optional(),
  wname: z.string().optional(),
  vintage: z.string().optional(),
  rack: z.string().optional(),
  shelf: z.string().optional(),
  country: z.string().optional(),
})
