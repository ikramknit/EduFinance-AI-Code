import React from 'react';
import { LayoutDashboard, Wallet, TrendingDown, Users, Sparkles, LogOut, Menu } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income', label: 'Income', icon: Wallet },
    { id: 'expenses', label: 'Expenses', icon: TrendingDown },
    { id: 'students', label: 'Students & Fees', icon: Users },
    { id: 'ai-report', label: 'AI Insights', icon: Sparkles },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-lg font-bold">E</span>
          </div>
          EduFinance
        </h1>
        <p className="text-slate-400 text-xs mt-1">Institute Management</p>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id as ViewState);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-full">
        <NavContent />
      </aside>

      {/* Mobile Header & Overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-slate-900 p-4 flex items-center justify-between">
         <h1 className="text-xl font-bold text-white">EduFinance</h1>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
           <Menu size={24} />
         </button>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-slate-900 md:hidden flex flex-col">
           <div className="flex justify-end p-4">
             <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                <Menu size={24} />
             </button>
           </div>
           <NavContent />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-1 overflow-y-auto pt-16 md:pt-0">
          <div className="p-6 max-w-7xl mx-auto">
             {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;