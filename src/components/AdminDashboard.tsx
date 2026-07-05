import React, { useState, useEffect } from 'react';
import { 
  LogOut, Shield, BarChart3, PlusCircle, BrainCircuit, MessageSquare, 
  Trash2, FileSpreadsheet, RefreshCw, AlertTriangle, CheckCircle, 
  ChevronRight, Brain, Sparkles, TrendingUp, HelpCircle 
} from 'lucide-react';
import { FeedbackForm, FeedbackSubmission, HRStats } from '../types';
import FormCreator from './FormCreator';
import AIChat from './AIChat';
import Messages from './Messages';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'submissions' | 'create' | 'ai' | 'messages'>('overview');
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>([]);
  const [stats, setStats] = useState<HRStats | null>(null);
  const [selectedSub, setSelectedSub] = useState<FeedbackSubmission | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/stats');
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch active forms
      const formsRes = await fetch('/api/forms');
      const formsData = await formsRes.json();
      setForms(formsData);

      // Fetch submissions
      const subsRes = await fetch('/api/submissions');
      const subsData = await subsRes.json();
      setSubmissions(subsData);
    } catch (err) {
      console.error("Error loading admin dashboard datasets: ", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    // Setup real-time event updates via Server-Sent Events (SSE)
    const eventSource = new EventSource('/api/realtime-stream');

    eventSource.addEventListener('new-submission', () => {
      fetchAllData();
    });

    eventSource.addEventListener('new-form', () => {
      fetchAllData();
    });

    eventSource.onerror = (err) => {
      console.warn('Real-time stream connection temporarily dropped. Retrying...', err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleDeleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to archive this feedback form? Employees will no longer be able to submit responses to it.')) return;
    try {
      const res = await fetch(`/api/forms/${formId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAllData();
      }
    } catch (err) {
      console.error("Failed to archive form: ", err);
    }
  };

  // Filter high-urgency reports for priority alerts
  const urgencyAlerts = submissions.filter(s => s.aiAnalysis?.urgency === 'High');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col h-screen sticky top-0 shrink-0 select-none">
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                A
              </div>
              <div>
                <h1 className="text-md font-bold tracking-tight text-white font-display">AuraHR</h1>
                <p className="text-[10px] text-indigo-400 font-mono">Workplace Sentiment</p>
              </div>
            </div>

            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    activeTab === 'overview'
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-medium'
                      : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  HR Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    activeTab === 'submissions'
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-medium'
                      : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Submissions List
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    activeTab === 'create'
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-medium'
                      : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    activeTab === 'ai'
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-medium'
                      : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BrainCircuit className="w-4 h-4" />
                  AI Consultant
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    activeTab === 'messages'
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 font-medium'
                      : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Direct Messages
                </button>
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-900 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-300 font-bold border border-slate-800 text-xs font-mono">
                HR
              </div>
              <div>
                <p className="text-xs font-bold text-white">James Dalton</p>
                <p className="text-[10px] text-slate-500 font-mono">Admin Account</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 text-gray-400 hover:text-white text-xs font-medium border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="h-16 border-b border-slate-900 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
          <h2 className="text-sm font-bold font-display text-white">
            {activeTab === 'overview' && 'HR Analytics Command Center'}
            {activeTab === 'submissions' && 'Employee Submissions & Sentiment Insights'}
            {activeTab === 'create' && 'Dynamic Form Publication Studio'}
            {activeTab === 'ai' && 'AuraHR Strategic Advisor'}
            {activeTab === 'messages' && 'Confidential HR Mailbox'}
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchAllData}
              disabled={loading}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              title="Refresh console datasets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Main Admin Console Layout */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Total Feedbacks</span>
                    <h2 className="text-3xl font-extrabold text-white mt-1">{stats.totalFeedbacks}</h2>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 font-bold">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Avg Morale Rating</span>
                    <h2 className="text-3xl font-extrabold text-white mt-1">{stats.averageRating} <span className="text-xs text-gray-500 font-normal">/ 5</span></h2>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 font-bold">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                {/* Sentiment breakdown styled horizontal meters */}
                <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-lg flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2 block">AI Sentiment Ratios</span>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-[11px] font-medium font-mono text-slate-400">
                      <span className="text-emerald-400 flex items-center gap-1">● Positive</span>
                      <span>{stats.sentimentBreakdown.Positive}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium font-mono text-slate-400">
                      <span className="text-blue-400 flex items-center gap-1">● Neutral</span>
                      <span>{stats.sentimentBreakdown.Neutral}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium font-mono text-slate-400">
                      <span className="text-red-400 flex items-center gap-1">● Negative</span>
                      <span>{stats.sentimentBreakdown.Negative}</span>
                    </div>
                  </div>
                </div>

                {/* Urgency breakdown visual list */}
                <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-lg flex flex-col justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2 block">Action Urgency</span>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span className="text-red-400 font-bold">⚡ High Alerts</span>
                      <span>{stats.urgencyBreakdown.High}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span className="text-amber-400 font-bold">⚠ Medium Action</span>
                      <span>{stats.urgencyBreakdown.Medium}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span className="text-emerald-400 font-bold">✓ Low Risk</span>
                      <span>{stats.urgencyBreakdown.Low}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left & Middle Column: Priority Urgency Alerts and Active Forms */}
              <div className="lg:col-span-2 space-y-6">
                {/* Burnout/Conflict High-Urgency HR Alerts */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-red-500/10 rounded text-red-400">
                      <AlertTriangle className="w-4.5 h-4.5 animate-pulse" />
                    </div>
                    <h3 className="font-bold text-sm text-white">Critical HR Burnout Alerts ({urgencyAlerts.length})</h3>
                  </div>

                  <div className="space-y-3">
                    {urgencyAlerts.length === 0 ? (
                      <div className="p-5 bg-slate-950/40 border border-slate-800/80 rounded-xl text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        All employee wellness categories stable. No burnout warning signs identified.
                      </div>
                    ) : (
                      urgencyAlerts.map(sub => (
                        <div
                          key={sub._id}
                          className="p-4 bg-red-950/15 border border-red-550/20 hover:border-red-550/40 rounded-xl transition-colors cursor-pointer"
                          onClick={() => { setSelectedSub(sub); setActiveTab('submissions'); }}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-semibold text-xs text-red-300">{sub.employeeName} ({sub.employeeDepartment})</h4>
                              <p className="text-[11px] text-gray-300 leading-relaxed mt-1.5 line-clamp-2">
                                &ldquo;{sub.aiAnalysis?.summary}&rdquo;
                              </p>
                            </div>
                            <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-[9px] font-mono text-red-400 uppercase tracking-widest font-bold">
                              {sub.aiAnalysis?.category} Stress
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Published / Active Forms Listing */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs uppercase font-mono tracking-wider font-bold text-gray-400">Active Custom Surveys ({forms.length})</span>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      + Create Custom Form
                    </button>
                  </div>

                  <div className="divide-y divide-slate-800">
                    {forms.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">No active surveys published yet.</p>
                    ) : (
                      forms.map(form => (
                        <div key={form._id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center gap-4">
                          <div>
                            <h4 className="font-bold text-xs text-white">{form.title}</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{form.description}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteForm(form._id!)}
                            className="p-1.5 hover:bg-slate-800 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                            title="Archive Form"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Department metrics breakdown bento */}
              {stats && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-4 block">Feedbacks by Department</span>
                  <div className="space-y-4">
                    {Object.entries(stats.feedbacksByDepartment).length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-6">No department data available.</p>
                    ) : (
                      Object.entries(stats.feedbacksByDepartment).map(([dept, count]) => {
                        const maxCount = Math.max(...(Object.values(stats.feedbacksByDepartment) as number[]));
                        const percentage = maxCount > 0 ? ((count as number) / maxCount) * 100 : 0;
                        return (
                          <div key={dept} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-mono text-gray-300">
                              <span>{dept}</span>
                              <span className="font-bold text-white">{count} feedbacks</span>
                            </div>
                            <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in">
            {/* Left Column: Submissions interactive list */}
            <div className="lg:col-span-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 max-h-[600px] overflow-y-auto">
              <div>
                <h3 className="font-bold text-sm text-white">Employee Submissions</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Click a row to examine full answers and sentiment analyses</p>
              </div>

              <div className="space-y-2.5">
                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 text-xs">
                    No feedback received yet. Use the role-selector to submit feedback as an employee.
                  </div>
                ) : (
                  submissions.map(sub => (
                    <button
                      key={sub._id}
                      onClick={() => setSelectedSub(sub)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        selectedSub?._id === sub._id
                          ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-200'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-xs text-white">{sub.employeeName}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{sub.employeeDepartment} • Rating {sub.rating}/5</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider uppercase border ${
                          sub.aiAnalysis?.sentiment === 'Positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                          sub.aiAnalysis?.sentiment === 'Negative' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          'bg-blue-500/10 border-blue-500/20 text-blue-400'
                        }`}>
                          {sub.aiAnalysis?.sentiment || 'Neutral'}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Side: Render full submission answers + AI Analysis card details */}
            <div className="lg:col-span-2">
              {!selectedSub ? (
                <div className="p-12 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-gray-500 text-xs">
                  <BrainCircuit className="w-10 h-10 mx-auto text-slate-700 mb-2" />
                  Select an employee submission from the left panel to review dynamic survey inputs and deep AI coaching reports.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* AI Analysis Overlay Card */}
                  <div className="bg-gradient-to-br from-slate-900 to-indigo-950/20 border border-indigo-500/20 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl"></div>

                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-4 mb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
                          <Brain className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-white">AuraHR Sentiment Intelligence Report</h3>
                          <span className="text-[10px] font-mono text-indigo-400">Synthesized instantly via Gemini 3.5 Flash</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border uppercase tracking-wider ${
                          selectedSub.aiAnalysis?.urgency === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                          selectedSub.aiAnalysis?.urgency === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        }`}>
                          Urgency: {selectedSub.aiAnalysis?.urgency}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Empathetic Experience Summary</span>
                        <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                          &ldquo;{selectedSub.aiAnalysis?.summary}&rdquo;
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Takeaway Categories</span>
                        <div className="flex gap-2 mt-1.5">
                          <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-indigo-300">
                            Theme: {selectedSub.aiAnalysis?.category}
                          </span>
                          <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-indigo-300">
                            Sentiment Score: {selectedSub.aiAnalysis?.score}%
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/40">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-2 block">Actionable Management Takeaways</span>
                        <ul className="space-y-1.5">
                          {selectedSub.aiAnalysis?.actionablePoints.map((pt, pIdx) => (
                            <li key={pIdx} className="text-xs text-gray-300 flex items-start gap-1.5 leading-relaxed">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Submission Answers Details */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
                    <div className="border-b border-slate-800 pb-3 mb-4">
                      <h4 className="font-bold text-sm text-white">Full Form Inputs: {selectedSub.formTitle}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Submitted by {selectedSub.employeeName} ({selectedSub.employeeDepartment})</p>
                    </div>

                    <div className="space-y-4">
                      {selectedSub.answers.map((ans, aIdx) => (
                        <div key={aIdx} className="space-y-1.5 p-3.5 bg-slate-950/40 border border-slate-800/60 rounded-xl">
                          <span className="text-[10px] text-gray-400 font-mono">Q: {ans.label}</span>
                          <p className="text-xs font-semibold text-white">
                            {ans.type === 'rating' ? `${ans.value} / 5` : ans.value || "Not answered."}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'create' && (
          <FormCreator onFormCreated={fetchAllData} />
        )}

        {activeTab === 'ai' && (
          <AIChat currentRole="admin" />
        )}

        {activeTab === 'messages' && (
          <Messages currentRole="admin" username="admin" />
        )}
      </main>

      <footer className="border-t border-slate-900/80 py-6 text-center text-[10px] text-gray-500 font-mono mt-12 bg-slate-950">
        AuraHR confidential node • Fully secured with custom encryption rules and MongoDB persistent cluster.
      </footer>
    </div>
  </div>
  );
}
