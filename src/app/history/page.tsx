'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  History,
  Trash2,
  MailSearch,
  Link2,
  Search,
  Filter,
  Eye,
  Download,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  getStoredAnalyses,
  getStoredUrlChecks,
  deleteAnalysis,
  deleteUrlCheck,
  clearAllHistory,
  STORAGE_CHANGE_EVENT,
} from '@/lib/storage';
import { AnalysisResult, URLCheckResult, RiskLevel } from '@/lib/types';
import { RiskBadge } from '@/components/RiskBadge';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';

type CombinedItem =
  | { kind: 'analysis'; data: AnalysisResult }
  | { kind: 'url'; data: URLCheckResult };

export default function HistoryPage() {
  const [items, setItems] = useState<CombinedItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'email' | 'sms' | 'url'>('all');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'safe'>('all');

  // Modal states
  const [selectedItem, setSelectedItem] = useState<CombinedItem | null>(null);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const loadData = () => {
    const analyses = getStoredAnalyses().map(a => ({ kind: 'analysis' as const, data: a }));
    const urlChecks = getStoredUrlChecks().map(u => ({ kind: 'url' as const, data: u }));
    const combined = [...analyses, ...urlChecks].sort(
      (a, b) => b.data.timestamp - a.data.timestamp
    );
    setItems(combined);
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
    return <div className="p-8 text-center text-slate-400">Loading inspection history...</div>;
  }

  // Filter items
  const filtered = items.filter(item => {
    // Type filter
    if (typeFilter === 'email' && (item.kind !== 'analysis' || item.data.type !== 'email')) return false;
    if (typeFilter === 'sms' && (item.kind !== 'analysis' || item.data.type !== 'sms')) return false;
    if (typeFilter === 'url' && item.kind !== 'url') return false;

    // Risk filter
    if (riskFilter === 'high' && item.data.riskLevel !== 'high' && item.data.riskLevel !== 'critical') return false;
    if (riskFilter === 'medium' && item.data.riskLevel !== 'medium') return false;
    if (riskFilter === 'safe' && item.data.riskLevel !== 'safe' && item.data.riskLevel !== 'low') return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      if (item.kind === 'analysis') {
        const text = `${item.data.summary} ${item.data.contentPreview} ${item.data.explanation}`.toLowerCase();
        if (!text.includes(q)) return false;
      } else {
        const text = `${item.data.url} ${item.data.hostname} ${item.data.verdict}`.toLowerCase();
        if (!text.includes(q)) return false;
      }
    }

    return true;
  });

  const handleDeleteItem = (item: CombinedItem) => {
    if (item.kind === 'analysis') {
      deleteAnalysis(item.data.id);
    } else {
      deleteUrlCheck(item.data.id);
    }
    loadData();
    if (selectedItem?.data.id === item.data.id) {
      setSelectedItem(null);
    }
  };

  const handleClearAll = () => {
    clearAllHistory();
    loadData();
    setClearConfirmOpen(false);
    setSelectedItem(null);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cybershield-history-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="text-blue-600" size={24} />
            Analysis & Inspection History
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Local browser record of inspected communications and tested domains ({items.length} total)
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition"
            >
              <Download size={13} />
              Export JSON
            </button>
            <button
              onClick={() => setClearConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
            >
              <Trash2 size={13} />
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      {items.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search history by keyword, domain, or summary..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-2.5 py-1 rounded-md transition ${typeFilter === 'all' ? 'bg-white text-blue-700 shadow-xs' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('email')}
                className={`px-2.5 py-1 rounded-md transition ${typeFilter === 'email' ? 'bg-white text-blue-700 shadow-xs' : ''}`}
              >
                Email
              </button>
              <button
                onClick={() => setTypeFilter('sms')}
                className={`px-2.5 py-1 rounded-md transition ${typeFilter === 'sms' ? 'bg-white text-blue-700 shadow-xs' : ''}`}
              >
                SMS
              </button>
              <button
                onClick={() => setTypeFilter('url')}
                className={`px-2.5 py-1 rounded-md transition ${typeFilter === 'url' ? 'bg-white text-blue-700 shadow-xs' : ''}`}
              >
                URLs
              </button>
            </div>

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-2.5 py-1 rounded-md transition ${riskFilter === 'all' ? 'bg-white text-blue-700 shadow-xs' : ''}`}
              >
                All Risk
              </button>
              <button
                onClick={() => setRiskFilter('high')}
                className={`px-2.5 py-1 rounded-md transition ${riskFilter === 'high' ? 'bg-white text-red-700 shadow-xs' : ''}`}
              >
                High/Critical
              </button>
              <button
                onClick={() => setRiskFilter('medium')}
                className={`px-2.5 py-1 rounded-md transition ${riskFilter === 'medium' ? 'bg-white text-amber-700 shadow-xs' : ''}`}
              >
                Medium
              </button>
              <button
                onClick={() => setRiskFilter('safe')}
                className={`px-2.5 py-1 rounded-md transition ${riskFilter === 'safe' ? 'bg-white text-emerald-700 shadow-xs' : ''}`}
              >
                Safe/Low
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {items.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No inspection records found"
          description="Your local analysis history is empty. When you analyze emails, SMS messages, or URLs, a safe local audit trail will be maintained here."
          actionText="Analyze a Suspicious Message"
          actionHref="/analyzer"
        />
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm text-slate-500">No records match your search or filter criteria.</p>
          <button
            onClick={() => {
              setSearch('');
              setTypeFilter('all');
              setRiskFilter('all');
            }}
            className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Clear active filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filtered.map(item => {
            const isUrl = item.kind === 'url';
            const id = item.data.id;
            const dateStr = new Date(item.data.timestamp).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            });

            return (
              <div
                key={id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                    {isUrl ? <Link2 size={18} /> : <MailSearch size={18} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {isUrl ? 'URL Check' : item.data.type}
                      </span>
                      <span className="text-xs text-slate-400">{dateStr}</span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 truncate">
                      {isUrl
                        ? item.data.hostname + (item.data.pathname !== '/' ? item.data.pathname : '')
                        : item.data.summary}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {isUrl ? item.data.verdict : item.data.contentPreview}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <RiskBadge
                    level={item.data.riskLevel}
                    score={item.data.riskScore}
                    showScore
                    size="sm"
                  />

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={Boolean(selectedItem)}
          onClose={() => setSelectedItem(null)}
          title={
            selectedItem.kind === 'url'
              ? 'URL Inspection Record'
              : `${selectedItem.data.type.toUpperCase()} Phishing Analysis`
          }
          maxWidth="2xl"
        >
          <div className="space-y-5 text-sm">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <RiskBadge
                level={selectedItem.data.riskLevel}
                score={selectedItem.data.riskScore}
                showScore
                size="md"
              />
              <span className="text-xs text-slate-400 font-mono">
                {new Date(selectedItem.data.timestamp).toLocaleString()}
              </span>
            </div>

            {selectedItem.kind === 'url' ? (
              /* URL Details */
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Inspected URL:
                  </h4>
                  <div className="p-2.5 rounded-lg bg-slate-100 font-mono text-xs break-all text-slate-800">
                    {selectedItem.data.url}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Verdict:
                  </h4>
                  <p className="text-slate-800 font-medium">{selectedItem.data.verdict}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Triggered Heuristics:
                  </h4>
                  <div className="space-y-2">
                    {selectedItem.data.indicators
                      .filter(i => i.triggered)
                      .map((ind, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                        >
                          <div className="font-semibold text-slate-900">{ind.name}</div>
                          <div className="text-slate-600 mt-0.5">{ind.details}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Message Analysis Details */
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Executive Summary:
                  </h4>
                  <p className="text-slate-800 font-medium">{selectedItem.data.summary}</p>
                </div>

                {selectedItem.data.fullContent && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Analyzed Content:
                    </h4>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs whitespace-pre-line text-slate-700 max-h-48 overflow-y-auto">
                      {selectedItem.data.fullContent}
                    </div>
                  </div>
                )}

                {selectedItem.data.redFlags.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Red Flags ({selectedItem.data.redFlags.length}):
                    </h4>
                    <div className="space-y-2">
                      {selectedItem.data.redFlags.map((flag, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1"
                        >
                          <div className="flex justify-between font-bold text-slate-800">
                            <span>{flag.category}</span>
                            <span className="uppercase text-[10px] text-red-600">
                              {flag.severity}
                            </span>
                          </div>
                          <p className="text-slate-600">{flag.finding}</p>
                          {flag.quote && (
                            <div className="bg-white p-2 rounded border border-slate-200 font-mono italic">
                              &ldquo;{flag.quote}&rdquo;
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Recommended Safe Actions:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                    {selectedItem.data.safeActions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => handleDeleteItem(selectedItem)}
                className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
              >
                <Trash2 size={13} />
                Delete this record
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        title="Confirm Clear All History"
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
            Are you sure you want to proceed with clearing all records? You can export your history as a JSON backup first if desired.
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
