import { GroupExpense, DebtSettlement } from '../types';
import { eventBus } from './eventBus';

const EXPENSES_STORAGE_KEY = 'tourguide_group_expenses';
const TRAVELERS_STORAGE_KEY = 'tourguide_trip_travelers';

export class ExpenseService {
  public static getExpenses(tripId: string): GroupExpense[] {
    try {
      const data = localStorage.getItem(EXPENSES_STORAGE_KEY);
      const all: GroupExpense[] = data ? JSON.parse(data) : [];
      return all.filter((e) => e.tripId === tripId);
    } catch {
      return [];
    }
  }

  public static addExpense(
    tripId: string,
    title: string,
    amount: number,
    paidBy: string,
    splitBetween: string[],
    category: GroupExpense['category'] = 'FOOD',
    currency: string = '₹',
    notes?: string
  ): GroupExpense {
    const expense: GroupExpense = {
      id: `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tripId,
      title,
      amount: Math.round(amount),
      currency,
      category,
      paidBy,
      splitBetween: splitBetween.length > 0 ? splitBetween : [paidBy],
      date: new Date().toISOString(),
      notes,
    };

    try {
      const data = localStorage.getItem(EXPENSES_STORAGE_KEY);
      const all: GroupExpense[] = data ? JSON.parse(data) : [];
      all.unshift(expense);
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Error adding expense', e);
    }

    eventBus.emit({
      type: 'EXPENSE_ADDED',
      payload: { expenseId: expense.id, amount: expense.amount, paidBy: expense.paidBy },
    });

    return expense;
  }

  public static deleteExpense(expenseId: string): void {
    try {
      const data = localStorage.getItem(EXPENSES_STORAGE_KEY);
      const all: GroupExpense[] = data ? JSON.parse(data) : [];
      const updated = all.filter((e) => e.id !== expenseId);
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Error deleting expense', e);
    }
  }

  public static getTravelers(tripId: string, defaultNames: string[] = ['Aarav', 'Ravi', 'Kiran', 'Sai']): string[] {
    try {
      const data = localStorage.getItem(`${TRAVELERS_STORAGE_KEY}_${tripId}`);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error getting travelers', e);
    }
    return defaultNames;
  }

  public static saveTravelers(tripId: string, travelers: string[]): void {
    try {
      localStorage.setItem(`${TRAVELERS_STORAGE_KEY}_${tripId}`, JSON.stringify(travelers));
    } catch (e) {
      console.error('Error saving travelers', e);
    }
  }

  public static addTraveler(tripId: string, name: string): string[] {
    const current = this.getTravelers(tripId);
    if (!current.includes(name.trim())) {
      const updated = [...current, name.trim()];
      this.saveTravelers(tripId, updated);
      return updated;
    }
    return current;
  }

  // Exact Mathematical Debt Reconciliation
  public static calculateSettlements(tripId: string, currency: string = '₹'): {
    totalSpent: number;
    breakdownPerTraveler: Record<string, { paid: number; share: number; netBalance: number }>;
    settlements: DebtSettlement[];
  } {
    const expenses = this.getExpenses(tripId);
    const travelers = this.getTravelers(tripId);

    const breakdown: Record<string, { paid: number; share: number; netBalance: number }> = {};
    for (const t of travelers) {
      breakdown[t] = { paid: 0, share: 0, netBalance: 0 };
    }

    let totalSpent = 0;

    for (const exp of expenses) {
      totalSpent += exp.amount;
      if (!breakdown[exp.paidBy]) {
        breakdown[exp.paidBy] = { paid: 0, share: 0, netBalance: 0 };
      }
      breakdown[exp.paidBy].paid += exp.amount;

      const splitCount = exp.splitBetween.length || 1;
      const sharePerPerson = exp.amount / splitCount;

      for (const person of exp.splitBetween) {
        if (!breakdown[person]) {
          breakdown[person] = { paid: 0, share: 0, netBalance: 0 };
        }
        breakdown[person].share += sharePerPerson;
      }
    }

    // Calculate net balances: positive means they are owed money, negative means they owe money
    const balances: { name: string; balance: number }[] = [];
    for (const name of Object.keys(breakdown)) {
      const net = Math.round(breakdown[name].paid - breakdown[name].share);
      breakdown[name].netBalance = net;
      balances.push({ name, balance: net });
    }

    // Two-pointer settlement reconciliation algorithm
    const debtors = balances.filter((b) => b.balance < 0).map((b) => ({ ...b, balance: Math.abs(b.balance) }));
    const creditors = balances.filter((b) => b.balance > 0).map((b) => ({ ...b }));

    const settlements: DebtSettlement[] = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const settleAmount = Math.min(debtor.balance, creditor.balance);
      if (settleAmount > 0) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(settleAmount),
          currency,
        });
      }

      debtor.balance -= settleAmount;
      creditor.balance -= settleAmount;

      if (debtor.balance <= 0) i++;
      if (creditor.balance <= 0) j++;
    }

    return {
      totalSpent,
      breakdownPerTraveler: breakdown,
      settlements,
    };
  }
}
