import { pgTable, text, timestamp, decimal, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const financialRecord = pgTable("financial_record", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    fixedIncome: decimal("fixed_income", { precision: 10, scale: 2 }).notNull(),
    extraIncome: decimal("extra_income", { precision: 10, scale: 2 }).default("0"),
    routineExpenses: decimal("routine_expenses", { precision: 10, scale: 2 }).notNull(),
    debtInstallments: decimal("debt_installments", { precision: 10, scale: 2 }).notNull(),
    emergencyFund: decimal("emergency_fund", { precision: 10, scale: 2 }).notNull(),
    inflationRate: decimal("inflation_rate", { precision: 5, scale: 4 }).default("0.025"), // Default 2.5%
    classification: text("classification").notNull(), // Resilient, Vulnerable, Near-Crisis, In-Distress
    debtToIncomeRatio: decimal("debt_to_income_ratio", { precision: 5, scale: 4 }),
    bankruptcyProjection: integer("bankruptcy_projection"), // Days until bankruptcy
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});

export const financialProjection = pgTable("financial_projection", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    recordId: text("record_id")
        .notNull()
        .references(() => financialRecord.id, { onDelete: "cascade" }),
    month: integer("month").notNull(), // Month number (0 = current, 1 = next month, etc.)
    projectedIncome: decimal("projected_income", { precision: 10, scale: 2 }).notNull(),
    projectedExpenses: decimal("projected_expenses", { precision: 10, scale: 2 }).notNull(),
    projectedEmergencyFund: decimal("projected_emergency_fund", { precision: 10, scale: 2 }).notNull(),
    netCashFlow: decimal("net_cash_flow", { precision: 10, scale: 2 }).notNull(),
    isBankruptcyPoint: boolean("is_bankruptcy_point").default(false),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
});

export const aiAdvisorSession = pgTable("ai_advisor_session", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    financialRecordId: text("financial_record_id")
        .references(() => financialRecord.id, { onDelete: "cascade" }),
    messages: jsonb("messages").notNull(), // Array of { role: "user" | "assistant", content: string }
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});

export const financialClassification = pgTable("financial_classification", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    color: text("color").notNull(), // Tailwind color class or CSS color
    minDebtToIncomeRatio: decimal("min_debt_to_income_ratio", { precision: 5, scale: 4 }),
    maxDebtToIncomeRatio: decimal("max_debt_to_income_ratio", { precision: 5, scale: 4 }),
    minEmergencyFundRatio: decimal("min_emergency_fund_ratio", { precision: 5, scale: 4 }), // Emergency fund / monthly expenses
    priority: integer("priority").notNull(), // Lower number = higher priority
});

// Insert default classifications
export const insertFinancialClassification = async (db: any) => {
    await db.insert(financialClassification).values([
        {
            id: "resilient",
            name: "Resilient",
            description: "Safe, sufficient emergency funds, no consumptive debt",
            color: "text-green-600",
            minDebtToIncomeRatio: 0,
            maxDebtToIncomeRatio: 0.3,
            minEmergencyFundRatio: 3, // 3+ months of expenses
            priority: 1,
        },
        {
            id: "vulnerable",
            name: "Vulnerable Middle",
            description: "Stable for now, but vulnerable to economic shocks",
            color: "text-yellow-600",
            minDebtToIncomeRatio: 0.3,
            maxDebtToIncomeRatio: 0.5,
            minEmergencyFundRatio: 1, // 1-3 months of expenses
            priority: 2,
        },
        {
            id: "near-crisis",
            name: "Near-Crisis",
            description: "Dangerous, debt installments are eating into basic needs",
            color: "text-orange-600",
            minDebtToIncomeRatio: 0.5,
            maxDebtToIncomeRatio: 0.7,
            minEmergencyFundRatio: 0.5, // Less than 1 month of expenses
            priority: 3,
        },
        {
            id: "in-distress",
            name: "In-Distress",
            description: "Default risk, expenses far exceed income",
            color: "text-red-600",
            minDebtToIncomeRatio: 0.7,
            maxDebtToIncomeRatio: 1,
            minEmergencyFundRatio: 0,
            priority: 4,
        },
    ]);
};