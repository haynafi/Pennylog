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
  const [addMenuOpen, setAddMenuOpen] = useState(false)

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

  const activeBudget = settings.expenseFrequency === "daily" ? settings.dailyBudget : settings.monthlyBudget
  const currentExpenses = settings.expenseFrequency === "daily" ? dailyExpenses : monthlyExpenses
  const remainingBudget = monthlyIncome - currentExpenses
  const budgetPercentage = activeBudget > 0 ? (currentExpenses / activeBudget) * 100 : 0

  const frequencyRemainingBudget = activeBudget - currentExpenses

  const fixedExpenses = data.expenses.filter((e) => e.type === "fixed" && isSelectedMonth(e.date))
  const variableExpenses = data.expenses.filter((e) => e.type === "variable" && isSelectedMonth(e.date))

  const years = Array.from({ length: 3 }, (_, i) => currentYear - i).sort((a, b) => b - a)
  const months = Array.from({ length: 12 }, (_, i) => i)

  const exportToPDF = () => {
    const element = document.getElementById("finance-dashboard")
    if (!element) return

    const htmlContent = element.innerHTML
    const printWindow = window.open("", "", "width=900,height=600")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${settings.appName} - Report</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { margin-bottom: 10px; font-size: 24px; }
              .date { color: #666; margin-bottom: 20px; }
              .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 20px; }
              .stat { padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
              .stat-label { font-size: 12px; color: #666; }
              .stat-value { font-size: 18px; font-weight: bold; margin-top: 5px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
              td { padding: 10px; border-bottom: 1px solid #ddd; }
              h2 { font-size: 16px; margin-top: 20px; margin-bottom: 10px; }
              .no-data { text-align: center; color: #999; padding: 20px; }
              @media print { body { padding: 0; } }
            </style>
          </head>
          <body>
            <h1>${settings.appName} - Financial Report</h1>
            <p class="date">${new Date(selectedYear, selectedMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            
            <div class="stats">
              <div class="stat">
                <div class="stat-label">Monthly Income</div>
                <div class="stat-value">${settings.currencySymbol}${monthlyIncome.toLocaleString("id-ID")}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Daily Expense</div>
                <div class="stat-value">${settings.currencySymbol}${dailyExpenses.toLocaleString("id-ID")}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Monthly Expense</div>
                <div class="stat-value">${settings.currencySymbol}${monthlyExpenses.toLocaleString("id-ID")}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Remaining Budget</div>
                <div class="stat-value">${settings.currencySymbol}${remainingBudget.toLocaleString("id-ID")}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Monthly Savings</div>
                <div class="stat-value">${settings.currencySymbol}${monthlySavings.toLocaleString("id-ID")}</div>
              </div>
            </div>

            <h2>Income Transactions</h2>
            ${
              data.income.filter((i) => isSelectedMonth(i.date)).length > 0
                ? `
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.income
                    .filter((i) => isSelectedMonth(i.date))
                    .map(
                      (i) => `
                    <tr>
                      <td>${new Date(i.date).toLocaleDateString("en-US")}</td>
                      <td>${i.category}</td>
                      <td>${i.description}</td>
                      <td>${settings.currencySymbol}${i.amount.toLocaleString("id-ID")}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            `
                : '<p class="no-data">No income data</p>'
            }

            <h2>Expenses</h2>
            ${
              data.expenses.filter((e) => isSelectedMonth(e.date)).length > 0
                ? `
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.expenses
                    .filter((e) => isSelectedMonth(e.date))
                    .map(
                      (e) => `
                    <tr>
                      <td>${new Date(e.date).toLocaleDateString("en-US")}</td>
                      <td>${e.type}</td>
                      <td>${e.category}</td>
                      <td>${e.description}</td>
                      <td>${settings.currencySymbol}${e.amount.toLocaleString("id-ID")}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            `
                : '<p class="no-data">No expense data</p>'
            }

            <h2>Savings</h2>
            ${
              data.savings.filter((s) => isSelectedMonth(s.date)).length > 0
                ? `
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.savings
                    .filter((s) => isSelectedMonth(s.date))
                    .map(
                      (s) => `
                    <tr>
                      <td>${new Date(s.date).toLocaleDateString("en-US")}</td>
                      <td>${s.description}</td>
                      <td>${settings.currencySymbol}${s.amount.toLocaleString("id-ID")}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            `
                : '<p class="no-data">No savings data</p>'
            }
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div
      id="finance-dashboard"
      className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 p-4 md:p-8"
    >
      {/* Header with Month/Year Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{settings.appName}</h1>
            <div className="flex items-center gap-2 md:gap-4 mt-3 flex-wrap">
              <p className="text-muted-foreground text-sm md:text-base">
                {now.toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="flex gap-2 items-center flex-wrap">
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
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={exportToPDF}
              className="rounded-full bg-transparent"
              title="Export to PDF"
            >
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </Button>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Monthly Income" value={monthlyIncome} currency={settings.currencySymbol} variant="income" />
        <StatCard
          label={`Daily Expense${settings.dailyBudget > 0 ? ` / ${settings.currencySymbol}${settings.dailyBudget.toLocaleString("id-ID")}` : ""}`}
          value={dailyExpenses}
          currency={settings.currencySymbol}
          variant="expense"
        />
        <StatCard
          label={`Monthly Expense${settings.monthlyBudget > 0 ? ` / ${settings.currencySymbol}${settings.monthlyBudget.toLocaleString("id-ID")}` : ""}`}
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

      {activeBudget > 0 && (
        <div className="mb-8 p-4 border border-border rounded-lg bg-card">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              {settings.expenseFrequency === "daily" ? "Daily" : "Monthly"} Budget Usage
            </span>
            <span className="text-sm text-muted-foreground">
              {settings.currencySymbol}
              {currentExpenses.toLocaleString("id-ID")} / {settings.currencySymbol}
              {activeBudget.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                budgetPercentage <= 75 ? "bg-emerald-500" : budgetPercentage <= 100 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {frequencyRemainingBudget >= 0
              ? `${settings.currencySymbol}${frequencyRemainingBudget.toLocaleString("id-ID")} remaining`
              : `Over budget by ${settings.currencySymbol}${Math.abs(frequencyRemainingBudget).toLocaleString("id-ID")}`}
          </p>
        </div>
      )}

      <div className="mb-8 relative">
        <Button className="gap-2" onClick={() => setAddMenuOpen(!addMenuOpen)}>
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

        {/* Dropdown menu - visible on mobile and desktop */}
        {addMenuOpen && (
          <div className="absolute left-0 mt-2 w-32 bg-card border border-border rounded-lg shadow-lg z-10 animate-in fade-in duration-200">
            <button
              onClick={() => {
                setAddType("income")
                setAddModalOpen(true)
                setAddMenuOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-muted first:rounded-t-lg transition-colors text-sm"
            >
              Income
            </button>
            <button
              onClick={() => {
                setAddType("expense")
                setAddModalOpen(true)
                setAddMenuOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm"
            >
              Expense
            </button>
            <button
              onClick={() => {
                setAddType("saving")
                setAddModalOpen(true)
                setAddMenuOpen(false)
              }}
              className="w-full text-left px-4 py-2 hover:bg-muted last:rounded-b-lg transition-colors text-sm"
            >
              Saving
            </button>
          </div>
        )}
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
