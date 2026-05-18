"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  Legend
} from "recharts"
import { 
  FinancialData, 
  FinancialAnalysis, 
  ProjectionPoint, 
  formatCurrency, 
  formatPercentage,
  generateProjections,
  getClassification,
  calculateInflationImpact
} from "@/lib/financial-utils"

interface FinancialSimulatorProps {
  financialData: FinancialData
}

export function FinancialSimulator({ financialData }: FinancialSimulatorProps) {
  const [projectionMonths, setProjectionMonths] = useState(24)
  const [showDetailedView, setShowDetailedView] = useState(false)

  const analysis: FinancialAnalysis = useMemo(() => {
    const classification = getClassification(financialData)
    const projections = generateProjections(financialData, projectionMonths)
    const bankruptcyDay = projections.find(p => p.isBankruptcyPoint)?.month || null

    return {
      totalIncome: financialData.fixedIncome + financialData.extraIncome,
      totalExpenses: financialData.routineExpenses + financialData.debtInstallments,
      netCashFlow: (financialData.fixedIncome + financialData.extraIncome) - (financialData.routineExpenses + financialData.debtInstallments),
      debtToIncomeRatio: financialData.fixedIncome > 0 ? financialData.debtInstallments / (financialData.fixedIncome + financialData.extraIncome) : 0,
      emergencyFundRatio: financialData.routineExpenses > 0 ? financialData.emergencyFund / financialData.routineExpenses : 0,
      classification,
      bankruptcyProjection: bankruptcyDay,
      projections,
    }
  }, [financialData, projectionMonths])

  const currentMonthExpenses = calculateInflationImpact(
    financialData.routineExpenses,
    financialData.inflationRate,
    0
  ) + financialData.debtInstallments

  const projectedMonth12Expenses = calculateInflationImpact(
    financialData.routineExpenses,
    financialData.inflationRate,
    12
  ) + financialData.debtInstallments

  const projectedMonth24Expenses = calculateInflationImpact(
    financialData.routineExpenses,
    financialData.inflationRate,
    24
  ) + financialData.debtInstallments

  const chartData = analysis.projections.map((projection, index) => ({
    month: projection.month,
    income: projection.projectedIncome,
    expenses: projection.projectedExpenses,
    emergencyFund: projection.projectedEmergencyFund,
    netCashFlow: projection.netCashFlow,
    isBankruptcyPoint: projection.isBankruptcyPoint,
  }))

  const bankruptcyPoint = chartData.find(point => point.isBankruptcyPoint)

  return (
    <div className="space-y-6">
      {/* Current Financial Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Financial Status
            <Badge className={analysis.classification.color}>
              {analysis.classification.name}
            </Badge>
          </CardTitle>
          <CardDescription>
            Based on your current financial data and projected inflation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Monthly Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(analysis.totalIncome)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Monthly Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(analysis.totalExpenses)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Net Cash Flow</p>
              <p className={`text-2xl font-bold ${analysis.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(analysis.netCashFlow)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Debt-to-Income Ratio</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {formatPercentage(analysis.debtToIncomeRatio)}
                </p>
                <Progress value={analysis.debtToIncomeRatio * 100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bankruptcy Projection */}
      {analysis.bankruptcyProjection && (
        <Alert>
          <AlertDescription>
            <strong>⚠️ Critical Warning:</strong> Based on current trends, your emergency fund will be depleted in {analysis.bankruptcyProjection} months ({Math.floor(analysis.bankruptcyProjection / 12)} years {analysis.bankruptcyProjection % 12} months). This is your "bankruptcy day" when expenses exceed income.
          </AlertDescription>
        </Alert>
      )}

      {/* Inflation Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Inflation Impact Over Time</CardTitle>
          <CardDescription>
            How inflation affects your routine monthly expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Month</p>
              <p className="text-xl font-bold">{formatCurrency(currentMonthExpenses)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">12 Months Later</p>
              <p className="text-xl font-bold">{formatCurrency(projectedMonth12Expenses)}</p>
              <p className="text-sm text-green-600">
                +{formatPercentage(projectedMonth12Expenses / currentMonthExpenses - 1)} from now
              </p>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-muted-foreground">24 Months Later</p>
              <p className="text-xl font-bold">{formatCurrency(projectedMonth24Expenses)}</p>
              <p className="text-sm text-red-600">
                +{formatPercentage(projectedMonth24Expenses / currentMonthExpenses - 1)} from now
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Cliff Chart */}
      <Card>
        <CardHeader>
          <CardTitle>The Cliff - Financial Projection</CardTitle>
          <CardDescription>
            This chart shows your projected financial standing over time. The intersection point is when expenses exceed income.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'Months', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                  label={{ value: 'Amount (IDR)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), '']}
                  labelFormatter={(month) => `Month ${month}`}
                />
                <Legend />
                
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Monthly Income"
                  dot={false}
                />
                
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Monthly Expenses"
                  dot={false}
                />
                
                <Line
                  type="monotone"
                  dataKey="emergencyFund"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Emergency Fund"
                  dot={false}
                />
                
                {bankruptcyPoint && (
                  <ReferenceLine
                    x={bankruptcyPoint.month}
                    stroke="#dc2626"
                    strokeDasharray="5 5"
                    label={{
                      value: 'Bankruptcy Point',
                      position: 'top',
                      fill: '#dc2626',
                    }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {bankruptcyPoint && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Bankruptcy Point:</strong> Month {bankruptcyPoint.month} - Your emergency fund will be depleted and you'll enter a financial crisis.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projection Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Projection Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Projection Period: {projectionMonths} months</label>
              <input
                type="range"
                min="6"
                max="60"
                step="6"
                value={projectionMonths}
                onChange={(e) => setProjectionMonths(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowDetailedView(!showDetailedView)}
            >
              {showDetailedView ? 'Hide Details' : 'Show Details'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Projections */}
      {showDetailedView && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Monthly Projections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">Month</th>
                    <th className="border border-gray-300 p-2 text-left">Income</th>
                    <th className="border border-gray-300 p-2 text-left">Expenses</th>
                    <th className="border border-gray-300 p-2 text-left">Emergency Fund</th>
                    <th className="border border-gray-300 p-2 text-left">Net Cash Flow</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.slice(0, 12).map((point) => (
                    <tr key={point.month}>
                      <td className="border border-gray-300 p-2">{point.month}</td>
                      <td className="border border-gray-300 p-2">{formatCurrency(point.income)}</td>
                      <td className="border border-gray-300 p-2">{formatCurrency(point.expenses)}</td>
                      <td className="border border-gray-300 p-2">{formatCurrency(point.emergencyFund)}</td>
                      <td className={`border border-gray-300 p-2 ${point.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(point.netCashFlow)}
                      </td>
                      <td className="border border-gray-300 p-2">
                        {point.isBankruptcyPoint ? (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">CRISIS</span>
                        ) : point.emergencyFund < financialData.emergencyFund * 0.5 ? (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">DECLINING</span>
                        ) : (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">STABLE</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}