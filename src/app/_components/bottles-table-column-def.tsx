"use client"

// import { tasks, type Task } from "@/db/schema"
import type {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  TB,
} from "@/types"
import { Bottle } from "@prisma/client"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  DotsHorizontalIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"

import { catchError } from "@/lib/catch-error"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

// import { deleteTask, updateTaskLabel } from "../_lib/actions"

// export function fetchTasksTableColumnDefs(
//   isPending: boolean,
//   startTransition: React.TransitionStartFunction
// ): ColumnDef<Task, unknown>[] {
//   return [
//     {
//       id: "select",
//       header: ({ table }) => (
//         <Checkbox
//           checked={table.getIsAllPageRowsSelected()}
//           onCheckedChange={(value) => {
//             table.toggleAllPageRowsSelected(!!value)
//           }}
//           aria-label="Select all"
//           className="translate-y-[2px]"
//         />
//       ),
//       cell: ({ row }) => (
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => {
//             row.toggleSelected(!!value)
//           }}
//           aria-label="Select row"
//           className="translate-y-[2px]"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "code",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Task" />
//       ),
//       cell: ({ row }) => <div className="w-[80px]">{row.getValue("code")}</div>,
//       enableSorting: false,
//       enableHiding: false,
//     },
//     {
//       accessorKey: "title",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Title" />
//       ),
//       cell: ({ row }) => {
//         const label = tasks.label.enumValues.find(
//           (label) => label === row.original.label
//         )

//         return (
//           <div className="flex space-x-2">
//             {label && <Badge variant="outline">{label}</Badge>}
//             <span className="max-w-[500px] truncate font-medium">
//               {row.getValue("title")}
//             </span>
//           </div>
//         )
//       },
//     },
//     {
//       accessorKey: "status",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Status" />
//       ),
//       cell: ({ row }) => {
//         const status = tasks.status.enumValues.find(
//           (status) => status === row.original.status
//         )

//         if (!status) return null

//         return (
//           <div className="flex w-[100px] items-center">
//             {status === "canceled" ? (
//               <CrossCircledIcon
//                 className="mr-2 size-4 text-muted-foreground"
//                 aria-hidden="true"
//               />
//             ) : status === "done" ? (
//               <CheckCircledIcon
//                 className="mr-2 size-4 text-muted-foreground"
//                 aria-hidden="true"
//               />
//             ) : status === "in_progress" ? (
//               <StopwatchIcon
//                 className="mr-2 size-4 text-muted-foreground"
//                 aria-hidden="true"
//               />
//             ) : status === "todo" ? (
//               <QuestionMarkCircledIcon
//                 className="mr-2 size-4 text-muted-foreground"
//                 aria-hidden="true"
//               />
//             ) : (
//               <CircleIcon
//                 className="mr-2 size-4 text-muted-foreground"
//                 aria-hidden="true"
//               />
//             )}
//             <span className="capitalize">{status}</span>
//           </div>
//         )
//       },
//       filterFn: (row, id, value) => {
//         return value instanceof Array && value.includes(row.getValue(id))
//       },
//     },
//     {
//       accessorKey: "priority",
//       header: ({ column }) => (
//         <DataTableColumnHeader column={column} title="Priority" />
//       ),
//       cell: ({ row }) => {
//         const priority = tasks.priority.enumValues.find(
//           (priority) => priority === row.original.priority
//         )

//         if (!priority) {
//           return null
//         }

//         return (
//           <div className="flex items-center">
//             {priority === "low" ? (
//               <ArrowDownIcon
//                 className="mr-2 size-4 text-muted-foreground"
//                 aria-hidden="true"
//               />
//             ) : priority === "medium" ? (
//               <ArrowRightIcon
//                 className="mr-2 size-4 text-muted-foreground"
//                 aria-hidden="true"
//               />
//             ) : priority === "high" ? (
//               <ArrowUpIcon
//                 className="mr-2 size-4 text-muted-foreground"
//                 aria-hidden="true"
//               />
//             ) : (
//               <CircleIcon
//                 className="mr-2 size-4 text-muted-foreground"
//                 aria-hidden="true"
//               />
//             )}
//             <span className="capitalize">{priority}</span>
//           </div>
//         )
//       },
//       filterFn: (row, id, value) => {
//         return value instanceof Array && value.includes(row.getValue(id))
//       },
//     },
//     {
//       id: "actions",
//       cell: ({ row }) => (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button
//               aria-label="Open menu"
//               variant="ghost"
//               className="flex size-8 p-0 data-[state=open]:bg-muted"
//             >
//               <DotsHorizontalIcon className="size-4" aria-hidden="true" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end" className="w-[160px]">
//             <DropdownMenuSub>
//               <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
//               <DropdownMenuSubContent>
//                 <DropdownMenuRadioGroup
//                   value={row.original.label}
//                   onValueChange={(value) => {
//                     startTransition(async () => {
//                       await updateTaskLabel({
//                         id: row.original.id,
//                         label: value as Task["label"],
//                       })
//                     })
//                   }}
//                 >
//                   {tasks.label.enumValues.map((label) => (
//                     <DropdownMenuRadioItem
//                       key={label}
//                       value={label}
//                       className="capitalize"
//                       disabled={isPending}
//                     >
//                       {label}
//                     </DropdownMenuRadioItem>
//                   ))}
//                 </DropdownMenuRadioGroup>
//               </DropdownMenuSubContent>
//             </DropdownMenuSub>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem
//               onClick={() => {
//                 startTransition(() => {
//                   row.toggleSelected(false)

//                   toast.promise(
//                     deleteTask({
//                       id: row.original.id,
//                     }),
//                     {
//                       loading: "Deleting...",
//                       success: () => "Task deleted successfully.",
//                       error: (err: unknown) => catchError(err),
//                     }
//                   )
//                 })
//               }}
//             >
//               Delete
//               <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       ),
//     },
//   ]
// }

export function fetchBottlesTableColumnDefs(
  isPending: boolean,
  startTransition: React.TransitionStartFunction
): ColumnDef<TB, unknown>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    // create a colunme with both producer and wineName
    {
      id: "wname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Wine" />
      ),
      cell: ({ row }) => <div>{row.original.wname}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "country",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Country" />
      ),
      cell: ({ row }) => <div>{row.getValue("country")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "vintage",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Vintage" />
      ),
      cell: ({ row }) => <div>{row.getValue("vintage")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "rack",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rack" />
      ),
      cell: ({ row }) => <div>{row.getValue("rack")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "shelf",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Shelf" />
      ),
      cell: ({ row }) => <div>{row.getValue("shelf")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bottle Id" />
      ),
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   id: "actions",
    //   cell: ({ row }) => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button
    //           aria-label="Open menu"
    //           variant="ghost"
    //           className="flex size-8 p-0 data-[state=open]:bg-muted"
    //         >
    //           <DotsHorizontalIcon className="size-4" aria-hidden="true" />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end" className="w-[160px]">
    //         <DropdownMenuSub>
    //           <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
    //           <DropdownMenuSubContent>
    //             <DropdownMenuRadioGroup
    //               value={row.original.label}
    //               onValueChange={(value) => {
    //                 startTransition(async () => {
    //                   await updateTaskLabel({
    //                     id: row.original.id,
    //                     label: value as Task["label"],
    //                   })
    //                 })
    //               }}
    //             >
    //               {tasks.label.enumValues.map((label) => (
    //                 <DropdownMenuRadioItem
    //                   key={label}
    //                   value={label}
    //                   className="capitalize"
    //                   disabled={isPending}
    //                 >
    //                   {label}
    //                 </DropdownMenuRadioItem>
    //               ))}
    //             </DropdownMenuRadioGroup>
    //           </DropdownMenuSubContent>
    //         </DropdownMenuSub>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuItem
    //           onClick={() => {
    //             startTransition(() => {
    //               row.toggleSelected(false)

    //               toast.promise(
    //                 deleteTask({
    //                   id: row.original.id,
    //                 }),
    //                 {
    //                   loading: "Deleting...",
    //                   success: () => "Task deleted successfully.",
    //                   error: (err: unknown) => catchError(err),
    //                 }
    //               )
    //             })
    //           }}
    //         >
    //           Delete
    //           <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // },
  ]
}

export const filterableColumns: DataTableFilterableColumn<TB>[] = [
  {
    id: "country",
    title: "Country",
    options: [
      { label: "New Zealand", value: "New Zealand" },
      { label: "France", value: "France" },
      { label: "Italy", value: "Italy" },
      { label: "Spain", value: "Spain" },
      { label: "Australia", value: "Australia" },
      { label: "Germany", value: "Germany" },
      { label: "Greece", value: "Greece" },
      { label: "Portugal", value: "Portugal" },
      { label: "Argentina", value: "Argentina" },
      { label: "USA", value: "USA" },
      { label: "Chile", value: "Chile" },
      { label: "South Africa", value: "South Africa" },
      { label: "Austria", value: "Austria" },
    ],
  },
]

export const searchableColumns: DataTableSearchableColumn<TB>[] = [
  {
    id: "wname",
    title: "wine",
  },
  {
    id: "vintage",
    title: "vintage",
  },
  {
    id: "rack",
    title: "rack",
  },
  {
    id: "shelf",
    title: "shelf",
  },
]
