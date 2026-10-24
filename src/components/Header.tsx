'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, AlertTriangle, ShieldCheck, LifeBuoy, ExternalLink, Check, ChevronRight } from 'lucide-react';
import { Modal } from './Modal';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Security Operations Dashboard',
    subtitle: 'Real-time telemetry, threat distribution, and phishing defense readiness',
  },
  '/analyzer': {
    title: 'AI Message & Phishing Analyzer',
    subtitle: 'Inspect suspicious emails and SMS messages for deception and social engineering',
  },
  '/url-checker': {
    title: 'Heuristic URL & Domain Inspector',
    subtitle: 'Deterministic local parsing for homoglyphs, IP hosts, hijacked subdomains, and suspicious TLDs',
  },
  '/quiz': {
    title: 'Interactive Phishing Training Quiz',
    subtitle: 'Challenge your threat recognition against realistic spear phishing, BEC, and quishing scenarios',
  },
  '/chat': {
    title: 'CyberShield AI Advisor',
    subtitle: 'Conversational cybersecurity guidance powered by Gemini',
  },
  '/history': {
    title: 'Inspection & Analysis History',
    subtitle: 'Local audit trail of your scanned messages and checked URLs',
  },
  '/settings': {
    title: 'Settings & Security Reference',
    subtitle: 'Protection overview, privacy preferences, phishing indicator cheat sheet, and limitations',
  },
};

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const pathname = usePathname();
  const pageInfo = PAGE_TITLES[pathname] || {
    title: 'CyberShield AI',
    subtitle: 'Phishing Awareness and Threat Analysis',
  };

  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between transition-colors shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-500 mb-0.5">
              <span>CyberShield</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="text-blue-600 font-semibold">{pageInfo.title.split(' ')[0]}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              {pageInfo.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Quick Emergency Protocol Button */}
          <button
            onClick={() => setEmergencyOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition shadow-xs"
          >
            <AlertTriangle size={14} className="text-red-600 animate-pulse" />
            <span className="hidden sm:inline">Clicked a Phishing Link?</span>
            <span className="sm:hidden">Emergency</span>
          </button>
        </div>
      </header>

      {/* Emergency Protocol Modal */}
      <Modal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        title="Emergency Incident Response Guide"
        maxWidth="lg"
      >
        <div className="space-y-4 text-sm text-slate-700">
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900">
            <h4 className="font-semibold text-sm flex items-center gap-1.5 mb-1 text-red-800">
              <AlertTriangle size={16} />
              Immediate Containment Checklist
            </h4>
            <p className="text-xs text-red-800/90 leading-relaxed">
              If you just opened a suspicious link, submitted credentials, or downloaded an unfamiliar attachment, execute these steps immediately in order:
            </p>
          </div>

          <ol className="space-y-3 list-decimal list-inside text-xs sm:text-sm">
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900">Disconnect from the Network:</strong> If you downloaded a file or suspect malware, immediately turn off Wi-Fi or unplug your Ethernet cable to stop command-and-control communication.
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900">Change Credentials from Another Device:</strong> If you entered a password, immediately log in from a separate clean phone or computer and reset the password on the legitimate service. Enable Authenticator MFA.
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900">Revoke Active Sessions:</strong> In your Google, Microsoft, Apple, or Banking security settings, click &ldquo;Sign out of all sessions/devices&rdquo;.
            </li>
            <li className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900">Contact IT / Financial Institution:</strong> If banking or corporate data was involved, alert your security operations center (SOC) or bank fraud hotline immediately.
            </li>
          </ol>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setEmergencyOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
            >
              I Understand / Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
