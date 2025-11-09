"use client"

import { useState, useEffect } from "react"
import { FinanceDashboard } from "@/components/finance-dashboard"
import { SettingsModal } from "@/components/settings-modal"
import { useCookieStorage } from "@/hooks/use-cookie-storage"
import type { FinanceData, Settings } from "@/types/finance"

const DEFAULT_SETTINGS: Settings = {
  appName: "Pennylog",
  currency: "IDR",
  currencySymbol: "Rp",
  expenseFrequency: "daily",
  resetCycle: "monthly",
  resetDate: 1,
  categories: {
    income: ["Salary", "Freelance", "Investment", "Gift"],
    expense: ["Food", "Transport", "Entertainment", "Utilities"],
    fixedExpense: ["Rent", "Insurance", "Subscription"],
    variableExpense: ["Groceries", "Shopping", "Dining"],
  },
}

const DEFAULT_DATA: FinanceData = {
  income: [],
  expenses: [],
  savings: [],
}

export default function Home() {
  const [data, setData] = useCookieStorage<FinanceData>("financeData", DEFAULT_DATA)
  const [settings, setSettings] = useCookieStorage<Settings>("financeSettings", DEFAULT_SETTINGS)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-background">
      <FinanceDashboard
        data={data}
        setData={setData}
        settings={settings}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <SettingsModal
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings)
          setIsSettingsOpen(false)
        }}
        onClearData={() => {
          setData({
            income: [],
            expenses: [],
            savings: [],
          })
        }}
      />
    </main>
  )
}
