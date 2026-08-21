import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  X,
  DollarSign,
  ArrowRight,
  Receipt,
  CheckCircle2,
  PieChart,
  UserPlus,
} from 'lucide-react';
import { motion } from 'motion/react';
import { GroupExpense, DebtSettlement } from '../types';
import { ExpenseService } from '../services/expenseService';

interface GroupExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId?: string;
  currency?: string;
  onExpensesUpdated?: () => void;
}

export const GroupExpenseModal: React.FC<GroupExpenseModalProps> = ({
  isOpen,
  onClose,
  tripId = 'active-trip',
  currency = '₹',
  onExpensesUpdated,
}) => {
  const [travelers, setTravelers] = useState<string[]>([]);
  const [newTravelerName, setNewTravelerName] = useState('');
  const [expenses, setExpenses] = useState<GroupExpense[]>([]);

  // New Expense form state
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<GroupExpense['category']>('FOOD');
  const [paidBy, setPaidBy] = useState('');
  const [splitWith, setSplitWith] = useState<string[]>([]);

  // Settlement calculations
  const [settlementData, setSettlementData] = useState<{
    totalSpent: number;
    breakdownPerTraveler: Record<string, { paid: number; share: number; netBalance: number }>;
    settlements: DebtSettlement[];
  }>({ totalSpent: 0, breakdownPerTraveler: {}, settlements: [] });

  const reloadData = () => {
    const travs = ExpenseService.getTravelers(tripId);
    setTravelers(travs);
    if (travs.length > 0 && !paidBy) {
      setPaidBy(travs[0]);
      setSplitWith(travs);
    }

    const exps = ExpenseService.getExpenses(tripId);
    setExpenses(exps);

    const calc = ExpenseService.calculateSettlements(tripId, currency);
    setSettlementData(calc);
  };

  useEffect(() => {
    if (isOpen) {
      reloadData();
    }
  }, [isOpen, tripId]);

  const handleAddTraveler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTravelerName.trim()) return;
    const updated = ExpenseService.addTraveler(tripId, newTravelerName);
    setTravelers(updated);
    setSplitWith(updated);
    setNewTravelerName('');
    reloadData();
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0 || !paidBy) return;

    ExpenseService.addExpense(
      tripId,
      title.trim(),
      parsedAmount,
      paidBy,
      splitWith.length > 0 ? splitWith : travelers,
      category,
      currency
    );

    setTitle('');
    setAmount('');
    reloadData();
    onExpensesUpdated?.();
  };

  const handleDeleteExpense = (id: string) => {
    ExpenseService.deleteExpense(id);
    reloadData();
    onExpensesUpdated?.();
  };

  const toggleSplitPerson = (name: string) => {
    if (splitWith.includes(name)) {
      if (splitWith.length > 1) {
        setSplitWith(splitWith.filter((n) => n !== name));
      }
    } else {
      setSplitWith([...splitWith, name]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="group-expense-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-[#090910] border border-amber-500/40 rounded-2xl shadow-[0_0_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh] text-left"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-[#10101c] to-zinc-900 px-6 py-4 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury font-bold text-base text-zinc-100 uppercase tracking-wide">
                  GROUP TRAVEL & EXPENSE SETTLEMENT
                </h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono-tactical bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                  MATHEMATICAL RECONCILIATION
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono-tactical">
                Log shared dining, transit & sanctuary bills with 1-click debt settlement
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6 text-xs font-mono-tactical">
          {/* Travelers Bar */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                👥 EXPEDITION TRAVELERS ({travelers.length})
              </span>

              <form onSubmit={handleAddTraveler} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add traveler name..."
                  value={newTravelerName}
                  onChange={(e) => setNewTravelerName(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </form>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {travelers.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs flex items-center gap-1.5 font-sans font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Log New Expense & Summary Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Form */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                📝 LOG NEW EXPENSE
              </span>

              <form onSubmit={handleAddExpense} className="space-y-3">
                <div>
                  <label className="text-[10px] text-zinc-400 uppercase block mb-1">Expense Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seafood Dinner at Fisherman's Wharf"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase block mb-1">Amount ({currency})</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 4200"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
                    >
                      <option value="FOOD">Food & Dining</option>
                      <option value="TRANSPORT">Transit & Vehicle</option>
                      <option value="ACCOMMODATION">Sanctuary Suite</option>
                      <option value="ACTIVITIES">Sightseeing / Activity</option>
                      <option value="MISCELLANEOUS">Miscellaneous</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase block mb-1">Paid By</label>
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs focus:border-amber-400 focus:outline-none"
                  >
                    {travelers.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 uppercase block mb-1">Split Between</label>
                  <div className="flex flex-wrap gap-1.5">
                    {travelers.map((t) => {
                      const isSelected = splitWith.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleSplitPerson(t)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-zinc-950 font-bold'
                              : 'bg-zinc-900 border border-zinc-700 text-zinc-400'
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow cursor-pointer transition-all mt-2"
                >
                  Record Shared Expense
                </button>
              </form>
            </div>

            {/* Debt Settlement Summary */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    ⚖️ MATHEMATICAL DEBT SETTLEMENT
                  </span>
                  <span className="text-amber-400 font-bold">
                    Total: {currency}{settlementData.totalSpent.toLocaleString()}
                  </span>
                </div>

                {settlementData.settlements.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">
                    All balances are currently settled.
                  </div>
                ) : (
                  <div className="space-y-2.5 mt-3">
                    {settlementData.settlements.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-300">{s.from}</span>
                          <span className="text-zinc-500">owes</span>
                          <span className="font-bold text-emerald-300">{s.to}</span>
                        </div>

                        <span className="font-serif-luxury font-bold text-base text-amber-400">
                          {s.currency}{s.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-purple-200 text-[10px]">
                Algorithm calculates the minimum number of transactions needed to completely reconcile debts between group members.
              </div>
            </div>
          </div>

          {/* Expense Log History */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-3">
              🧾 RECORDED EXPEDITION RECEIPTS ({expenses.length})
            </span>

            {expenses.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 bg-zinc-950 rounded-xl border border-zinc-800">
                No receipts logged yet.
              </div>
            ) : (
              <div className="space-y-2">
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-900 border border-zinc-700 text-zinc-400 uppercase">
                          {exp.category}
                        </span>
                        <h4 className="font-semibold text-zinc-100 text-xs">{exp.title}</h4>
                      </div>
                      <p className="text-[10px] text-zinc-400">
                        Paid by <strong className="text-zinc-200">{exp.paidBy}</strong> • Split between: {exp.splitBetween.join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif-luxury font-bold text-sm text-zinc-100">
                        {exp.currency}{exp.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors cursor-pointer"
                        title="Delete receipt"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
