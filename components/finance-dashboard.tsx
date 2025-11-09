"use client"
import type { FinanceData, Settings } from "@/types/finance"
import { Button } from "@/components/ui/button"
import { StatCard } from "./stat-card"
import { DataTable } from "./data-table"
import { AddEntryModal } from "./add-entry-modal"
import { useState } from "react"

interface FinanceDashboardProps {
  data: FinanceData
  setData: (data: FinanceData | ((d: FinanceData) => FinanceData)) => void
  settings: Settings
  onSettingsClick: () => void
}

export function FinanceDashboard({ data, setData, settings, onSettingsClick }: FinanceDashboardProps) {
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addType, setAddType] = useState<"income" | "expense" | "saving">("expense")

  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth())
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const currentDate = now.getDate()

  const isSelectedMonth = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
  }

  const isCurrentDay = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.getDate() === currentDate && date.getMonth() === currentMonth && date.getFullYear() === currentYear
  }

  const monthlyIncome = data.income.filter((i) => isSelectedMonth(i.date)).reduce((sum, i) => sum + i.amount, 0)

  const dailyExpenses = data.expenses
    .filter((e) => isCurrentDay(e.date) && e.type === "variable")
    .reduce((sum, e) => sum + e.amount, 0)

  const monthlyExpenses = data.expenses.filter((e) => isSelectedMonth(e.date)).reduce((sum, e) => sum + e.amount, 0)

  const monthlySavings = data.savings.filter((s) => isSelectedMonth(s.date)).reduce((sum, s) => sum + s.amount, 0)

  const remainingBudget = monthlyIncome - monthlyExpenses

  const fixedExpenses = data.expenses.filter((e) => e.type === "fixed" && isSelectedMonth(e.date))
  const variableExpenses = data.expenses.filter((e) => e.type === "variable" && isSelectedMonth(e.date))

  const years = Array.from({ length: 3 }, (_, i) => currentYear - i).sort((a, b) => b - a)
  const months = Array.from({ length: 12 }, (_, i) => i)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-4 md:p-8">
      {/* Header with Month/Year Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{settings.appName}</h1>
            <div className="flex items-center gap-4 mt-3">
              <p className="text-muted-foreground">
                {now.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="flex gap-2 items-center">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-3 py-1 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {new Date(2024, m).toLocaleDateString("en-US", { month: "short" })}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-1 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

                {(selectedMonth !== currentMonth || selectedYear !== currentYear) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMonth(currentMonth)
                      setSelectedYear(currentYear)
                    }}
                    className="text-xs"
                  >
                    Today
                  </Button>
                )}
              </div>
            </div>
          </div>
          <Button variant="outline" size="icon" onClick={onSettingsClick} className="rounded-full bg-transparent">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572-1.065c-.426-1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Monthly Income" value={monthlyIncome} currency={settings.currencySymbol} variant="income" />
        <StatCard label="Daily Expense" value={dailyExpenses} currency={settings.currencySymbol} variant="expense" />
        <StatCard
          label="Monthly Expense"
          value={monthlyExpenses}
          currency={settings.currencySymbol}
          variant="expense"
        />
        <StatCard
          label="Remaining Budget"
          value={remainingBudget}
          currency={settings.currencySymbol}
          variant={remainingBudget >= 0 ? "income" : "expense"}
        />
        <StatCard label="Monthly Savings" value={monthlySavings} currency={settings.currencySymbol} variant="income" />
      </div>

      <div className="mb-8">
        <div className="relative inline-block group">
          <Button className="gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Data
          </Button>

          {/* Dropdown menu */}
          <div className="absolute left-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
            <button
              onClick={() => {
                setAddType("income")
                setAddModalOpen(true)
              }}
              className="w-full text-left px-4 py-2 hover:bg-muted first:rounded-t-lg transition-colors"
            >
              Income
            </button>
            <button
              onClick={() => {
                setAddType("expense")
                setAddModalOpen(true)
              }}
              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
            >
              Expense
            </button>
            <button
              onClick={() => {
                setAddType("saving")
                setAddModalOpen(true)
              }}
              className="w-full text-left px-4 py-2 hover:bg-muted last:rounded-b-lg transition-colors"
            >
              Saving
            </button>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="space-y-6">
        <DataTable
          title="Income Transactions"
          data={data.income
            .filter((i) => isSelectedMonth(i.date))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          columns={["Date", "Category", "Description", "Amount"]}
          onDelete={(id) =>
            setData((prev) => ({
              ...prev,
              income: prev.income.filter((i) => i.id !== id),
            }))
          }
          currency={settings.currencySymbol}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DataTable
            title="Fixed Expenses"
            data={fixedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
            columns={["Date", "Category", "Description", "Amount"]}
            onDelete={(id) =>
              setData((prev) => ({
                ...prev,
                expenses: prev.expenses.filter((e) => e.id !== id),
              }))
            }
            currency={settings.currencySymbol}
          />

          <DataTable
            title="Variable Expenses"
            data={variableExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
            columns={["Date", "Category", "Description", "Amount"]}
            onDelete={(id) =>
              setData((prev) => ({
                ...prev,
                expenses: prev.expenses.filter((e) => e.id !== id),
              }))
            }
            currency={settings.currencySymbol}
          />
        </div>

        <DataTable
          title="All Expenses"
          data={data.expenses
            .filter((e) => isSelectedMonth(e.date))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          columns={["Date", "Type", "Category", "Description", "Amount"]}
          onDelete={(id) =>
            setData((prev) => ({
              ...prev,
              expenses: prev.expenses.filter((e) => e.id !== id),
            }))
          }
          currency={settings.currencySymbol}
          showType
        />

        <DataTable
          title="Savings"
          data={data.savings
            .filter((s) => isSelectedMonth(s.date))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
          columns={["Date", "Description", "Amount"]}
          onDelete={(id) =>
            setData((prev) => ({
              ...prev,
              savings: prev.savings.filter((s) => s.id !== id),
            }))
          }
          currency={settings.currencySymbol}
        />
      </div>

      <AddEntryModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        type={addType}
        settings={settings}
        onAdd={(entry) => {
          setData((prev) => {
            if (addType === "income") {
              return { ...prev, income: [...prev.income, entry as any] }
            } else if (addType === "expense") {
              return { ...prev, expenses: [...prev.expenses, entry as any] }
            } else {
              return { ...prev, savings: [...prev.savings, entry as any] }
            }
          })
          setAddModalOpen(false)
        }}
      />
    </div>
  )
}
