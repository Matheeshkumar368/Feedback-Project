import React, { useState } from 'react';
import { Shield, User, Sparkles, Database } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: 'admin' | 'employee', username?: string, department?: string) => void;
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const [selected, setSelected] = useState<'admin' | 'employee' | null>(null);
  
  // Admin Login Credentials State
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('admin');
  const [error, setError] = useState('');

  // Employee Login State
  const [employeeName, setEmployeeName] = useState('');
  const [employeeDept, setEmployeeDept] = useState('Engineering');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === 'admin' && adminPass === 'admin') {
      onSelectRole('admin', 'admin');
    } else {
      setError('Invalid admin credentials. Use admin / admin');
    }
  };

  const handleEmployeeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName.trim()) {
      setError('Please enter your name');
      return;
    }
    onSelectRole('employee', employeeName, employeeDept);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 overflow-hidden relative">
      {/* Visual background details */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      {/* Main branding */}
      <div className="text-center mb-10 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-550/10 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Powered by Gemini 3.5 & MongoDB Atlas
        </div>
        <h1 className="text-5xl font-extrabold font-display tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
          AuraHR
        </h1>
        <p className="text-gray-400 mt-2 text-sm max-w-md">
          Next-generation workplace sentiment intelligence & confidential AI feedback portal.
        </p>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md z-10">
        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {!selected ? (
          <div>
            <h2 className="text-xl font-bold font-display text-white text-center mb-6">Select Your Workspace Role</h2>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => { setSelected('admin'); setError(''); }}
                id="select-admin-btn"
                className="flex items-center gap-4 p-5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl transition-all duration-300 text-left group"
              >
                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">HR Administration</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Define forms, analyze stats, view AI feedback takeaways.</p>
                </div>
              </button>

              <button
                onClick={() => { setSelected('employee'); setError(''); }}
                id="select-employee-btn"
                className="flex items-center gap-4 p-5 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-purple-500/50 rounded-xl transition-all duration-300 text-left group"
              >
                <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">Employee Portal</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Submit dynamic feedback, chat with your private AI coach.</p>
                </div>
              </button>
            </div>
          </div>
        ) : selected === 'admin' ? (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-xs text-indigo-400 hover:underline"
              >
                &larr; Back to Selection
              </button>
              <span className="text-xs text-gray-500 font-mono">HR Administrator Access</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Admin Username</label>
              <input
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                placeholder="e.g. admin"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                placeholder="••••••••"
                required
              />
              <span className="text-[10px] text-slate-500 block mt-1">💡 Demo Credentials: admin / admin</span>
            </div>

            <button
              type="submit"
              id="admin-login-submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-900/30 font-display mt-2"
            >
              Secure Login &rarr;
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmployeeLogin} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-xs text-purple-400 hover:underline"
              >
                &larr; Back to Selection
              </button>
              <span className="text-xs text-gray-500 font-mono">Employee Identity Entry</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Full Name</label>
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                placeholder="e.g. Alice Chen"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Department</label>
              <select
                value={employeeDept}
                onChange={(e) => setEmployeeDept(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="HR">HR</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <button
              type="submit"
              id="employee-login-submit"
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-medium text-sm py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-purple-900/30 font-display mt-2"
            >
              Enter Portal &rarr;
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 flex items-center gap-1.5 text-[11px] text-gray-500 z-10 font-mono">
        <Database className="w-3.5 h-3.5" />
        Connected to secure MongoDB cluster
      </div>
    </div>
  );
}
