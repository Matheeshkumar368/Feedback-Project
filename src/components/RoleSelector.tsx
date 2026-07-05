import React, { useState } from 'react';
import { Shield, User, Sparkles, Database, Loader2 } from 'lucide-react';

interface RoleSelectorProps {
  onSelectRole: (role: 'admin' | 'employee', username?: string, department?: string) => void;
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  const [selected, setSelected] = useState<'admin' | 'employee' | null>(null);

  // Admin Login State
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  // Employee Login State
  const [employeeName, setEmployeeName] = useState('');
  const [employeeDept, setEmployeeDept] = useState('Engineering');

  // Shared UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUser, password: adminPass })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed. Please try again.');
        return;
      }
      onSelectRole('admin', data.username);
    } catch {
      setError('Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!employeeName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: employeeName.trim(), department: employeeDept })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not sign in. Please try again.');
        return;
      }
      onSelectRole('employee', data.username, data.department);
    } catch {
      setError('Unable to reach server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-gradient-to-br from-slate-950 via-gray-950 to-slate-900 overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Branding header */}
      <div className="text-center mb-10 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Powered by Gemini 3.5 &amp; MongoDB Atlas
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
          AuraHR
        </h1>
        <p className="text-gray-400 mt-2 text-sm max-w-md">
          Next-generation workplace sentiment intelligence &amp; confidential AI feedback portal.
        </p>
      </div>

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md z-10">

        {/* Error banner */}
        {error && (
          <div className="mb-5 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Step 1 — Role picker */}
        {!selected && (
          <div>
            <h2 className="text-xl font-bold text-white text-center mb-6">Select Your Workspace Role</h2>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => { setSelected('admin'); setError(''); }}
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
        )}

        {/* Step 2a — Admin Login Form */}
        {selected === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={() => { setSelected(null); setError(''); }}
                className="text-xs text-indigo-400 hover:underline"
              >
                ← Back
              </button>
              <span className="text-xs text-gray-500 font-mono">HR Administrator Access</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <span className="text-[10px] text-slate-500 block mt-1">💡 Default: admin / admin123</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-60 text-white font-medium text-sm py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-indigo-900/30 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in…' : 'Secure Login →'}
            </button>
          </form>
        )}

        {/* Step 2b — Employee Login Form */}
        {selected === 'employee' && (
          <form onSubmit={handleEmployeeLogin} className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={() => { setSelected(null); setError(''); }}
                className="text-xs text-purple-400 hover:underline"
              >
                ← Back
              </button>
              <span className="text-xs text-gray-500 font-mono">Employee Identity Entry</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Your Full Name
              </label>
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
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Department
              </label>
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
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 disabled:opacity-60 text-white font-medium text-sm py-2.5 rounded-lg transition-all duration-300 shadow-lg shadow-purple-900/30 mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Entering portal…' : 'Enter Portal →'}
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
