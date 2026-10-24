'use client';

import React, { useState } from 'react';
import {
  MailSearch,
  MessageSquare,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  FileText,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { AnalysisResult } from '@/lib/types';
import { saveAnalysis } from '@/lib/storage';
import { RiskBadge } from '@/components/RiskBadge';
import { ApiKeyAlert } from '@/components/ApiKeyAlert';

const SAMPLE_TEMPLATES = [
  {
    name: 'Payroll Phishing (Email)',
    type: 'email' as const,
    text: `From: HR Department <hr-payroll@corporate-auth-update.net>
Subject: URGENT: Complete direct deposit reverification before 5:00 PM payroll cutoff

Dear Employee,

We encountered a routing failure with your direct deposit account. If your banking details are not reverified on our external portal before 5:00 PM today, your upcoming paycheck will be withheld.

Click here to verify: http://corporate-auth-update.net/payroll/login.php

Regards,
Corporate HR Benefits Division`,
  },
  {
    name: 'Bank Alert (SMS)',
    type: 'sms' as const,
    text: `[WELLS FARGO ALERT]: Unusual activity detected on card ending in 8841 for $920.00 at TARGET. If this was not you, respond NO or secure your account at https://wellsfargo-card-verify.top/auth`,
  },
  {
    name: 'Legitimate Calendar Invite (Email)',
    type: 'email' as const,
    text: `From: calendar-notification@google.com
Subject: Invitation: Project Sync @ Thu Oct 23, 2026 2pm - 3pm

You have been invited to Project Sync.
When: Thursday Oct 23, 2026 2:00pm – 3:00pm
Organizer: team-lead@yourcompany.com
Joining info: https://meet.google.com/xyz-abc-def`,
  },
];

export default function AnalyzerPage() {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'email' | 'sms'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 5) {
      setError('Please enter at least 5 characters to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setApiKeyMissing(false);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503 || data.error === 'API_KEY_MISSING' || data.error === 'AI_UNAVAILABLE') {
          setApiKeyMissing(true);
        }
        throw new Error(data.message || 'Analysis failed. Please check your setup.');
      }

      setResult(data);
      // Persist to local storage
      saveAnalysis(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred during analysis.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const summaryText = `[CyberShield AI Analysis]
Risk Level: ${result.riskLevel.toUpperCase()} (Score: ${result.riskScore}/100)
Summary: ${result.summary}
Safe Actions:
${result.safeActions.map(a => `- ${a}`).join('\n')}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Title & Intro */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          AI Message & Phishing Analyzer
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Paste the raw content of an email or SMS message. CyberShield AI inspects deceptive language, artificial urgency, spoofed senders, and malicious intent.
        </p>
      </div>

      {apiKeyMissing && <ApiKeyAlert featureName="AI Message Analysis" />}

      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Message Type:
              </span>
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setType('email')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    type === 'email'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setType('sms')}
                  className={`px-3 py-1.5 rounded-md transition ${
                    type === 'sms'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  SMS / Text
                </button>
              </div>
            </div>

            {/* Quick Sample Lures for instant test */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-medium">Test Samples:</span>
              {SAMPLE_TEMPLATES.map((sample, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setType(sample.type);
                    setContent(sample.text);
                    setResult(null);
                    setError(null);
                  }}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-md font-medium transition"
                >
                  {sample.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Pasted Message Text:
            </label>
            <textarea
              rows={7}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste the email body, headers, or SMS text here..."
              className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-mono bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <Lock size={13} />
              <span>Privacy notice: Never paste real passwords, PINs, or bank OTPs.</span>
            </div>

            <div className="flex items-center space-x-3">
              {content && (
                <button
                  type="button"
                  onClick={() => {
                    setContent('');
                    setResult(null);
                    setError(null);
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-blue-600/20"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Analyzing with Gemini...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Analyze Message
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && !apiKeyMissing && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Result Output */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Top Verdict Banner */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <RiskBadge level={result.riskLevel} score={result.riskScore} showScore size="lg" />
                {result.urgencyLevel && result.urgencyLevel !== 'none' && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                    Urgency: {result.urgencyLevel}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Summary'}
                </button>
                <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 size={12} />
                  Saved locally
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Executive Verdict
              </h3>
              <p className="text-base text-slate-800 font-medium leading-relaxed">
                {result.summary}
              </p>
            </div>

            {/* Sender Analysis If Present */}
            {result.senderAnalysis && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm space-y-1">
                <div className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>Claimed Sender: <code className="text-blue-700">{result.senderAnalysis.claimedSender || 'Not specified'}</code></span>
                  {result.senderAnalysis.isSuspicious ? (
                    <span className="text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded text-[11px]">Suspicious Sender</span>
                  ) : (
                    <span className="text-emerald-700 font-medium bg-emerald-100 px-2 py-0.5 rounded text-[11px]">No Sender Anomaly</span>
                  )}
                </div>
                <p className="text-slate-600">{result.senderAnalysis.analysis}</p>
              </div>
            )}
          </div>

          {/* Red Flags & Quoted Evidence */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert size={18} className="text-red-600" />
              Identified Red Flags & Deception Cues ({result.redFlags.length})
            </h3>

            {result.redFlags.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span>No major manipulative red flags or phishing indicators detected in the provided text.</span>
              </div>
            ) : (
              <div className="space-y-3">
                {result.redFlags.map((flag, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-2 hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        {flag.category}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          flag.severity === 'high'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : flag.severity === 'medium'
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {flag.severity} severity
                      </span>
                    </div>

                    <p className="text-sm text-slate-700">{flag.finding}</p>

                    {flag.quote && (
                      <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 font-mono italic">
                        &ldquo;{flag.quote}&rdquo;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Safe Next Steps */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Safe Next Steps & Recommended Protocol
            </h3>
            <ul className="space-y-2.5">
              {result.safeActions.map((action, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-sm text-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* In-depth AI Security Explanation */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Info size={18} className="text-blue-600" />
              In-Depth Cybersecurity Assessment
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-200">
              {result.explanation}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
