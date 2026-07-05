import React, { useState, useEffect } from 'react';
import { LogOut, ClipboardList, Brain, MessageSquare, Sparkles, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { FeedbackForm } from '../types';
import AIChat from './AIChat';
import Messages from './Messages';

interface EmployeeDashboardProps {
  employeeName: string;
  employeeDept: string;
  onLogout: () => void;
}

export default function EmployeeDashboard({ employeeName, employeeDept, onLogout }: EmployeeDashboardProps) {
  const [activeTab, setActiveTab] = useState<'forms' | 'coach' | 'messages'>('forms');
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FeedbackForm | null>(null);
  
  // Dynamic Form wizard answers state
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [subSuccess, setSubSuccess] = useState<any | null>(null);

  const fetchForms = async () => {
    try {
      const response = await fetch('/api/forms');
      const data = await response.json();
      setForms(data);
    } catch (err) {
      console.error("Error fetching active forms: ", err);
    }
  };

  useEffect(() => {
    fetchForms();

    // Setup real-time event updates via Server-Sent Events (SSE)
    const eventSource = new EventSource('/api/realtime-stream');

    eventSource.addEventListener('new-form', () => {
      fetchForms();
    });

    eventSource.onerror = (err) => {
      console.warn('Real-time stream connection temporarily dropped. Retrying...', err);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleSelectForm = (form: FeedbackForm) => {
    setSelectedForm(form);
    // Initialize default answers
    const initialAnswers: Record<string, string | number> = {};
    form.fields.forEach(f => {
      initialAnswers[f.id] = f.type === 'rating' ? 3 : f.type === 'select' ? (f.options?.[0] || '') : '';
    });
    setAnswers(initialAnswers);
    setSubSuccess(null);
  };

  const handleAnswerChange = (fieldId: string, val: string | number) => {
    setAnswers(prev => ({ ...prev, [fieldId]: val }));
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;

    setSubmitting(true);
    
    // Map answer records into standard Submission field schema
    const formattedAnswers = selectedForm.fields.map(f => ({
      fieldId: f.id,
      label: f.label,
      type: f.type,
      value: answers[f.id]
    }));

    // Calculate an average rating or overall score if rating field exists, otherwise default
    const ratingFields = formattedAnswers.filter(a => a.type === 'rating');
    const overallRating = ratingFields.length > 0 
      ? Math.round(ratingFields.reduce((sum, current) => sum + Number(current.value), 0) / ratingFields.length)
      : 3; // default neutral if no rating question exists

    const payload = {
      formId: selectedForm._id || selectedForm.id,
      formTitle: selectedForm.title,
      employeeName,
      employeeDepartment: employeeDept,
      answers: formattedAnswers,
      rating: overallRating
    };

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const subData = await response.json();
        setSubSuccess(subData);
        setSelectedForm(null);
        setAnswers({});
      }
    } catch (err) {
      console.error("Failed to submit feedback: ", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col h-screen sticky top-0 shrink-0 select-none">
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                E
              </div>
              <div>
                <h1 className="text-md font-bold tracking-tight text-white font-display">AuraHR</h1>
                <p className="text-[10px] text-purple-400 font-mono">Feedback Portal</p>
              </div>
            </div>

            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => { setActiveTab('forms'); setSubSuccess(null); setSelectedForm(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    activeTab === 'forms'
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 font-medium'
                      : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  Feedback Surveys
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('coach'); setSubSuccess(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    activeTab === 'coach'
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 font-medium'
                      : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  Confidential AI Coach
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('messages'); setSubSuccess(null); }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    activeTab === 'messages'
                      ? 'bg-purple-500/10 border-purple-500/20 text-purple-400 font-medium'
                      : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Secure HR Direct
                </button>
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-900 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-300 font-bold border border-slate-800 text-xs font-mono">
                {employeeName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{employeeName}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{employeeDept} Dept</p>
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
            {activeTab === 'forms' && 'Your Feedbacks & Check-ins'}
            {activeTab === 'coach' && 'Confidential Wellbeing Advisor'}
            {activeTab === 'messages' && 'Secure Direct Mail to HR'}
          </h2>
        </header>

        {/* Main Workspace Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-8 py-8">
        {activeTab === 'forms' && (
          <div className="space-y-8">
            {/* Success Prompt immediately rendering AI analysis results */}
            {subSuccess && (
              <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden animate-fade-in">
                <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl"></div>
                
                <div className="flex gap-4 items-start relative z-10">
                  <div className="p-3 bg-purple-600/10 border border-purple-500/20 text-purple-400 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 animate-bounce" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-white">Feedback Successfully Received & AI-Analyzed!</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        Thank you, {employeeName}. Your feedback was securely committed to MongoDB Atlas and processed in real-time by Google Gemini.
                      </p>
                    </div>

                    {/* AI Takeaway Render */}
                    {subSuccess.aiAnalysis && (
                      <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest flex items-center gap-1">
                            <Brain className="w-3.5 h-3.5" /> Confidential AI Sentiment Feedback
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            subSuccess.aiAnalysis.sentiment === 'Positive' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            subSuccess.aiAnalysis.sentiment === 'Negative' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                            'bg-blue-500/10 border-blue-500/20 text-blue-400'
                          }`}>
                            {subSuccess.aiAnalysis.sentiment} Sentiment ({subSuccess.aiAnalysis.score}%)
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 italic leading-relaxed pt-1">
                          &ldquo;{subSuccess.aiAnalysis.summary}&rdquo;
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setSubSuccess(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => setActiveTab('coach')}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-550 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                      >
                        Chat with AI Coach <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!selectedForm && !subSuccess && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">Active Surveys & Check-ins</h2>
                  <p className="text-xs text-gray-400 mt-1">Select an active HR feedback form below. Your answers help shape future workspace initiatives.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {forms.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
                      <ClipboardList className="w-10 h-10 mx-auto text-slate-700 mb-2 animate-pulse" />
                      <p className="text-xs text-gray-500">No published feedback surveys are active right now.</p>
                    </div>
                  ) : (
                    forms.map(form => (
                      <div
                        key={form._id}
                        className="p-6 bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 rounded-2xl transition-all duration-300 flex flex-col justify-between group"
                      >
                        <div>
                          <h3 className="font-bold text-sm text-white group-hover:text-purple-400 transition-colors">{form.title}</h3>
                          <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{form.description}</p>
                        </div>
                        <div className="mt-5 pt-4 border-t border-slate-800/60 flex justify-between items-center">
                          <span className="text-[10px] font-mono text-slate-500">{form.fields.length} questions</span>
                          <button
                            onClick={() => handleSelectForm(form)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600/10 border border-purple-500/20 text-purple-400 hover:bg-purple-600 hover:text-white rounded-lg text-xs font-semibold transition-all"
                          >
                            Fill Form <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Dynamic Form Completion Wizard */}
            {selectedForm && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto shadow-2xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">{selectedForm.title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{selectedForm.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmitFeedback} className="space-y-6">
                  {selectedForm.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="block text-xs font-semibold text-gray-300">
                        {field.label}
                        {field.required && <span className="text-purple-400 ml-1">*</span>}
                      </label>

                      {field.type === 'text' && (
                        <textarea
                          value={answers[field.id] || ''}
                          onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                          className="w-full h-24 bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-lg px-4 py-2 text-xs text-white focus:outline-none transition-colors resize-none"
                          placeholder="Your honest answer (confidential to HR management)..."
                          required={field.required}
                        />
                      )}

                      {field.type === 'rating' && (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center gap-2">
                            {[1, 2, 3, 4, 5].map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() => handleAnswerChange(field.id, v)}
                                className={`flex-1 py-2.5 rounded-xl border font-mono font-bold text-xs transition-all ${
                                  answers[field.id] === v
                                    ? 'bg-purple-600/20 border-purple-500 text-purple-400 scale-[1.03]'
                                    : 'bg-slate-950 border-slate-800/80 text-gray-500 hover:text-white hover:border-slate-700'
                                }`}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500 px-1 pt-1 font-mono">
                            <span>Negative / Stressed</span>
                            <span>Excellent / Thriving</span>
                          </div>
                        </div>
                      )}

                      {field.type === 'select' && (
                        <select
                          value={answers[field.id] || ''}
                          onChange={(e) => handleAnswerChange(field.id, e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 focus:border-purple-550 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
                          required={field.required}
                        >
                          {field.options?.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 mt-4"
                  >
                    <Brain className="w-4 h-4 animate-pulse" />
                    {submitting ? "Analyzing answers with Gemini..." : "Submit Secure Feedback"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'coach' && (
          <AIChat currentRole="employee" employeeName={employeeName} />
        )}

        {activeTab === 'messages' && (
          <Messages currentRole="employee" username={employeeName} />
        )}
      </main>

      <footer className="border-t border-slate-900/80 py-6 text-center text-[10px] text-gray-500 font-mono mt-12 bg-slate-950">
        AuraHR confidential node • Fully secured with custom encryption rules and MongoDB persistent cluster.
      </footer>
    </div>
  </div>
  );
}
