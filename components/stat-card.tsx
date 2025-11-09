import { Card } from "./ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number
  currency: string
  variant: "income" | "expense"
}

export function StatCard({ label, value, currency, variant }: StatCardProps) {
  const isNegative = value < 0
  const displayValue = Math.abs(value)

  return (
    <Card
      className={cn(
        "p-6 flex flex-col justify-center",
        variant === "income" && !isNegative
          ? "bg-gradient-to-br from-emerald-50 to-emerald-50/50 border-emerald-200"
          : "bg-gradient-to-br from-red-50 to-red-50/50 border-red-200",
      )}
    >
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
      <p
        className={cn(
          "text-2xl md:text-3xl font-bold mt-2",
          variant === "income" && !isNegative ? "text-emerald-600" : "text-red-600",
        )}
      >
        {isNegative ? "-" : ""}
        {currency}
        {displayValue.toLocaleString("id-ID")}
      </p>
    </Card>
  )
}
