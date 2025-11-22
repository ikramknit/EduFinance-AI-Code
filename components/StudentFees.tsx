import React, { useState } from 'react';
import { Student } from '../types';
import { Search, Mail, Download, CheckCircle, XCircle, Clock } from 'lucide-react';

interface StudentFeesProps {
  students: Student[];
  onUpdatePayment: (studentId: string, amount: number) => void;
}

const StudentFees: React.FC<StudentFeesProps> = ({ students, onUpdatePayment }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PAID': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'PENDING': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'PARTIAL': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
      switch(status) {
        case 'PAID': return <CheckCircle size={14} />;
        case 'PENDING': return <XCircle size={14} />;
        case 'PARTIAL': return <Clock size={14} />;
        default: return null;
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Student Fee Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-sm font-medium transition-colors shadow-sm">
            <Download size={18} />
            Export Report
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Search by name or grade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Student Name</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Grade</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Total Fees</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Paid</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Balance</th>
                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                        {student.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-slate-800">{student.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{student.grade}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-800">${student.totalFees.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-emerald-600 font-medium">${student.paidFees.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-rose-600 font-medium">${(student.totalFees - student.paidFees).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}>
                                    {getStatusIcon(student.status)}
                                    {student.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Send Reminder">
                                        <Mail size={18} />
                                    </button>
                                    {student.status !== 'PAID' && (
                                        <button
                                            onClick={() => onUpdatePayment(student.id, 500)} // Mock payment
                                            className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                                        >
                                            Record Pay
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default StudentFees;