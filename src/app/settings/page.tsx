'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  ShieldCheck,
  BookOpen,
  AlertTriangle,
  Database,
  Trash2,
  Download,
  Info,
  CheckCircle2,
  Cpu,
  Layers,
  GraduationCap,
} from 'lucide-react';
import {
  getStoredAnalyses,
  getStoredUrlChecks,
  clearAllHistory,
  STORAGE_CHANGE_EVENT,
} from '@/lib/storage';
import { Modal } from '@/components/Modal';

export default function SettingsPage() {
  const [analysisCount, setAnalysisCount] = useState(0);
  const [urlCount, setUrlCount] = useState(0);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [clearedMessage, setClearedMessage] = useState(false);

  const loadStats = () => {
    setAnalysisCount(getStoredAnalyses().length);
    setUrlCount(getStoredUrlChecks().length);
  };

  useEffect(() => {
    loadStats();
    window.addEventListener(STORAGE_CHANGE_EVENT, loadStats);
    return () => {
      window.removeEventListener(STORAGE_CHANGE_EVENT, loadStats);
    };
  }, []);

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      analyses: getStoredAnalyses(),
      urlChecks: getStoredUrlChecks(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cybershield-backup-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearAll = () => {
    clearAllHistory();
    loadStats();
    setClearConfirmOpen(false);
    setClearedMessage(true);
    setTimeout(() => setClearedMessage(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="text-blue-600" size={24} />
          Settings & Security Knowledge Base
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          System operational status, privacy preferences, phishing indicator reference, and incident response guidelines
        </p>
      </div>

      {/* 1. Security Engines Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Protection & Analysis Engines
            </h3>
            <p className="text-xs text-slate-500">
              Real-time multi-layered phishing defense modules
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers size={14} className="text-blue-600" />
                URL Heuristics
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              12+ client-side heuristic rules verifying domains, TLDs, IP hosts, and homoglyphs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <GraduationCap size={14} className="text-purple-600" />
                Training Simulator
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Interactive scenario-based phishing awareness training with instant score tracking.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Cpu size={14} className="text-indigo-600" />
                Threat Intelligence
              </span>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Advanced natural language threat classification for messages and social engineering.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Privacy & Local Data Storage */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Privacy & Data Storage
              </h3>
              <p className="text-xs text-slate-500">
                Manage your browser-stored inspection history and audit records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              <Download size={13} />
              Export Backup
            </button>
            <button
              onClick={() => setClearConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
            >
              <Trash2 size={13} />
              Clear All Data
            </button>
          </div>
        </div>

        {clearedMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 rounded-xl flex items-center gap-2">
            <CheckCircle2 size={15} className="text-emerald-600" />
            All local inspection history and cached records have been cleared.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Saved Message Analyses</span>
            <span className="font-bold text-slate-900">{analysisCount} records</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Checked URL Records</span>
            <span className="font-bold text-slate-900">{urlCount} records</span>
          </div>
        </div>

        <div className="text-xs text-slate-500 leading-relaxed bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/60">
          <strong className="text-slate-700">Privacy Guarantee:</strong> All inspected communications and URLs are stored strictly in your local browser storage (<code className="font-mono text-slate-700">localStorage</code>). No personal data or analyzed message texts are retained on external servers or transmitted to third-party databases.
        </div>
      </div>

      {/* 3. Phishing Indicator Cheat Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-600" />
          Phishing Indicator Quick Reference
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">Display Name vs. Sender Domain</h4>
            <p className="text-slate-600 leading-relaxed">
              Attackers change the friendly display name to &ldquo;CEO&rdquo; or &ldquo;IT Helpdesk&rdquo;, while the actual underlying email address is a random webmail or lookalike domain. Always inspect the full email address inside angle brackets &lt;...&gt;.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">Subdomain Spoofing</h4>
            <p className="text-slate-600 leading-relaxed">
              A domain like <code className="font-mono text-blue-700">paypal.com.verify-billing.xyz</code> does NOT belong to PayPal. The true root domain is <code className="font-mono text-red-600">verify-billing.xyz</code>. The words before it are merely arbitrary subdomains created by the phisher.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">Quishing (QR Code Scams)</h4>
            <p className="text-slate-600 leading-relaxed">
              Phishing delivered via QR codes in emails or stickers on parking meters bypasses text-based email filters and obscures the destination URL from human inspection before scanning.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-900">Artificial Urgency & Fear</h4>
            <p className="text-slate-600 leading-relaxed">
              Deadlines like &ldquo;account will be terminated in 2 hours&rdquo; or &ldquo;unauthorized charge of $1,400&rdquo; are designed to trigger fear and bypass critical thinking. Real institutions allow reasonable verification periods.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Platform Limitations & Responsible Use */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600" />
          Platform Limitations & Responsible Use
        </h3>

        <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
          <p>
            <strong>Heuristic & AI Assistance:</strong> CyberShield AI provides educational analysis and risk indicators based on known deception patterns. It is an awareness assistant, not an endpoint detection (EDR) or perimeter firewall.
          </p>
          <p>
            <strong>Never Claim Guaranteed Safety:</strong> A &ldquo;Safe&rdquo; or &ldquo;Low Risk&rdquo; score indicates that no overt attack signatures or anomalies were identified in the submitted text, but sophisticated targeted attacks (zero-day phishing, compromised authentic mailboxes) may still occur. Always exercise out-of-band verification when finances or credentials are at stake.
          </p>
          <p>
            <strong>Zero-Contact URL Safety:</strong> The URL inspector performs structural string parsing and regular expression analysis only; no outbound network requests are made to unknown or potentially malicious hosts.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        title="Confirm Clear Local History"
        maxWidth="md"
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-start gap-2.5">
            <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-red-950">Permanent action:</strong> This will delete all saved message analyses and URL inspection results stored in this browser.
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to clear your local history? You can export a backup file beforehand if you wish.
          </p>
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              onClick={() => setClearConfirmOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              Yes, Clear All History
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
