import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Info } from 'lucide-react';

interface ApiKeyAlertProps {
  featureName?: string;
}

export const ApiKeyAlert: React.FC<ApiKeyAlertProps> = ({ featureName = 'AI Analysis' }) => {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-4 sm:p-5 text-blue-900 shadow-xs">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-700 shrink-0 mt-0.5">
          <Info size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-blue-950 mb-1">
            {featureName} Service Standby
          </h3>
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed mb-3">
            The AI engine is currently in standby mode. You can continue using our full suite of local security tools, including the deterministic Heuristic URL Inspector and the interactive Phishing Simulator Quiz.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/url-checker"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition shadow-xs"
            >
              Try Heuristic URL Checker
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-800 hover:text-blue-950 bg-white border border-blue-200 rounded-lg transition"
            >
              Practice with Phishing Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
