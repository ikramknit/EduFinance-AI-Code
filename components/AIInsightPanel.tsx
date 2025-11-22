import React, { useState } from 'react';
import { Transaction, Student, FinancialReport } from '../types';
import { analyzeFinances } from '../services/geminiService';
import { Sparkles, Loader2, Target, TrendingUp, AlertTriangle, FileText } from 'lucide-react';

interface AIInsightPanelProps {
  transactions: Transaction[];
  students: Student[];
}

const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ transactions, students }) => {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeFinances(transactions, students);
      if (data) {
        setReport(data);
      } else {
        setError("Unable to generate report. Please check API key or try again.");
      }
    } catch (err) {
      setError("An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
             <Sparkles className="text-indigo-600" />
             AI Financial Consultant
          </h2>
          <p className="text-slate-500 text-sm mt-1">Powered by Gemini 2.5 Flash</p>
        </div>
        {!report && !loading && (
            <button
                onClick={handleAnalyze}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
            >
                <Sparkles size={18} />
                Generate Analysis
            </button>
        )}
      </div>

      {loading && (
          <div className="h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
              <p className="text-slate-600 font-medium">Analyzing financial data...</p>
              <p className="text-slate-400 text-sm">Reviewing income, expenses, and pending fees.</p>
          </div>
      )}

      {error && (
           <div className="p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
               {error}
           </div>
      )}

      {report && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Health Score Card */}
          <div className="md:col-span-1 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
             <div className="relative z-10 text-center">
                 <p className="text-slate-500 font-medium mb-4">Financial Health Score</p>
                 <div className="relative inline-flex items-center justify-center">
                     <svg className="w-32 h-32 transform -rotate-90">
                         <circle
                             className="text-slate-100"
                             strokeWidth="8"
                             stroke="currentColor"
                             fill="transparent"
                             r="58"
                             cx="64"
                             cy="64"
                         />
                         <circle
                             className={`${report.healthScore > 70 ? 'text-emerald-500' : report.healthScore > 40 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000 ease-out`}
                             strokeWidth="8"
                             strokeDasharray={365}
                             strokeDashoffset={365 - (365 * report.healthScore) / 100}
                             strokeLinecap="round"
                             stroke="currentColor"
                             fill="transparent"
                             r="58"
                             cx="64"
                             cy="64"
                         />
                     </svg>
                     <span className="absolute text-3xl font-bold text-slate-800">{report.healthScore}</span>
                 </div>
                 <p className="mt-4 text-sm text-slate-500">Based on liquidity & debt ratios</p>
             </div>
          </div>

          {/* Main Report */}
          <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                      <FileText size={20} className="text-indigo-600" />
                      Executive Summary
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                      {report.summary}
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                          <TrendingUp size={20} className="text-blue-600" />
                          Key Insights
                      </h3>
                      <ul className="space-y-3">
                          {report.keyInsights.map((insight, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
                                  {insight}
                              </li>
                          ))}
                      </ul>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-lg">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <Target size={20} className="text-white" />
                          Top Recommendation
                      </h3>
                      <p className="text-indigo-100 leading-relaxed text-sm">
                          {report.recommendation}
                      </p>
                      <button onClick={handleAnalyze} className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                          Refresh Analysis
                      </button>
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsightPanel;