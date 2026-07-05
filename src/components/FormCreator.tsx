import React, { useState } from 'react';
import { Plus, Trash, Eye, Send, Sparkles, AlertCircle } from 'lucide-react';
import { FeedbackForm, FeedbackField } from '../types';

interface FormCreatorProps {
  onFormCreated: () => void;
}

export default function FormCreator({ onFormCreated }: FormCreatorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<FeedbackField[]>([
    { id: 'f1', type: 'rating', label: 'Rate your overall workplace experience this week.', required: true }
  ]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const addField = () => {
    const newField: FeedbackField = {
      id: 'f_' + Date.now(),
      type: 'text',
      label: '',
      required: false,
      options: []
    };
    setFields([...fields, newField]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof FeedbackField, value: any) => {
    const updated = [...fields];
    updated[index] = { ...updated[index], [key]: value };
    setFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Form title is required.');
      return;
    }
    if (fields.length === 0) {
      setError('Form must contain at least one question.');
      return;
    }
    
    // Validate fields have labels
    const invalid = fields.some(f => !f.label.trim());
    if (invalid) {
      setError('All questions must have a defined label.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, fields })
      });

      if (!response.ok) {
        throw new Error('Failed to create form on the server.');
      }

      setSuccess('AuraHR custom form successfully created and published!');
      setTitle('');
      setDescription('');
      setFields([{ id: 'f1', type: 'rating', label: 'Rate your overall workplace experience this week.', required: true }]);
      onFormCreated();
    } catch (err: any) {
      setError(err.message || 'Error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-start">
      {/* Editor Panel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Create Custom Feedback Form</h3>
            <p className="text-xs text-gray-400">Form questions instantly sync to all employee dashboards</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-bounce" />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Form Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
              placeholder="e.g. Workload & Team Capacity Check-in"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-16 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-4 py-2 text-xs text-white focus:outline-none transition-colors resize-none"
              placeholder="Provide context or instructions for your employees..."
            />
          </div>

          <div className="border-t border-slate-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-gray-300">Questions & Fields ({fields.length})</span>
              <button
                type="button"
                onClick={addField}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Question
              </button>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl space-y-3 relative group">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] font-mono text-indigo-400">Question {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeField(index)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, 'label', e.target.value)}
                        placeholder="e.g. How is your project scope?"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-550 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(index, 'type', e.target.value as any)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-550 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                      >
                        <option value="text">Text Answer</option>
                        <option value="rating">1-5 Rating</option>
                        <option value="select">Dropdown Select</option>
                      </select>
                    </div>
                  </div>

                  {field.type === 'select' && (
                    <div>
                      <input
                        type="text"
                        placeholder="Options separated by commas: Option A, Option B, Option C"
                        onChange={(e) => updateField(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                        value={field.options?.join(', ') || ''}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] text-gray-300 focus:outline-none"
                        required
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`req-${field.id}`}
                      checked={field.required}
                      onChange={(e) => updateField(index, 'required', e.target.checked)}
                      className="rounded text-indigo-600 bg-slate-900 border-slate-800"
                    />
                    <label htmlFor={`req-${field.id}`} className="text-[10px] text-gray-400 select-none">Required field</label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-900/20"
          >
            <Send className="w-4 h-4" />
            {loading ? "Creating..." : "Publish Form to Employees"}
          </button>
        </form>
      </div>

      {/* Preview Panel */}
      <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 shadow-inner h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6 text-gray-400">
          <Eye className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">Live Dashboard Preview</span>
        </div>

        <div className="flex-1 bg-slate-900 border border-slate-800/60 rounded-xl p-5 space-y-4 max-h-[500px] overflow-y-auto">
          <div>
            <h4 className="font-bold text-base text-white">{title || "Untitled HR Form"}</h4>
            <p className="text-xs text-gray-400 mt-1 whitespace-pre-wrap">{description || "No description provided."}</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/60">
            {fields.map((field, idx) => (
              <div key={idx} className="space-y-2">
                <label className="block text-xs font-medium text-gray-300">
                  {field.label || `Question ${idx + 1}`}
                  {field.required && <span className="text-indigo-400 ml-1">*</span>}
                </label>

                {field.type === 'text' && (
                  <textarea
                    disabled
                    placeholder="Employee text response goes here..."
                    className="w-full h-12 bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-gray-500 resize-none cursor-not-allowed"
                  />
                )}

                {field.type === 'rating' && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <div
                        key={v}
                        className="w-8 h-8 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center text-xs text-gray-500 font-mono"
                      >
                        {v}
                      </div>
                    ))}
                  </div>
                )}

                {field.type === 'select' && (
                  <div className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-gray-500 flex justify-between items-center cursor-not-allowed">
                    <span>{field.options && field.options.length > 0 ? field.options[0] : "Select option..."}</span>
                    <span className="text-gray-600">&darr;</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
