/**
 * Helper functions for expense calculations and settlement
 */

// Tolerance for floating point comparison (approximately 1 cent)
const BALANCE_TOLERANCE = 0.009

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export interface Transfer {
  from: string
  to: string
  amount: number
}

/**
 * Calculate optimal settlement transfers using greedy algorithm
 * @param balances Record of user_id to balance (positive = owed, negative = owes)
 * @returns Array of transfers needed to settle all balances
 */
export function calculateSettlement(balances: Record<string, number>): Transfer[] {
  const creditors: [uid: string, amt: number][] = []
  const debtors: [uid: string, amt: number][] = []
  
  // Separate into creditors (owed money) and debtors (owes money)
  for (const [userId, balance] of Object.entries(balances)) {
    if (balance > BALANCE_TOLERANCE) {
      creditors.push([userId, balance])
    } else if (balance < -BALANCE_TOLERANCE) {
      debtors.push([userId, balance])
    }
  }
  
  // Sort creditors by highest amount first
  creditors.sort((a, b) => b[1] - a[1])
  // Sort debtors by most negative first
  debtors.sort((a, b) => a[1] - b[1])
  
  const transfers: Transfer[] = []
  let i = 0
  let j = 0
  
  // Greedy algorithm to minimize number of transfers
  while (i < creditors.length && j < debtors.length) {
    const [creditorId, creditorAmount] = creditors[i]
    const [debtorId, debtorAmount] = debtors[j]
    
    const payment = Math.min(creditorAmount, -debtorAmount)
    
    transfers.push({
      from: debtorId,
      to: creditorId,
      amount: round2(payment)
    })
    
    // Update balances
    creditors[i][1] = round2(creditorAmount - payment)
    debtors[j][1] = round2(debtorAmount + payment)
    
    // Move to next creditor/debtor if settled
    if (creditors[i][1] <= BALANCE_TOLERANCE) i++
    if (debtors[j][1] >= -BALANCE_TOLERANCE) j++
  }
  
  return transfers
}

/**
 * Calculate per-user balances from expenses and splits
 * @param expenses Array of expenses with paid_by
 * @param splits Array of expense splits with user_id and share
 * @param userIds Array of all user IDs to initialize balances
 * @returns Record of user_id to balance
 */
export function calculateBalances(
  expenses: Array<{ id: string; amount: number; paid_by: string | null }>,
  splits: Array<{ expense_id: string | null; user_id: string | null; share: number }>,
  userIds: string[]
): Record<string, number> {
  const balances: Record<string, number> = {}
  
  // Initialize all user balances to 0
  for (const userId of userIds) {
    balances[userId] = 0
  }
  
  // Calculate balances: paid - owed
  for (const expense of expenses) {
    const expenseAmount = Number(expense.amount || 0)
    
    // Add amount paid by payer
    if (expense.paid_by) {
      balances[expense.paid_by] = round2((balances[expense.paid_by] || 0) + expenseAmount)
    }
    
    // Subtract share from each split participant
    const expenseSplits = splits.filter(s => s.expense_id === expense.id)
    for (const split of expenseSplits) {
      if (split.user_id) {
        balances[split.user_id] = round2((balances[split.user_id] || 0) - Number(split.share || 0))
      }
    }
  }
  
  return balances
}

/**
 * Calculate category totals for pie chart
 */
export function calculateCategoryTotals(
  expenses: Array<{ amount: number; category: string | null }>
): Array<{ name: string; value: number }> {
  const totals: Record<string, number> = {}
  
  for (const expense of expenses) {
    const category = expense.category || 'other'
    totals[category] = (totals[category] || 0) + Number(expense.amount || 0)
  }
  
  return Object.entries(totals).map(([name, value]) => ({
    name,
    value: round2(value)
  }))
}
