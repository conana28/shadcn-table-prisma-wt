import * as React from "react"
import { unstable_noStore as noStore } from "next/cache"
import { TB } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, TrashIcon } from "@radix-ui/react-icons"
import { type Table } from "@tanstack/react-table"
import { format, set } from "date-fns"
import { PocketKnife, SendHorizonal } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { catchError } from "@/lib/catch-error"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { consumeBottle, deleteBottle } from "../_lib/b_actions"

export function deleteSelectedRows(
  table: Table<TB>,
  event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
) {
  event?.preventDefault()
  const selectedRows = table.getFilteredSelectedRowModel().rows as {
    original: TB
  }[]

  noStore()
  toast.promise(
    Promise.all(
      selectedRows.map(async (row) =>
        deleteBottle({
          id: row.original.id,
        })
      )
    ),

    {
      position: "top-center",
      loading: "Deleting...",
      success: () => {
        return `${selectedRows.length} Bottles deleted successfully."`
      },
      error: (err: unknown) => {
        return catchError(err)
      },
    }
  )
}

const consumeFormSchema = z.object({
  consumeDate: z.date({
    required_error: "Consume date is required.",
  }),
  ocassion: z.string().optional(),
})

// Show this component in the floating bar at the bottom of the table

export function BottlesTableFloatingBarContent(table: Table<TB>) {
  const [openDialog, setOpenDialog] = React.useState(false)
  // set up the form
  const form = useForm<z.infer<typeof consumeFormSchema>>({
    resolver: zodResolver(consumeFormSchema),
    defaultValues: {
      consumeDate: new Date(),
      ocassion: "",
    },
  })

  function onSubmit(data: z.infer<typeof consumeFormSchema>) {
    // console.log("Submit", data)
    setOpenDialog(false) // Close the dialog
    table.toggleAllPageRowsSelected(false) // Unselect all rows
    const selectedRows = table.getFilteredSelectedRowModel().rows as {
      original: TB
    }[]
    noStore()
    toast.promise(
      Promise.all(
        selectedRows.map(async (row) => {
          await consumeBottle({
            id: row.original.id,
            consumed: data.consumeDate,
          })
          // console.log("consume bottle id: ", row.original.id, data.consumeDate)
        })
      ),

      {
        position: "top-center",
        loading: "Consuming...",
        success: () => {
          return `${selectedRows.length} bottle(s) consumed successfully.`
        },
        error: (err: unknown) => {
          return catchError(err)
        },
      }
    )
    form.reset({ consumeDate: new Date() })
  }

  return (
    <div className="justify-between gap-2 align-middle">
      {/* Consume button */}
      <Button
        title="Consume"
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={(event) => {
          setOpenDialog(true)
        }}
      >
        <PocketKnife className="size-4" aria-hidden="true" />
      </Button>

      {/* Delete Button */}
      <Button
        title="Delete"
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={(event) => {
          table.toggleAllPageRowsSelected(false)
          // console.log("DELETE")
          deleteSelectedRows?.(table, event)
        }}
      >
        <TrashIcon className="size-4" aria-hidden="true" />
        <span className="sr-only">Delete</span>
      </Button>

      <Dialog
        open={openDialog}
        onOpenChange={(isOpen) => {
          table.toggleAllPageRowsSelected(false)
          setOpenDialog(isOpen)
        }}
      >
        {/* <DialogTrigger asChild>
          <Button variant="outline">Consume</Button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Consume bottle(s)</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="consumeDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Consume date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            // disabled={(date) =>
                            //   date > new Date() || date < new Date("1900-01-01")
                            // }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ocassion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocassion</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit</Button>
                {/* <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    console.log("Date")
                    form.reset({ consumeDate: new Date() })
                    onSubmit({ consumeDate: new Date() })
                  }}
                >
                  ConsumeB
                </Button> */}
              </form>
            </Form>
          </div>
          {/* <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  console.log("Date")
                  form.reset({ consumeDate: new Date() })
                  onSubmit({ consumeDate: new Date() })
                }}
              >
                Consume
              </Button>
            </DialogClose>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
