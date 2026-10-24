import type { Metadata } from 'next';
import './globals.css';
import { AppLayoutShell } from '@/components/AppLayoutShell';

export const metadata: Metadata = {
  title: 'CyberShield AI — Phishing Awareness Assistant',
  description:
    'Complete cybersecurity awareness dashboard, AI-powered message analyzer, heuristic URL inspector, and interactive phishing training quiz.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppLayoutShell>{children}</AppLayoutShell>
      </body>
    </html>
  );
}
