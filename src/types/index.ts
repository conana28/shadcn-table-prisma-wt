export interface SearchParams {
  [key: string]: string | string[] | undefined
}

export type Option = {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface DataTableFilterOption<TData> {
  id?: string
  label: string
  value: keyof TData | string
  items: Option[]
  isMulti?: boolean
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[]
}

export type TB = {
  id: number
  vintage: number
  rack: string
  shelf: string
  cost: number
  consume: Date | null
  occasion: string | null
  createdAt: Date
  updatedAt: Date
  wineId: number
  wname: string
  // producer: string
  // wineName: string
  country: string
}
