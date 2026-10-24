# CyberShield AI — Phishing Awareness Assistant

**CyberShield AI** is an enterprise-grade, comprehensive cybersecurity web application designed to protect users against modern phishing, Business Email Compromise (BEC), smishing, credential harvesting, quishing (QR code fraud), and social engineering tactics.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and the official **Google Gen AI SDK (`@google/genai`)**, featuring secure server-side API processing and client-side zero-leak local persistence.

---

## 🛡️ Key Features

### 1. Operations Dashboard
- Real-time telemetry: total scans, high-severity threat alerts, verified benign messages, and phishing quiz progress.
- Clean zero-state display with authentic live values calculated strictly from the user's actual local activity.
- Quick navigation shortcuts and recent inspection logs.

### 2. AI Message & Phishing Analyzer
- In-depth inspection of pasted **Email** and **SMS / Text** messages.
- Powered server-side by Google Gemini via `@google/genai` (never exposes credentials to frontend code).
- Evaluates sender spoofing, artificial urgency triggers, and social engineering manipulation.
- Delivers itemized red flags with quoted evidence, risk scoring (0–100), executive summaries, and safe next-step checklists.

### 3. Heuristic URL & Domain Inspector
- **100% Client-Side Safe Engine:** Zero outbound HTTP connections to target servers; never automatically opens links.
- Evaluates 12+ deterministic security indicators:
  - Unencrypted HTTP protocol detection
  - Raw IPv4 / IPv6 host detection
  - High-risk abused TLDs (`.tk`, `.xyz`, `.top`, `.work`, `.click`, `.zip`, etc.)
  - Brand spoofing & deceptive subdomain nesting (e.g. `paypal.com.verify-account.tk`)
  - Userinfo authentication deception (`@` symbol routing)
  - IDN / Punycode homoglyph character exploitation
  - URL shortener domain masking (`bit.ly`, `tinyurl.com`, `t.co`, etc.)
  - Non-standard web ports (`:8080`, `:8888`, `:2082`)
  - Disguised double executable extensions (`.pdf.exe`, `.invoice.zip`)

### 4. Interactive Phishing Training Quiz
- 10 original, highly realistic scenarios covering spear phishing, executive wire fraud, fake shipping fees, HR payroll manipulation, parking meter quishing, and legitimate discriminators.
- Interactive question feedback with instant educational breakdowns, identified red flags, and key defensive takeaways.
- Real score calculations and persistent completion tracking in `localStorage`.

### 5. AI Cybersecurity Advisor Chatbot
- Conversational cybersecurity assistant powered by Gemini (`@google/genai`).
- Provides real-time advice on suspicious communications, incident containment, MFA fatigue, and reporting.
- Strict safety guardrails prevent generation of malicious payloads or phishing lures.

### 6. Local Inspection & Analysis History
- Full audit log of analyzed messages and inspected URLs stored strictly in your browser.
- Search by keyword or domain, filter by type (Email, SMS, URL) and risk tier (High, Medium, Safe).
- Detailed modal viewer, single-entry deletion, JSON export, and full history reset with confirmation.

### 7. Settings, Knowledge Base & Incident Guidelines
- Defense and inspection engine overview.
- Privacy and local storage management (export JSON backup, clear local history).
- Quick-access **Emergency Incident Response Guide** modal ("Clicked a Phishing Link?").
- Phishing indicators cheat sheet and platform limitations disclaimer.

---

## 🛡️ Service Architecture & Fallback Behavior

| Feature | Operational Mode | Fallback / Standby Behavior |
| :--- | :---: | :---: |
| **Heuristic URL Inspector** |  **Always Available** (100% client-side) | Fully functional deterministic parsing |
| **Phishing Simulator Quiz** |  **Always Available** (100% client-side) | 10 interactive scenarios with persistent progress |
| **Local Analysis History** |  **Always Available** (100% client-side) | Local search, filters, JSON export, and management |
| **Security Dashboard** |  **Always Available** (100% client-side) | Real telemetry calculated from local data |
| **Emergency Help & Docs** |  **Always Available** | Instant incident containment guide |
| **AI Message Analyzer** |  **Active** (when configured) | Graceful standby message with heuristic fallback |
| **AI Security Chatbot** |  **Active** (when configured) | Graceful standby notice |

---

## 🚀 Quickstart & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variable (Optional for AI features)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your key from [Google AI Studio](https://aistudio.google.com/apikey):
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 4. Production Build & Start
```bash
npm run build
npm start
```

---

## 🔒 Security & Privacy Principles
- **Zero API Key Leakage:** The Gemini API key is accessed exclusively in server-side Next.js route handlers (`src/app/api/`) and is never sent to or visible in client-side code.
- **Client-Side Data Persistence:** All analysis logs, quiz progress, and telemetry stay strictly in the user's browser `localStorage`.
- **No Automatic Link Traversal:** URL checks perform structural and heuristic string analysis only; no external network requests are made to unknown or potentially malicious hosts.
