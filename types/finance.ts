export interface IncomeEntry {
  id: string
  amount: number
  category: string
  date: string
  description: string
}

export interface ExpenseEntry {
  id: string
  amount: number
  category: string
  type: "fixed" | "variable"
  date: string
  description: string
  frequency: "daily" | "monthly"
}

export interface SavingEntry {
  id: string
  amount: number
  date: string
  description: string
}

export interface FinanceData {
  income: IncomeEntry[]
  expenses: ExpenseEntry[]
  savings: SavingEntry[]
}

export interface Settings {
  appName: string
  currency: string
  currencySymbol: string
  expenseFrequency: "daily" | "monthly"
  resetCycle: "weekly" | "monthly"
  resetDate: number
  categories: {
    income: string[]
    expense: string[]
    fixedExpense: string[]
    variableExpense: string[]
  }
}
