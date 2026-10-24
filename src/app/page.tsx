'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MailSearch,
  Link2,
  GraduationCap,
  MessageSquareCode,
  ArrowRight,
  TrendingUp,
  FileQuestion,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { getDashboardStats, DashboardStats, STORAGE_CHANGE_EVENT } from '@/lib/storage';
import { RiskBadge } from '@/components/RiskBadge';
import { EmptyState } from '@/components/EmptyState';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScanned: 0,
    messageScans: 0,
    urlScans: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    safeCount: 0,
    quizCompleted: false,
    quizScore: 0,
    quizTotal: 10,
    recentItems: [],
  });

  const [mounted, setMounted] = useState(false);

  const loadData = () => {
    setStats(getDashboardStats());
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    window.addEventListener(STORAGE_CHANGE_EVENT, loadData);
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, loadData);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200/60 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-200/60 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const quizPercentage = stats.quizTotal > 0 ? Math.round((stats.quizScore / stats.quizTotal) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 text-white p-6 sm:p-8 shadow-md border border-navy-700/50">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-400/30">
            <Sparkles size={13} />
            Security Defense Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Verify Before You Trust
          </h2>
          <p className="text-navy-200 text-sm sm:text-base leading-relaxed mb-6">
            CyberShield AI safeguards your credentials and privacy. Paste suspicious emails or SMS messages for Gemini AI threat analysis, test URLs locally for deception, and train your instincts with interactive scenarios.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/analyzer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 transition shadow-md shadow-blue-600/30"
            >
              <MailSearch size={16} />
              Analyze Suspicious Message
            </Link>
            <Link
              href="/url-checker"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-navy-100 bg-navy-800/80 hover:bg-navy-700/90 border border-navy-600/80 transition"
            >
              <Link2 size={16} />
              Inspect URL
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Metrics Row (Real metrics calculated from local storage) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Scans
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.totalScanned}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {stats.messageScans} messages &bull; {stats.urlScans} URLs
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              High / Critical Threats
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-red-600 tracking-tight">
              {stats.highRiskCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Flagged as severe deception
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Benign / Verified
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600 tracking-tight">
              {stats.safeCount}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Low or safe risk level
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quiz Awareness Score
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.quizCompleted ? `${quizPercentage}%` : `${stats.quizScore}/${stats.quizTotal}`}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              {stats.quizCompleted ? 'Quiz completed' : 'Quiz in progress or unstarted'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Quick Action Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Activity (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Recent Security Inspections
              </h3>
              <p className="text-xs text-slate-500">
                Live audit trail from your local session
              </p>
            </div>
            {stats.recentItems.length > 0 && (
              <Link
                href="/history"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View all history
                <ArrowRight size={13} />
              </Link>
            )}
          </div>

          {stats.recentItems.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No inspections recorded yet"
              description="Your analysis history is stored securely in your browser. Analyze an email, SMS message, or URL to populate your personal dashboard telemetry."
              actionText="Analyze First Message"
              actionHref="/analyzer"
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 shadow-xs overflow-hidden">
              {stats.recentItems.map(item => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                      {item.type === 'url' ? (
                        <Link2 size={16} />
                      ) : (
                        <MailSearch size={16} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                          {item.type}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(item.timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate max-w-md">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <RiskBadge level={item.riskLevel} score={item.riskScore} showScore size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Phishing Readiness & Quick Modules */}
        <div className="space-y-6">
          {/* Quiz Readiness Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Phishing IQ & Knowledge
                </h4>
                <p className="text-xs text-slate-500">10 realistic scenarios</p>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                <span>Progress: {stats.quizScore} / {stats.quizTotal} correct</span>
                <span>{quizPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    quizPercentage >= 80
                      ? 'bg-emerald-500'
                      : quizPercentage >= 50
                      ? 'bg-amber-500'
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${quizPercentage}%` }}
                />
              </div>
            </div>

            <Link
              href="/quiz"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition"
            >
              {stats.quizCompleted ? 'Retake Quiz' : 'Continue Phishing Quiz'}
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* AI Security Advisor Quick Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-6 rounded-2xl border border-blue-100 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                <MessageSquareCode size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-950">
                  CyberShield Assistant
                </h4>
                <p className="text-xs text-blue-700/80">Gemini-powered advisor</p>
              </div>
            </div>
            <p className="text-xs text-blue-900/80 leading-relaxed mb-4">
              Have questions about an odd text, unfamiliar URL, or executive impersonation? Chat directly with the AI advisor.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              Start Chat Consultation
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
