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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Settings } from "@/types/finance"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: Settings
  onSave: (settings: Settings) => void
  onClearData?: () => void
}

export function SettingsModal({ open, onOpenChange, settings, onSave, onClearData }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings)
  const [showClearAlert, setShowClearAlert] = useState(false)

  const handleAddCategory = (type: keyof Settings["categories"], category: string) => {
    if (category.trim()) {
      setLocalSettings((prev) => ({
        ...prev,
        categories: {
          ...prev.categories,
          [type]: [...prev.categories[type], category],
        },
      }))
    }
  }

  const handleRemoveCategory = (type: keyof Settings["categories"], index: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [type]: prev.categories[type].filter((_, i) => i !== index),
      },
    }))
  }

  const handleClearAllData = () => {
    if (onClearData) {
      onClearData()
    }
    setShowClearAlert(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Configure your finance app preferences</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="reset">Reset</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="appName">App Name</Label>
                <Input
                  id="appName"
                  placeholder="Life Lo"
                  value={localSettings.appName}
                  onChange={(e) => setLocalSettings((prev) => ({ ...prev, appName: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={localSettings.currency}
                  onValueChange={(value) => setLocalSettings((prev) => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IDR">IDR (Rp)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenseFrequency">Expense Frequency</Label>
                <Select
                  value={localSettings.expenseFrequency}
                  onValueChange={(value) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      expenseFrequency: value as "daily" | "monthly",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6 mt-4">
              {["income", "expense", "fixedExpense", "variableExpense"].map((type) => (
                <CategoryManager
                  key={type}
                  type={type as keyof Settings["categories"]}
                  categories={localSettings.categories[type as keyof Settings["categories"]]}
                  onAdd={(cat) => handleAddCategory(type as keyof Settings["categories"], cat)}
                  onRemove={(idx) => handleRemoveCategory(type as keyof Settings["categories"], idx)}
                />
              ))}
            </TabsContent>

            {/* Reset Tab */}
            <TabsContent value="reset" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="resetCycle">Reset Cycle</Label>
                <Select
                  value={localSettings.resetCycle}
                  onValueChange={(value) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      resetCycle: value as "weekly" | "monthly",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {localSettings.resetCycle === "monthly" && (
                <div className="space-y-2">
                  <Label htmlFor="resetDate">Reset Date (Day of Month)</Label>
                  <Input
                    id="resetDate"
                    type="number"
                    min="1"
                    max="31"
                    value={localSettings.resetDate}
                    onChange={(e) =>
                      setLocalSettings((prev) => ({
                        ...prev,
                        resetDate: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="data" className="space-y-4 mt-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-semibold text-destructive mb-1">Clear All Data</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      This action will permanently delete all your income, expenses, and savings data. This cannot be
                      undone.
                    </p>
                    <Button variant="destructive" size="sm" onClick={() => setShowClearAlert(true)}>
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSave(localSettings)
              }}
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showClearAlert} onOpenChange={setShowClearAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all income, expenses, and savings data? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAllData}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

interface CategoryManagerProps {
  type: keyof Settings["categories"]
  categories: string[]
  onAdd: (category: string) => void
  onRemove: (index: number) => void
}

function CategoryManager({ type, categories, onAdd, onRemove }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("")

  const typeLabel = {
    income: "Income",
    expense: "Expense",
    fixedExpense: "Fixed Expense",
    variableExpense: "Variable Expense",
  }

  return (
    <div className="space-y-3 p-4 border border-border rounded-lg">
      <h4 className="font-semibold text-foreground">{typeLabel[type]} Categories</h4>
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-muted px-3 py-2 rounded text-sm">
            <span>{cat}</span>
            <button
              onClick={() => onRemove(idx)}
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Delete ${cat} category`}
            >
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onAdd(newCategory)
              setNewCategory("")
            }
          }}
        />
        <Button
          variant="outline"
          onClick={() => {
            onAdd(newCategory)
            setNewCategory("")
          }}
        >
          Add
        </Button>
      </div>
    </div>
  )
}
