export interface FinancialData {
  fixedIncome: number
  extraIncome: number
  routineExpenses: number
  debtInstallments: number
  emergencyFund: number
  inflationRate: number
}

export interface FinancialAnalysis {
  totalIncome: number
  totalExpenses: number
  netCashFlow: number
  debtToIncomeRatio: number
  emergencyFundRatio: number
  classification: Classification
  bankruptcyProjection: number | null
  projections: ProjectionPoint[]
}

export interface Classification {
  id: string
  name: string
  description: string
  color: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  priority: number
}

export interface ProjectionPoint {
  month: number
  projectedIncome: number
  projectedExpenses: number
  projectedEmergencyFund: number
  netCashFlow: number
  isBankruptcyPoint: boolean
}

const classifications: Classification[] = [
  {
    id: 'resilient',
    name: 'Resilient',
    description: 'Safe, sufficient emergency funds, no consumptive debt',
    color: 'text-green-600',
    severity: 'low',
    priority: 1,
  },
  {
    id: 'vulnerable',
    name: 'Vulnerable Middle',
    description: 'Stable for now, but vulnerable to economic shocks',
    color: 'text-yellow-600',
    severity: 'medium',
    priority: 2,
  },
  {
    id: 'near-crisis',
    name: 'Near-Crisis',
    description: 'Dangerous, debt installments are eating into basic needs',
    color: 'text-orange-600',
    severity: 'high',
    priority: 3,
  },
  {
    id: 'in-distress',
    name: 'In-Distress',
    description: 'Default risk, expenses far exceed income',
    color: 'text-red-600',
    severity: 'critical',
    priority: 4,
  },
]

export function getClassification(financialData: FinancialData): Classification {
  const { totalIncome, totalExpenses, emergencyFundRatio, debtToIncomeRatio } = analyzeFinancials(financialData)
  
  // Primary classification based on debt-to-income ratio
  if (debtToIncomeRatio > 0.7) {
    return classifications.find(c => c.id === 'in-distress') || classifications[3]
  }
  if (debtToIncomeRatio > 0.5) {
    return classifications.find(c => c.id === 'near-crisis') || classifications[2]
  }
  if (debtToIncomeRatio > 0.3) {
    return classifications.find(c => c.id === 'vulnerable') || classifications[1]
  }
  
  // Secondary classification based on emergency fund ratio
  if (emergencyFundRatio < 0.5 && debtToIncomeRatio > 0.2) {
    return classifications.find(c => c.id === 'vulnerable') || classifications[1]
  }
  
  return classifications.find(c => c.id === 'resilient') || classifications[0]
}

export function analyzeFinancials(financialData: FinancialData): {
  totalIncome: number
  totalExpenses: number
  netCashFlow: number
  debtToIncomeRatio: number
  emergencyFundRatio: number
} {
  const totalIncome = financialData.fixedIncome + financialData.extraIncome
  const totalExpenses = financialData.routineExpenses + financialData.debtInstallments
  const netCashFlow = totalIncome - totalExpenses
  const debtToIncomeRatio = totalIncome > 0 ? financialData.debtInstallments / totalIncome : 0
  const emergencyFundRatio = financialData.routineExpenses > 0 ? financialData.emergencyFund / financialData.routineExpenses : 0

  return {
    totalIncome,
    totalExpenses,
    netCashFlow,
    debtToIncomeRatio,
    emergencyFundRatio,
  }
}

export function calculateInflationImpact(
  baseExpenses: number,
  inflationRate: number,
  months: number
): number {
  // Formula: Exp_n = Exp_0 * (1 + i)^n
  return baseExpenses * Math.pow(1 + inflationRate, months)
}

export function generateProjections(
  financialData: FinancialData,
  projectionMonths: number = 24
): ProjectionPoint[] {
  const projections: ProjectionPoint[] = []
  const { totalIncome } = analyzeFinancials(financialData)
  
  let currentEmergencyFund = financialData.emergencyFund
  
  for (let month = 0; month <= projectionMonths; month++) {
    const projectedExpenses = calculateInflationImpact(
      financialData.routineExpenses,
      financialData.inflationRate,
      month
    ) + financialData.debtInstallments
    
    const projectedEmergencyFund = currentEmergencyFund + (totalIncome - projectedExpenses)
    
    const netCashFlow = totalIncome - projectedExpenses
    
    projections.push({
      month,
      projectedIncome: totalIncome,
      projectedExpenses,
      projectedEmergencyFund: Math.max(0, projectedEmergencyFund),
      netCashFlow,
      isBankruptcyPoint: projectedEmergencyFund <= 0 && month > 0,
    })
    
    currentEmergencyFund = projectedEmergencyFund
  }
  
  return projections
}

export function calculateBankruptcyDay(projections: ProjectionPoint[]): number | null {
  const bankruptcyPoint = projections.find(point => point.isBankruptcyPoint)
  return bankruptcyPoint ? bankruptcyPoint.month : null
}

export function getFinancialAdvice(classification: Classification, financialData: FinancialData): string {
  const { totalIncome, totalExpenses, netCashFlow, debtToIncomeRatio, emergencyFundRatio } = analyzeFinancials(financialData)
  
  switch (classification.id) {
    case 'resilient':
      return "Great job! You're in a strong financial position. Consider increasing your emergency fund to 6 months of expenses and explore investment opportunities to grow your wealth."
    
    case 'vulnerable':
      if (debtToIncomeRatio > 0.4) {
        return "Your debt levels are becoming concerning. Consider the snowball method to pay down debts. Focus on paying off high-interest loans first while making minimum payments on others."
      }
      if (emergencyFundRatio < 1) {
        return "Build up your emergency fund to at least 3 months of expenses. This will protect you from unexpected financial shocks."
      }
      return "You're in good shape, but consider diversifying your income streams and building a larger emergency fund for added security."
    
    case 'near-crisis':
      return "Immediate action needed! Cut non-essential expenses immediately. Contact lenders to negotiate payment plans. Consider debt consolidation or credit counseling services. Every IDR counts at this stage."
    
    case 'in-distress':
      return "Financial crisis situation. Seek professional help immediately. Consider debt restructuring, credit counseling, or bankruptcy consultation. Create a strict budget with only essential expenses."
    
    default:
      return "Review your financial situation and consider creating a budget to improve your financial health."
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}