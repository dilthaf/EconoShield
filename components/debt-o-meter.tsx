"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { formatPercentage, formatCurrency } from "@/lib/financial-utils"

interface DebtOMeterProps {
  debtInstallments: number
  totalIncome: number
  classification: string
}

interface DebtLevel {
  threshold: number
  label: string
  color: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

const debtLevels: DebtLevel[] = [
  {
    threshold: 0.1,
    label: 'Minimal',
    color: 'text-green-600',
    severity: 'low',
    description: 'Healthy debt levels'
  },
  {
    threshold: 0.2,
    label: 'Moderate',
    color: 'text-blue-600',
    severity: 'low',
    description: 'Manageable debt levels'
  },
  {
    threshold: 0.3,
    label: 'Elevated',
    color: 'text-yellow-600',
    severity: 'medium',
    description: 'Starting to feel the pressure'
  },
  {
    threshold: 0.4,
    label: 'High',
    color: 'text-orange-600',
    severity: 'high',
    description: 'Debt becoming burdensome'
  },
  {
    threshold: 0.5,
    label: 'Critical',
    color: 'text-red-600',
    severity: 'critical',
    description: 'Dangerous debt levels'
  },
  {
    threshold: 1,
    label: 'Crisis',
    color: 'text-red-800',
    severity: 'critical',
    description: 'Financial emergency'
  }
]

export function DebtOMeter({ debtInstallments, totalIncome, classification }: DebtOMeterProps) {
  const debtToIncomeRatio = totalIncome > 0 ? debtInstallments / totalIncome : 0
  const currentLevel = debtLevels.reduce((prev, current) => 
    debtToIncomeRatio >= current.threshold ? current : prev
  )

  const gaugeData = [
    { name: 'Safe', value: Math.min(debtToIncomeRatio, 0.1) * 100, color: '#22c55e' },
    { name: 'Moderate', value: Math.max(0, Math.min(debtToIncomeRatio - 0.1, 0.1)) * 100, color: '#3b82f6' },
    { name: 'Elevated', value: Math.max(0, Math.min(debtToIncomeRatio - 0.2, 0.1)) * 100, color: '#eab308' },
    { name: 'High', value: Math.max(0, Math.min(debtToIncomeRatio - 0.3, 0.1)) * 100, color: '#f97316' },
    { name: 'Critical', value: Math.max(0, Math.min(debtToIncomeRatio - 0.4, 0.6)) * 100, color: '#dc2626' },
  ]

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return '✅'
      case 'medium': return '⚠️'
      case 'high': return '🔴'
      case 'critical': return '🚨'
      default: return '❓'
    }
  }

  const getAdvice = () => {
    if (debtToIncomeRatio <= 0.1) {
      return "Excellent! Your debt levels are very healthy. Keep up the good work!"
    } else if (debtToIncomeRatio <= 0.2) {
      return "Good job! Your debt is manageable. Consider building your emergency fund."
    } else if (debtToIncomeRatio <= 0.3) {
      return "Be cautious. Your debt is getting high. Consider paying down high-interest loans."
    } else if (debtToIncomeRatio <= 0.4) {
      return "Warning! Your debt is becoming burdensome. Create a debt repayment plan immediately."
    } else if (debtToIncomeRatio <= 0.5) {
      return "Critical! Your debt levels are dangerous. Seek professional financial help now."
    } else {
      return "Emergency! Your debt situation is unsustainable. Consider debt consolidation or bankruptcy counseling."
    }
  }

  const getRepaymentStrategies = () => {
    if (debtToIncomeRatio <= 0.2) {
      return []
    }
    
    const strategies = []
    if (debtToIncomeRatio > 0.3) {
      strategies.push({
        title: "Avalanche Method",
        description: "Pay off high-interest debts first while making minimum payments on others.",
        priority: "high"
      })
    }
    if (debtToIncomeRatio > 0.4) {
      strategies.push({
        title: "Snowball Method", 
        description: "Pay off smallest debts first for quick wins and motivation.",
        priority: "medium"
      })
    }
    if (debtToIncomeRatio > 0.5) {
      strategies.push({
        title: "Debt Consolidation",
        description: "Combine multiple debts into a single loan with lower interest rate.",
        priority: "high"
      })
      strategies.push({
        title: "Credit Counseling",
        description: "Seek professional help to create a debt management plan.",
        priority: "high"
      })
    }
    
    return strategies
  }

  const repaymentStrategies = getRepaymentStrategies()

  return (
    <div className="space-y-6">
      {/* Main Debt Meter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Debt-O-Meter
            <Badge className={currentLevel.color}>
              {currentLevel.label}
            </Badge>
          </CardTitle>
          <CardDescription>
            Your debt-to-income ratio: {formatPercentage(debtToIncomeRatio)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Gauge Visualization */}
          <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-6">
            {gaugeData.map((segment, index) => (
              <div
                key={segment.name}
                className="absolute h-full"
                style={{
                  left: `${gaugeData.slice(0, index).reduce((sum, s) => sum + s.value, 0)}%`,
                  width: `${segment.value}%`,
                  backgroundColor: segment.color,
                }}
              />
            ))}
            
            {/* Indicator */}
            <div
              className="absolute top-1/2 transform -translate-y-1/2 w-1 h-6 bg-black rounded-full"
              style={{ left: `${debtToIncomeRatio * 100}%` }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black" />
            </div>
          </div>

          {/* Threshold Labels */}
          <div className="flex justify-between text-xs text-muted-foreground mb-4">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>

          {/* Current Level Info */}
          <div className={`p-4 rounded-lg border-2 ${currentLevel.severity === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : currentLevel.severity === 'high' ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : currentLevel.severity === 'medium' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getSeverityIcon(currentLevel.severity)}</span>
              <span className="font-semibold">{currentLevel.label} Risk Level</span>
            </div>
            <p className="text-sm text-muted-foreground">{currentLevel.description}</p>
          </div>

          {/* Alert for high debt */}
          {debtToIncomeRatio > 0.3 && (
            <Alert className={debtToIncomeRatio > 0.5 ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20" : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20"}>
              <AlertDescription>
                <strong>{getSeverityIcon(currentLevel.severity)} {currentLevel.label} Risk:</strong> {getAdvice()}
              </AlertDescription>
            </Alert>
          )}

          {/* Financial Impact Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-muted-foreground">Monthly Debt Payment</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(debtInstallments)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercentage(debtToIncomeRatio)} of your income
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">Available Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome - debtInstallments)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                For expenses & savings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repayment Strategies */}
      {repaymentStrategies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Repayment Strategies</CardTitle>
            <CardDescription>
              Based on your current debt level, consider these approaches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repaymentStrategies.map((strategy, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${strategy.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'}`}
                >
                  <h4 className="font-semibold mb-2">{strategy.title}</h4>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold mb-2">Quick Actions to Reduce Debt</h4>
              <ul className="text-sm space-y-1">
                <li>• Cut non-essential expenses by 20%</li>
                <li>• Consider a side hustle to increase income</li>
                <li>• Refinance high-interest loans</li>
                <li>• Negotiate lower interest rates with lenders</li>
                <li>• Use windfalls (bonuses, tax returns) to pay down debt</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debt-Free Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Debt-Free Projection</CardTitle>
          <CardDescription>
            Estimated time to become debt-free based on your current payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Monthly Payment</span>
              <span className="text-lg font-bold">{formatCurrency(debtInstallments)}</span>
            </div>
            
            {debtToIncomeRatio > 0.3 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Recommended Payment (25% of income)</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(totalIncome * 0.25)}
                  </span>
                </div>
                <Progress 
                  value={(debtInstallments / (totalIncome * 0.25)) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  Increasing payments by {formatPercentage((totalIncome * 0.25 - debtInstallments) / debtInstallments)} could accelerate your debt payoff
                </p>
              </div>
            )}
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-center">
                💡 <strong>Tip:</strong> Every extra IDR 100,000 per month could save you months of interest and help you become debt faster!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}