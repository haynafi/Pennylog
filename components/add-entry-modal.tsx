"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Settings } from "@/types/finance"

interface AddEntryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: "income" | "expense" | "saving"
  settings: Settings
  onAdd: (entry: any) => void
}

export function AddEntryModal({ open, onOpenChange, type, settings, onAdd }: AddEntryModalProps) {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [expenseType, setExpenseType] = useState<"fixed" | "variable">("variable")
  const [frequency, setFrequency] = useState<"daily" | "monthly">("daily")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleAdd = () => {
    if (!amount || (type !== "saving" && !category)) {
      alert("Please fill in all required fields")
      return
    }

    const id = `${type}-${Date.now()}`

    if (type === "income") {
      onAdd({
        id,
        amount: Number.parseFloat(amount),
        category,
        date,
        description,
      })
    } else if (type === "expense") {
      onAdd({
        id,
        amount: Number.parseFloat(amount),
        category,
        type: expenseType,
        date,
        description,
        frequency,
      })
    } else {
      onAdd({
        id,
        amount: Number.parseFloat(amount),
        date,
        description,
      })
    }

    setAmount("")
    setCategory("")
    setDescription("")
    setExpenseType("variable")
    setFrequency("daily")
    setDate(new Date().toISOString().split("T")[0])
  }

  const getCategories = () => {
    if (type === "income") return settings.categories.income
    if (type === "expense") {
      return [...settings.categories.fixedExpense, ...settings.categories.variableExpense]
    }
    return []
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="capitalize">Add {type}</DialogTitle>
          <DialogDescription>Enter the details for your new {type} entry.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
            />
          </div>

          {type !== "saving" && (
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {getCategories().map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {type === "expense" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="expenseType">Expense Type</Label>
                <Select value={expenseType} onValueChange={(value) => setExpenseType(value as "fixed" | "variable")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="variable">Variable</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={(value) => setFrequency(value as "daily" | "monthly")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Add a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Add {type}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
