"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CurrencyInput } from "./currency-input"

const financialFormSchema = z.object({
  fixedIncome: z.string().min(1, "Fixed income is required"),
  extraIncome: z.string().default("0"),
  routineExpenses: z.string().min(1, "Routine expenses are required"),
  debtInstallments: z.string().min(1, "Debt installments are required"),
  emergencyFund: z.string().min(1, "Emergency fund is required"),
  inflationRate: z.string().default("0.025"),
})

type FinancialFormValues = z.infer<typeof financialFormSchema>

interface FinancialFormProps {
  onSubmit: (data: FinancialFormValues) => void
  initialData?: Partial<FinancialFormValues>
}

const financialClassifications = [
  {
    id: "resilient",
    name: "Resilient",
    description: "Safe, sufficient emergency funds, no consumptive debt",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    minRatio: 0,
    maxRatio: 0.3,
  },
  {
    id: "vulnerable",
    name: "Vulnerable Middle",
    description: "Stable for now, but vulnerable to economic shocks",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    minRatio: 0.3,
    maxRatio: 0.5,
  },
  {
    id: "near-crisis",
    name: "Near-Crisis",
    description: "Dangerous, debt installments are eating into basic needs",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    minRatio: 0.5,
    maxRatio: 0.7,
  },
  {
    id: "in-distress",
    name: "In-Distress",
    description: "Default risk, expenses far exceed income",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    minRatio: 0.7,
    maxRatio: 1,
  },
]

export function FinancialForm({ onSubmit, initialData }: FinancialFormProps) {
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState<number>(0)
  const [classification, setClassification] = useState<typeof financialClassifications[0] | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FinancialFormValues>({
    resolver: zodResolver(financialFormSchema),
    defaultValues: {
      fixedIncome: initialData?.fixedIncome || "",
      extraIncome: initialData?.extraIncome || "0",
      routineExpenses: initialData?.routineExpenses || "",
      debtInstallments: initialData?.debtInstallments || "",
      emergencyFund: initialData?.emergencyFund || "",
      inflationRate: initialData?.inflationRate || "0.025",
    },
  })

  const watchedValues = watch()

  const calculateFinancials = (data: FinancialFormValues) => {
    const fixedIncome = parseFloat(data.fixedIncome) || 0
    const extraIncome = parseFloat(data.extraIncome) || 0
    const totalIncome = fixedIncome + extraIncome
    const routineExpenses = parseFloat(data.routineExpenses) || 0
    const debtInstallments = parseFloat(data.debtInstallments) || 0
    const totalExpenses = routineExpenses + debtInstallments
    const emergencyFund = parseFloat(data.emergencyFund) || 0

    // Calculate debt-to-income ratio
    const ratio = totalIncome > 0 ? debtInstallments / totalIncome : 0
    setDebtToIncomeRatio(ratio)

    // Determine classification
    const currentClassification = financialClassifications.find(
      (cls) => ratio >= cls.minRatio && ratio < cls.maxRatio
    ) || financialClassifications[financialClassifications.length - 1]
    
    setClassification(currentClassification)

    // Trigger warning if debt-to-income ratio exceeds 30%
    if (ratio > 0.3) {
      console.warn("Warning: Debt-to-income ratio exceeds 30%! Immediate financial risk detected.")
    }

    return {
      totalIncome,
      totalExpenses,
      emergencyFund,
      ratio,
      classification: currentClassification,
    }
  }

  const onFormSubmit = (data: FinancialFormValues) => {
    const financials = calculateFinancials(data)
    onSubmit({ ...data, ...financials })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Health Assessment</CardTitle>
        <CardDescription>
          Enter your financial information to assess your risk of financial distress and get personalized advice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Income Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Income</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fixedIncome">Fixed Monthly Income (IDR)</Label>
                <CurrencyInput
                  id="fixedIncome"
                  placeholder="5,000,000"
                  {...register("fixedIncome")}
                />
                {errors.fixedIncome && (
                  <p className="text-sm text-red-600">{errors.fixedIncome.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="extraIncome">Extra Monthly Income (IDR)</Label>
                <CurrencyInput
                  id="extraIncome"
                  placeholder="1,000,000"
                  {...register("extraIncome")}
                />
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Expenses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routineExpenses">Routine Monthly Expenses (IDR)</Label>
                <CurrencyInput
                  id="routineExpenses"
                  placeholder="3,000,000"
                  {...register("routineExpenses")}
                />
                {errors.routineExpenses && (
                  <p className="text-sm text-red-600">{errors.routineExpenses.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="debtInstallments">Debt/Pinjol Installments (IDR)</Label>
                <CurrencyInput
                  id="debtInstallments"
                  placeholder="2,000,000"
                  {...register("debtInstallments")}
                />
                {errors.debtInstallments && (
                  <p className="text-sm text-red-600">{errors.debtInstallments.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Fund Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Emergency Fund</h3>
            <div className="space-y-2">
              <Label htmlFor="emergencyFund">Emergency Fund Balance (IDR)</Label>
              <CurrencyInput
                id="emergencyFund"
                placeholder="6,000,000"
                {...register("emergencyFund")}
              />
              {errors.emergencyFund && (
                <p className="text-sm text-red-600">{errors.emergencyFund.message}</p>
              )}
            </div>
          </div>

          {/* Inflation Rate */}
          <div className="space-y-2">
            <Label htmlFor="inflationRate">Monthly Inflation Rate (%)</Label>
            <Input
              id="inflationRate"
              type="number"
              step="0.001"
              placeholder="2.5"
              {...register("inflationRate")}
            />
          </div>

          {/* Debt-to-Income Ratio Indicator */}
          {debtToIncomeRatio > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Debt-to-Income Ratio</Label>
                <span className="text-sm font-medium">{(debtToIncomeRatio * 100).toFixed(1)}%</span>
              </div>
              <Progress value={debtToIncomeRatio * 100} className="h-2" />
              {debtToIncomeRatio > 0.3 && (
                <Alert>
                  <AlertDescription>
                    ⚠️ Warning: Your debt-to-income ratio exceeds 30%! This indicates high financial risk.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Classification Display */}
          {classification && (
            <div className="space-y-2">
              <Label>Financial Classification</Label>
              <Badge className={classification.color}>
                {classification.name}
              </Badge>
              <p className="text-sm text-muted-foreground">{classification.description}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Analyzing..." : "Analyze Financial Health"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}