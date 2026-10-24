'use client';

import React, { useState } from 'react';
import {
  Link2,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Lock,
  Unlock,
  Server,
  Layers,
  Copy,
  Check,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { analyzeUrlLocally } from '@/lib/url-analyzer';
import { URLCheckResult } from '@/lib/types';
import { saveUrlCheck } from '@/lib/storage';
import { RiskBadge } from '@/components/RiskBadge';

const SAMPLE_URLS = [
  {
    name: 'Brand Spoof + Suspicious TLD',
    url: 'http://paypal.com-verification-auth.tk/secure/login',
  },
  {
    name: 'Raw IP Host + Port',
    url: 'http://194.87.12.99:8080/banking/account-update',
  },
  {
    name: '@ Symbol Deception',
    url: 'https://google.com@phish-landing-page.xyz/auth',
  },
  {
    name: 'URL Shortener',
    url: 'https://bit.ly/usps-reschedule-3829',
  },
  {
    name: 'Legitimate Corporate URL',
    url: 'https://accounts.google.com/signin/v2/identifier',
  },
];

export default function UrlCheckerPage() {
  const [urlInput, setUrlInput] = useState('');
  const [result, setResult] = useState<URLCheckResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInspect = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = urlInput.trim();
    if (!trimmed) {
      setError('Please provide a URL to inspect.');
      return;
    }
    setError(null);
    const analyzed = analyzeUrlLocally(trimmed);
    setResult(analyzed);
    saveUrlCheck(analyzed);
  };

  const handleCopyVerdict = () => {
    if (!result) return;
    const text = `[CyberShield URL Inspection]
URL: ${result.url}
Verdict: ${result.verdict}
Risk Score: ${result.riskScore}/100 (${result.riskLevel.toUpperCase()})
Triggered Heuristics:
${result.indicators.filter(i => i.triggered).map(i => `- ${i.name}: ${i.details}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Heuristic URL & Domain Inspector
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Perform deterministic client-side structural parsing on web addresses. Uncovers IP hosts, brand impersonation in subdomains, @ symbol deception, dangerous extensions, and suspicious top-level domains without opening the link.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2.5">
        <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-blue-950">Zero-Contact Safe Inspection:</strong> CyberShield parses the URL string strictly inside your browser. No outbound HTTP requests or connections are made to the suspicious destination server, and links are never opened automatically.
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <form onSubmit={handleInspect} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Enter or paste suspicious link:
          </label>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Globe size={18} />
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="e.g. http://paypal-verify-account.tk/login"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono bg-slate-50/50"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-md shadow-blue-600/20 shrink-0 flex items-center justify-center gap-2"
            >
              <Link2 size={16} />
              Inspect URL
            </button>
          </div>
        </form>

        {/* Quick Sample Selector */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium">Test Heuristic Samples:</span>
          {SAMPLE_URLS.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setUrlInput(sample.url);
                setError(null);
                const analyzed = analyzeUrlLocally(sample.url);
                setResult(analyzed);
                saveUrlCheck(analyzed);
              }}
              className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-md font-medium transition"
            >
              {sample.name}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Result Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          {/* Top Verdict Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <RiskBadge level={result.riskLevel} score={result.riskScore} showScore size="lg" />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyVerdict}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Verdict'}
                </button>
                <span className="text-xs text-emerald-600 font-medium inline-flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 size={12} />
                  Saved locally
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Structural Verdict
              </h3>
              <p className="text-base text-slate-800 font-medium leading-relaxed">
                {result.verdict}
              </p>
            </div>

            {/* URL Breakdown Anatomy */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                URL Anatomy Breakdown:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-slate-400 font-medium mb-1">Protocol</div>
                  <div className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                    {result.protocol === 'https:' ? (
                      <Lock size={12} className="text-emerald-600" />
                    ) : (
                      <Unlock size={12} className="text-red-500" />
                    )}
                    {result.protocol || 'None'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="text-slate-400 font-medium mb-1">Hostname</div>
                  <div className="font-mono font-semibold text-slate-800 truncate" title={result.hostname}>
                    {result.hostname || 'None'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
                  <div className="text-slate-400 font-medium mb-1">Path</div>
                  <div className="font-mono font-semibold text-slate-800 truncate" title={result.pathname}>
                    {result.pathname || '/'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Heuristic Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers size={18} className="text-blue-600" />
                Heuristic Inspection Engine ({result.indicators.filter(i => i.triggered).length} Triggered)
              </h3>
              <span className="text-xs text-slate-500">
                Deterministic Client-Side Engine
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {result.indicators.map((ind, i) => (
                <div
                  key={i}
                  className={`py-3.5 flex items-start gap-3.5 transition-colors ${
                    ind.triggered ? 'bg-slate-50/50 -mx-6 px-6' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {ind.triggered ? (
                      ind.severity === 'danger' ? (
                        <XCircle size={18} className="text-red-600" />
                      ) : (
                        <AlertTriangle size={18} className="text-amber-500" />
                      )
                    ) : (
                      <CheckCircle2 size={18} className="text-emerald-500 opacity-60" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold ${ind.triggered ? 'text-slate-900' : 'text-slate-600'}`}>
                        {ind.name}
                      </span>
                      {ind.triggered && (
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            ind.severity === 'danger'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ind.severity}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{ind.description}</p>
                    {ind.details && (
                      <div className={`text-xs mt-1.5 font-medium ${ind.triggered ? 'text-slate-800' : 'text-slate-500'}`}>
                        {ind.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
