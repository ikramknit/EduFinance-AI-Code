import React from 'react';
import { Transaction, Student, TransactionType } from '../types';
import { DollarSign, TrendingUp, TrendingDown, Users, AlertCircle, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
  students: Student[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, students }) => {
  const totalIncome = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalFees = students.reduce((sum, s) => sum + s.totalFees, 0);
  const collectedFees = students.reduce((sum, s) => sum + s.paidFees, 0);
  const pendingFees = totalFees - collectedFees;

  // Prepare chart data (aggregated by date for simplicity in this demo)
  const chartData = transactions.reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      if (curr.type === TransactionType.INCOME) existing.income += curr.amount;
      else existing.expense += curr.amount;
    } else {
      acc.push({
        date: curr.date,
        income: curr.type === TransactionType.INCOME ? curr.amount : 0,
        expense: curr.type === TransactionType.EXPENSE ? curr.amount : 0,
      });
    }
    return acc;
  }, [] as { date: string; income: number; expense: number }[])
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(-7); // Last 7 active days

  const StatCard = ({ title, amount, icon: Icon, color, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.bg}`}>
          <Icon className={color.text} size={24} />
        </div>
        {trend && (
           <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-full">
             {trend}
           </span>
        )}
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-800">${amount.toLocaleString()}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Financial Overview</h2>
           <p className="text-slate-500 text-sm">Welcome back, Admin</p>
        </div>
        <div className="flex gap-2">
            <span className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-600">
                {new Date().toLocaleDateString(undefined, {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          amount={totalIncome}
          icon={TrendingUp}
          color={{ bg: 'bg-emerald-50', text: 'text-emerald-600' }}
          trend="+12% vs last mth"
        />
        <StatCard
          title="Total Expenses"
          amount={totalExpense}
          icon={TrendingDown}
          color={{ bg: 'bg-rose-50', text: 'text-rose-600' }}
        />
        <StatCard
          title="Net Balance"
          amount={netBalance}
          icon={Wallet}
          color={{ bg: 'bg-blue-50', text: 'text-blue-600' }}
        />
        <StatCard
          title="Pending Fees"
          amount={pendingFees}
          icon={AlertCircle}
          color={{ bg: 'bg-amber-50', text: 'text-amber-600' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Income & Expense Analytics</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#64748b', fontSize: 12}}
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{fill: '#64748b', fontSize: 12}}
                    tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Fee Collection Status</h3>
          <div className="space-y-6">
             <div className="relative pt-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">Collected</span>
                    <span className="font-bold text-slate-800">${collectedFees.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                    <div
                        className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(collectedFees / totalFees) * 100}%` }}
                    ></div>
                </div>
             </div>

             <div className="space-y-4">
                 {students.slice(0, 4).map((student) => (
                     <div key={student.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-800">{student.name}</p>
                                <p className="text-xs text-slate-500">Grade {student.grade}</p>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-bold text-slate-800">${student.totalFees - student.paidFees}</p>
                           <p className="text-[10px] text-amber-600 font-medium">Due</p>
                        </div>
                     </div>
                 ))}
             </div>
             <button className="w-full py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                 View All Students
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;