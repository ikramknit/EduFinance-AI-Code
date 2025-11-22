import React, { useState } from 'react';
import { ViewState, Transaction, TransactionType, Student } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_STUDENTS } from './services/mockData';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionTable from './components/TransactionTable';
import StudentFees from './components/StudentFees';
import AIInsightPanel from './components/AIInsightPanel';
import AddTransactionModal from './components/AddTransactionModal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<TransactionType>(TransactionType.INCOME);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [tx, ...prev]);
  };

  const openAddModal = (type: TransactionType) => {
    setModalDefaultType(type);
    setIsModalOpen(true);
  };

  const handleUpdateStudentPayment = (studentId: string, amount: number) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        const newPaid = s.paidFees + amount;
        const newStatus = newPaid >= s.totalFees ? 'PAID' : 'PARTIAL';
        return { ...s, paidFees: newPaid, status: newStatus };
      }
      return s;
    }));
    
    // Auto-record the income
    handleAddTransaction({
        date: new Date().toISOString().split('T')[0],
        description: `Fee Payment - Student ${studentId}`,
        amount: amount,
        type: TransactionType.INCOME,
        category: 'Tuition Fees'
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard transactions={transactions} students={students} />;
      case 'income':
        return (
          <TransactionTable
            type={TransactionType.INCOME}
            transactions={transactions}
            onAdd={() => openAddModal(TransactionType.INCOME)}
          />
        );
      case 'expenses':
        return (
          <TransactionTable
            type={TransactionType.EXPENSE}
            transactions={transactions}
            onAdd={() => openAddModal(TransactionType.EXPENSE)}
          />
        );
      case 'students':
        return (
          <StudentFees 
            students={students} 
            onUpdatePayment={handleUpdateStudentPayment} 
          />
        );
      case 'ai-report':
        return <AIInsightPanel transactions={transactions} students={students} />;
      default:
        return <Dashboard transactions={transactions} students={students} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setCurrentView}>
      {renderContent()}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTransaction}
        defaultType={modalDefaultType}
      />
    </Layout>
  );
};

export default App;