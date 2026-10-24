'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareCode,
  Send,
  Sparkles,
  Bot,
  User,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { ApiKeyAlert } from '@/components/ApiKeyAlert';

const STARTER_PROMPTS = [
  'How do I spot Business Email Compromise (BEC)?',
  'What should I do immediately if I clicked a phishing link?',
  'How does Punycode homoglyph domain spoofing work?',
  'What is MFA fatigue and how do attackers bypass 2FA?',
  'How can I verify if a banking security SMS is legitimate?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am **CyberShield AI**, your dedicated cybersecurity and phishing awareness assistant.\n\nAsk me anything about identifying deceptive emails, suspicious SMS messages, domain spoofing tactics, or safe incident response protocols. You can also paste suspicious excerpts for me to analyze.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Check config on initial mount
  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/check-config');
        const data = await res.json();
        if (!data.configured) {
          setApiKeyMissing(true);
        }
      } catch {
        setApiKeyMissing(true);
      }
    }
    check();
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.filter(m => m.id !== 'welcome').map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503 || data.error === 'API_KEY_MISSING' || data.error === 'AI_UNAVAILABLE') {
          setApiKeyMissing(true);
        }
        throw new Error(data.message || 'Chat request failed');
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: data.content,
          timestamp: Date.now(),
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error reaching AI assistant.';
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ **Unable to complete response**: ${msg}\n\nPlease try again in a moment.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          'Chat history cleared. How can I assist you with phishing defense or cyber hygiene today?',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquareCode className="text-blue-600" size={24} />
            CyberShield AI Security Advisor
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gemini-powered interactive phishing prevention and incident counseling
          </p>
        </div>

        {messages.length > 1 && (
          <button
            onClick={handleClearChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <Trash2 size={13} />
            Clear Chat
          </button>
        )}
      </div>

      {apiKeyMissing && <ApiKeyAlert featureName="AI Chatbot Advisor" />}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-navy-900 text-blue-400 border border-navy-700'
                }`}
              >
                {isUser ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200/90 text-slate-800 shadow-xs rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line prose prose-sm max-w-none prose-slate">
                  {msg.content}
                </div>

                {!isUser && (
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    className="absolute top-2 right-2 p-1 rounded-md text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition"
                    title="Copy message"
                  >
                    {copiedId === msg.id ? (
                      <Check size={14} className="text-emerald-600" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-navy-900 text-blue-400 flex items-center justify-center shrink-0 border border-navy-700">
              <Bot size={16} />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-4 text-xs font-medium text-slate-500 flex items-center gap-2 shadow-xs">
              <RefreshCw size={14} className="animate-spin text-blue-600" />
              CyberShield AI is analyzing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts (if chat is fresh) */}
      {messages.length <= 2 && (
        <div className="space-y-1.5 pt-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Suggested Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {STARTER_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-blue-700 hover:border-blue-300 transition text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question or paste suspicious email headers, SMS, or URL..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition shadow-md shadow-blue-600/20 flex items-center gap-2"
        >
          <Send size={16} />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
