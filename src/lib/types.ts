export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export interface RedFlag {
  category: string;
  finding: string;
  quote?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AnalysisResult {
  id: string;
  type: 'email' | 'sms' | 'url';
  contentPreview: string;
  fullContent?: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100
  summary: string;
  senderAnalysis?: {
    claimedSender?: string;
    isSuspicious: boolean;
    analysis: string;
  };
  urgencyLevel: 'none' | 'low' | 'medium' | 'high';
  redFlags: RedFlag[];
  safeActions: string[];
  explanation: string;
  timestamp: number;
}

export interface URLHeuristicIndicator {
  name: string;
  description: string;
  triggered: boolean;
  severity: 'info' | 'warning' | 'danger';
  details?: string;
}

export interface URLCheckResult {
  id: string;
  url: string;
  protocol: string;
  hostname: string;
  pathname: string;
  searchParams: Record<string, string>;
  riskLevel: RiskLevel;
  riskScore: number;
  verdict: string;
  indicators: URLHeuristicIndicator[];
  aiAnalysis?: {
    summary: string;
    targetedBrand?: string;
    attackVector?: string;
    recommendation: string;
  };
  timestamp: number;
}

export interface QuizQuestion {
  id: number;
  title: string;
  category: string;
  scenario: string;
  sender?: string;
  subject?: string;
  messageBody: string;
  isPhishing: boolean;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  redFlags: string[];
  safeAction: string;
}

export interface QuizProgress {
  completed: boolean;
  score: number;
  totalQuestions: number;
  answers: Record<number, string>; // questionId -> selectedOptionId
  completedAt?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  sources?: string[];
}
