# App Summary: Econo-Shield

## 1. Project Overview
Econo-Shield is a web-based decision-support tool and early warning system designed to predict personal bankruptcy risk and provide AI-driven financial advisory. The app helps users navigate economic pressures, inflation, and predatory lending (pinjol) by analyzing their income, expenses, and debt.

## 2. Tech Stack
- **Framework:** Next.js (App Router)
- **UI/Styling:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** NextAuth.js / Better Auth (from Starter Kit)
- **Charts:** Recharts (integrated via shadcn/ui) / Plotly.js
- **AI Integration:** Google Gemini-1.5-Flash API

## 3. Core Features & Architecture

### A. Modular Stress-Tester (Input Layer)
- A dashboard form for users to input their financial data:
  - Fixed income & Extra income
  - Routine expenses
  - Debt/Pinjol installments
  - Emergency fund balance
- **Logic:** If the debt-to-income ratio exceeds 30%, the app triggers an immediate warning alert.

### B. Inflation & Debt Spiral Simulator (Processing Layer)
- Calculates the compounding effect of inflation on expenses using the formula: `Exp_n = Exp_0 * (1 + i)^n`.
- Projects future financial standing based on current macroeconomic data (CPI/IHK).

### C. Class Classifier (Status Layer)
- Classifies the user's financial health into one of four categories based on their inputs:
  1. **Resilient:** Safe, sufficient emergency funds, no consumptive debt.
  2. **Vulnerable Middle:** Stable for now, but vulnerable to economic shocks.
  3. **Near-Crisis:** Dangerous, debt installments are eating into basic needs.
  4. **In-Distress:** Default risk, expenses far exceed income.

### D. Data Visualization
- **The "Cliff" Chart:** A line chart showing the exact projected point (time) where the expense line intersects the income line (the "bankruptcy day").
- **Debt-O-Meter:** A gauge chart indicating the severity of reliance on online loans (pinjol).

### E. AI Chatbot Financial Advisor (Generative AI Layer)
- A chat interface powered by the Gemini-1.5-Flash API.
- Acts as a personal consultant providing actionable strategies (e.g., "Snowball method for paying off 30% of debt" or "Recommendations to cut entertainment subscriptions") based on the user's specific classification and data.

## 4. App Flow
1. **Landing Page:** Introduces Econo-Shield and its mission. Call-to-action to Log In/Sign Up.
2. **Dashboard (Post-Login):** - Top section shows the financial classification status (Resilient, Vulnerable, etc.).
   - Middle section displays the "The Cliff" and "Debt-O-Meter" charts.
   - Bottom/Side section contains the input form to update financial data.
3. **Advisor Chat Page:** A dedicated interface to converse with the Gemini-powered AI advisor, prepopulated with the user's financial context.