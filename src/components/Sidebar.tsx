'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MailSearch,
  Link2,
  GraduationCap,
  MessageSquareCode,
  History,
  Settings,
  Shield,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'AI Message Analyzer',
      href: '/analyzer',
      icon: MailSearch,
      badge: 'AI',
    },
    {
      label: 'URL Checker',
      href: '/url-checker',
      icon: Link2,
      badge: 'Local',
    },
    {
      label: 'Phishing Quiz',
      href: '/quiz',
      icon: GraduationCap,
      badge: null,
    },
    {
      label: 'AI Chatbot',
      href: '/chat',
      icon: MessageSquareCode,
      badge: 'AI',
    },
    {
      label: 'Analysis History',
      href: '/history',
      icon: History,
      badge: null,
    },
    {
      label: 'Help & Settings',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-navy-900 text-white flex flex-col border-r border-navy-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-navy-800">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyber-blue flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">
                CyberShield <span className="text-blue-400">AI</span>
              </span>
              <span className="text-[11px] font-medium text-navy-300 block uppercase tracking-wider">
                Phishing Defense
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-navy-400 hover:text-white hover:bg-navy-800 transition"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-navy-400 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'text-navy-200 hover:bg-navy-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon
                    size={18}
                    className={`shrink-0 ${
                      isActive ? 'text-white' : 'text-navy-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-blue-700/80 text-white'
                        : item.badge === 'AI'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                        : 'bg-navy-800 text-navy-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Protection Status at bottom */}
        <div className="p-4 border-t border-navy-800 bg-navy-950/40">
          <Link
            href="/settings"
            onClick={() => setMobileOpen(false)}
            className="block p-3 rounded-xl bg-navy-800/60 hover:bg-navy-800 border border-navy-700/50 transition group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <Shield size={14} className="text-blue-400" />
                <span className="text-xs font-semibold text-navy-200">
                  Protection Status
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <CheckCircle2 size={12} />
                Active
              </span>
            </div>
            <p className="text-[11px] text-navy-400 line-clamp-1">
              Heuristic defense & detection ready
            </p>
          </Link>
        </div>
      </aside>
    </>
  );
};
