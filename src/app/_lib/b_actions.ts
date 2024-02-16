"use server"

import { revalidatePath } from "next/cache"

import prisma from "@/lib/prisma"

// Delete a bottle
export async function deleteBottle(input: { id: number }) {
  console.log("deleteBottleAction", input)
  await prisma.bottle.delete({ where: { id: input.id } })

  revalidatePath("/")
}

// Mark bottle as consumed
export async function consumeBottle(input: { id: number; consumed: Date }) {
  console.log("consumeBottleAction", input)
  await prisma.bottle.update({
    where: { id: input.id },
    data: {
      consume: input.consumed,
    },
  })
  revalidatePath("/")
}
