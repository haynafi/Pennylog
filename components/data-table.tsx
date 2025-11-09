"use client"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import type { IncomeEntry, ExpenseEntry, SavingEntry } from "@/types/finance"

interface DataTableProps {
  title: string
  data: (IncomeEntry | ExpenseEntry | SavingEntry)[]
  columns: string[]
  onDelete: (id: string) => void
  currency: string
  showType?: boolean
}

export function DataTable({ title, data, columns, onDelete, currency, showType = false }: DataTableProps) {
  if (data.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
        <p className="text-muted-foreground text-center py-8">No data available</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th key={col} className="text-left py-3 px-4 font-semibold text-muted-foreground">
                  {col}
                </th>
              ))}
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry: any) => (
              <tr key={entry.id} className="border-b border-border hover:bg-muted/50">
                <td className="py-3 px-4 text-foreground">{new Date(entry.date).toLocaleDateString("id-ID")}</td>
                {columns.includes("Type") && "type" in entry && (
                  <td className="py-3 px-4">
                    <span className="capitalize bg-muted px-2 py-1 rounded text-muted-foreground">{entry.type}</span>
                  </td>
                )}
                {columns.includes("Category") && entry.category && (
                  <td className="py-3 px-4 text-foreground">{entry.category}</td>
                )}
                {columns.includes("Description") && entry.description && (
                  <td className="py-3 px-4 text-muted-foreground">{entry.description}</td>
                )}
                <td className="py-3 px-4 font-semibold text-foreground">
                  {currency}
                  {entry.amount.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(entry.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
