# Pennylog - Personal Finance Manager

A simple, responsive one-page personal finance management web application built with Next.js. Track your income, expenses, and savings with an intuitive interface and persistent data storage.

## Features

### Dashboard Overview
- **Monthly Income**: View total income for the selected month
- **Daily Expenses**: Track variable expenses for today (excludes fixed expenses)
- **Monthly Expenses**: See all expenses (fixed + variable) for the month
- **Remaining Budget**: Calculate remaining funds (income - total monthly expenses)
- **Monthly Savings**: Monitor your savings for the month

### Data Management
- **Income Tracking**: Log income sources with categories
- **Expense Management**: Track both fixed and variable expenses
  - **Fixed Expenses**: Monthly recurring costs (rent, insurance, subscriptions) - only counted in monthly view
  - **Variable Expenses**: Daily or occasional spending (food, shopping, dining)
- **Savings Tracking**: Record monthly savings goals and progress

### Data Tables
- **Income Transactions**: Complete list of all income entries
- **Fixed Expenses**: Monthly recurring expenses
- **Variable Expenses**: Daily/variable spending
- **All Expenses**: Combined view of all expense types
- **Savings**: Monthly savings entries

### Time Navigation
- **Month/Year Selector**: Use dropdown selectors to browse any month/year
- **Today Button**: Quick return to current month
- **Historical Data**: View past financial records

### Settings & Customization
- **App Name**: Customize the app name (default: "Pennylog")
- **Currency**: Choose from multiple currencies (IDR, USD, EUR, GBP)
- **Expense Frequency**: Set daily or monthly expense tracking
- **Reset Cycle**: Configure weekly or monthly budget resets
- **Reset Date**: Specify which date to reset monthly (if monthly cycle selected)
- **Custom Categories**: 
  - Add/remove income categories
  - Add/remove expense categories
  - Add/remove fixed expense categories
  - Add/remove variable expense categories
- **Data Management**: Clear all data with a single button

### Data Persistence
- **Browser Cookies**: All data is automatically saved to browser cookies
- **1-Year Expiry**: Data persists for 1 year from last update
- **No Server Required**: Everything works offline once loaded

## How to Use

### Adding Data
1. Click the **"Add Data"** button in the top section
2. Select entry type from the dropdown: **Income**, **Expense**, or **Saving**
3. Fill in the required information:
   - **Date**: When the transaction occurred
   - **Amount**: Transaction amount
   - **Category**: Choose from your configured categories
   - **Description** (optional): Additional notes
   - **For Expenses**: Specify if fixed or variable, and frequency

### Navigating to Different Months
1. Use the **Month Dropdown** to select a specific month
2. Use the **Year Dropdown** to select a specific year
3. Click **"Today"** to return to the current month

### Configuring Settings
1. Click the **Settings Gear Icon** (⚙️) in the top right
2. Navigate between tabs:
   - **General**: App name, currency, expense frequency
   - **Reset**: Configure budget reset cycle and date
   - **Categories**: Manage income and expense categories
   - **Data**: Clear all stored data

## Technical Details

### Technology Stack
- **Frontend**: React 19 with Next.js 16
- **Styling**: Tailwind CSS
- **Data Storage**: Browser Cookies (1-year expiration)
- **State Management**: React Hooks (useState, useEffect)

### File Structure
\`\`\`
├── app/
│   ├── page.tsx              # Main page component
│   ├── layout.tsx            # App layout
│   └── globals.css           # Global styles
├── components/
│   ├── finance-dashboard.tsx # Main dashboard component
│   ├── settings-modal.tsx    # Settings configuration modal
│   ├── add-entry-modal.tsx   # Add data modal
│   ├── stat-card.tsx         # Statistics display card
│   └── data-table.tsx        # Reusable table component
├── hooks/
│   └── use-cookie-storage.ts # Cookie persistence hook
├── types/
│   └── finance.ts            # TypeScript interfaces
└── README.md
\`\`\`

### Data Structure

#### Settings
\`\`\`typescript
{
  appName: string              // Custom app name
  currency: string             // Currency code (IDR, USD, etc.)
  currencySymbol: string       // Currency display symbol (Rp, $, etc.)
  expenseFrequency: string     // "daily" or "monthly"
  resetCycle: string           // "weekly" or "monthly"
  resetDate: number            // Date to reset (1-31)
  categories: {
    income: string[]           // Income categories
    expense: string[]          // General expense categories
    fixedExpense: string[]      // Fixed expense categories
    variableExpense: string[]   // Variable expense categories
  }
}
\`\`\`

#### Finance Data
\`\`\`typescript
{
  income: IncomeEntry[],
  expenses: ExpenseEntry[],
  savings: SavingEntry[]
}
\`\`\`

## Getting Started

### Installation
1. Download or clone the project
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Configuration
- **App Name**: Pennylog
- **Currency**: IDR (Rupiah) - Rp
- **Income Categories**: Salary, Freelance, Investment, Gift
- **Expense Categories**: Food, Transport, Entertainment, Utilities
- **Fixed Expense Categories**: Rent, Insurance, Subscription
- **Variable Expense Categories**: Groceries, Shopping, Dining
- **Expense Frequency**: Daily
- **Reset Cycle**: Monthly (resets on 1st of each month)

## Browser Support
- All modern browsers supporting ES6 and cookies
- Recommended: Chrome, Firefox, Safari, Edge (latest versions)

## Notes
- Data is stored locally in browser cookies - clearing cookies will delete all data
- Fixed expenses only appear in monthly calculations, not daily
- Daily expenses show only variable expenses for today
- All timestamps use your device's local timezone
- No data is sent to any server; everything is private and local

## Troubleshooting

**Data disappeared?**
- Check if cookies are enabled in your browser settings
- Verify browser hasn't cleared cookies automatically

**Can't add custom categories?**
- Go to Settings → Categories and use the input field to add new categories
- Click the trash icon to remove categories

**Currency symbol not showing?**
- Select currency in Settings → General
- Currency will display in all monetary values

## Future Enhancement Ideas
- Export data as CSV/PDF
- Budget goal tracking and alerts
- Recurring transaction templates
- Monthly reports and charts
- Dark mode support
- Multiple language support
