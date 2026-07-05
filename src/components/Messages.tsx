import React, { useState, useEffect, useRef } from 'react';
import { Send, RefreshCw, UserCheck, ShieldAlert, AlertCircle, Sparkles } from 'lucide-react';
import { Message } from '../types';

interface MessagesProps {
  currentRole: 'admin' | 'employee';
  username: string; // current username (e.g. 'admin' or employee name)
}

export default function Messages({ currentRole, username }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<string>('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat threads or list of users we have messaged
  const fetchChatUsers = async () => {
    try {
      const response = await fetch('/api/messages');
      const data: Message[] = await response.json();
      
      // Calculate list of employees that have contacted admin
      const usersSet = new Set<string>();
      data.forEach(msg => {
        if (msg.fromUser !== 'admin') usersSet.add(msg.fromUser);
        if (msg.toUser !== 'admin') usersSet.add(msg.toUser);
      });
      
      const list = Array.from(usersSet);
      setChatUsers(list);
      
      // Auto select first user if none selected
      if (currentRole === 'admin' && list.length > 0 && !activeChatUser) {
        setActiveChatUser(list[0]);
      }
    } catch (err) {
      console.error("Error loading chat users: ", err);
    }
  };

  const fetchMessages = async () => {
    if (currentRole === 'employee') {
      // Employees always chat with admin
      try {
        const response = await fetch(`/api/messages?from=${username}&to=admin`);
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages: ", err);
      }
    } else if (currentRole === 'admin' && activeChatUser) {
      // Admin chats with activeChatUser
      try {
        const response = await fetch(`/api/messages?from=admin&to=${activeChatUser}`);
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error("Error fetching admin messages: ", err);
      }
    }
  };

  useEffect(() => {
    fetchChatUsers();
  }, [username]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s fallback

    // Real-time EventSource listener for instant, latency-free chat delivery
    const eventSource = new EventSource('/api/realtime-stream');

    eventSource.addEventListener('new-message', (e) => {
      try {
        const msg = JSON.parse(e.data);
        // If the message involves the current user (either sender or receiver), fetch immediately!
        if (msg.fromUser === username || msg.toUser === username) {
          fetchMessages();
          fetchChatUsers();
        }
      } catch (err) {
        console.error("Error parsing real-time message event:", err);
      }
    });

    return () => {
      clearInterval(interval);
      eventSource.close();
    };
  }, [activeChatUser, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const toUser = currentRole === 'admin' ? activeChatUser : 'admin';
    if (!toUser) return;

    setLoading(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUser: username,
          toUser,
          text,
          senderRole: currentRole
        })
      });

      if (response.ok) {
        setText('');
        fetchMessages();
        fetchChatUsers();
      }
    } catch (err) {
      console.error("Failed to send message: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[500px] border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/40 backdrop-blur-md">
      {/* Thread list for Admin */}
      {currentRole === 'admin' ? (
        <div className="md:col-span-1 border-r border-slate-800 p-4 space-y-4 bg-slate-950/40">
          <div className="flex justify-between items-center">
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 font-mono">Chat Threads</span>
            <button onClick={fetchChatUsers} className="text-gray-400 hover:text-indigo-400 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {chatUsers.length === 0 ? (
              <p className="text-[11px] text-gray-500 text-center py-6">No active messages yet.</p>
            ) : (
              chatUsers.map(user => (
                <button
                  key={user}
                  onClick={() => setActiveChatUser(user)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center gap-2 ${
                    activeChatUser === user
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-200 font-semibold'
                      : 'bg-slate-900/30 border-slate-800 text-gray-400 hover:bg-slate-900/60'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate">{user}</span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="md:col-span-1 border-r border-slate-800 p-4 space-y-4 bg-slate-950/40">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-gray-400 font-mono">Recipient</span>
            <div className="p-3.5 bg-purple-600/10 border border-purple-500/20 text-purple-200 rounded-xl text-xs flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              HR Administration
            </div>
            <p className="text-[10px] text-slate-400 leading-normal pt-2">
              💡 Your correspondence with HR is secure. Submit queries regarding feedback, career progress, or workspace policies here.
            </p>
          </div>
        </div>
      )}

      {/* Main chat window */}
      <div className="md:col-span-3 flex flex-col h-full bg-slate-950/20 relative">
        {currentRole === 'admin' && !activeChatUser ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-500">
            <AlertCircle className="w-10 h-10 mb-2 text-slate-700 animate-bounce" />
            <p className="text-xs">Select an employee from the chat threads to start direct communications.</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-white">
                  {currentRole === 'admin' ? `Conversation with: ${activeChatUser}` : 'Secure Chat with HR Manager'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Secured & Encrypted</span>
            </div>

            {/* Conversation Window */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px]">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-[11px]">
                  <Sparkles className="w-5 h-5 mx-auto mb-2 text-indigo-400/50" />
                  No messages in this chat yet. Send a greeting to start!
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isMe = m.fromUser === username;
                  return (
                    <div key={m._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-xs ${
                        isMe
                          ? (currentRole === 'admin' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-purple-600 text-white rounded-br-none')
                          : 'bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none'
                      }`}>
                        <p className="leading-relaxed">{m.text}</p>
                        <span className="text-[9px] opacity-75 block text-right mt-1 font-mono">
                          {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input message form */}
            <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800/80 flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-0 transition-colors"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!text.trim() || loading}
                className={`p-2.5 rounded-xl text-white transition-colors disabled:opacity-40 ${
                  currentRole === 'admin' ? 'bg-indigo-600 hover:bg-indigo-550' : 'bg-purple-600 hover:bg-purple-550'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
