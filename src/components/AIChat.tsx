import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Brain, Bot, User, CornerDownLeft, MessageSquareDot } from 'lucide-react';

interface AIChatProps {
  currentRole: 'admin' | 'employee';
  employeeName?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

export default function AIChat({ currentRole, employeeName }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: currentRole === 'admin' 
        ? "Hello Administrator. I am your AuraHR AI Sentiment Analyst. I have scanned all submitted employee feedbacks, ratings, and sentiment reports. How can I help you strategic-plan team wellbeing or company culture initiatives today?"
        : `Welcome ${employeeName || 'Employee'}. I am your AuraHR confidential AI Coach. What you discuss here is completely anonymous and designed to support you. Ask me about dealing with burnout, setting work boundaries, or preparing for tough conversations.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = currentRole === 'admin' 
    ? [
        "Give me a bulleted summary of employee morale based on recent feedback.",
        "What are the main stressors or complaints mentioned in Engineering?",
        "Draft a cultural wellbeing policy addressing after-hours pings."
      ]
    : [
        "I feel overwhelmed and burnt out. How do I bring this up with my manager?",
        "What are some strategies to disconnect from work after hours?",
        "How can I suggest process improvements to my team constructively?"
      ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend, currentRole })
      });
      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || "Sorry, I am having trouble connecting to Gemini. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Error: ", err);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "Error: Could not reach AuraHR AI Services. Ensure your server is running and database is connected.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-950/80 to-indigo-950/20 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">
              {currentRole === 'admin' ? "AuraHR Admin AI Consultant" : "Confidential AI Wellbeing Coach"}
            </h3>
            <p className="text-[11px] text-gray-400">
              {currentRole === 'admin' ? "Strategic culture analytics" : "Anonymous professional guidance"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-400 px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
          <Sparkles className="w-3 h-3" />
          Gemini 3.5 Flash Active
        </div>
      </div>

      {/* Messages viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 max-w-[85%] ${m.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
              m.sender === 'ai' 
                ? (currentRole === 'admin' ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-400' : 'bg-purple-600/20 border border-purple-500/30 text-purple-400')
                : 'bg-slate-800 border border-slate-700 text-gray-300'
            }`}>
              {m.sender === 'ai' ? <Brain className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            
            <div className="space-y-1">
              <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                m.sender === 'user'
                  ? 'bg-indigo-600/15 border-indigo-500/30 text-slate-100 rounded-tr-none'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 rounded-tl-none'
              }`}>
                {/* Check if formatting is needed (markdown parser is perfect or we can handle text formatting simply) */}
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
              <span className={`text-[9px] text-slate-500 block ${m.sender === 'user' ? 'text-right' : ''}`}>
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-indigo-600/20 border border-indigo-500/30 text-indigo-400`}>
              <Brain className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-3.5 bg-slate-950/40 border border-slate-800/80 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></span>
              <span className="font-mono text-[10px] text-slate-500 ml-1">Analyzing submissions...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Buttons */}
      <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/40">
        <p className="text-[10px] text-gray-500 uppercase font-mono tracking-wider mb-1.5 flex items-center gap-1">
          <MessageSquareDot className="w-3.5 h-3.5 text-indigo-400" />
          Suggested prompts
        </p>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="text-[11px] bg-slate-900/80 hover:bg-slate-800 text-gray-300 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1 text-left transition-all max-w-full truncate disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={currentRole === 'admin' ? "Ask about department scores, trends, or draft solutions..." : "Ask your coach confidential question..."}
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
