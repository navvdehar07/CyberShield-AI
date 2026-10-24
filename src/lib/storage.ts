import { AnalysisResult, URLCheckResult, QuizProgress } from './types';

const STORAGE_KEYS = {
  ANALYSIS_HISTORY: 'cybershield_analysis_history',
  URL_HISTORY: 'cybershield_url_history',
  QUIZ_PROGRESS: 'cybershield_quiz_progress',
};

// Custom event to sync across tabs and components
export const STORAGE_CHANGE_EVENT = 'cybershield_storage_changed';

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(STORAGE_CHANGE_EVENT));
  }
}

// ----------------- Message Analyses -----------------

export function getStoredAnalyses(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load analysis history from localStorage', e);
    return [];
  }
}

export function saveAnalysis(analysis: AnalysisResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredAnalyses();
    // Prepend new analysis
    const updated = [analysis, ...existing.filter(item => item.id !== analysis.id)];
    localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(updated));
    emitChange();
  } catch (e) {
    console.error('Failed to save analysis', e);
  }
}

export function deleteAnalysis(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredAnalyses();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(updated));
    emitChange();
  } catch (e) {
    console.error('Failed to delete analysis', e);
  }
}

// ----------------- URL Check History -----------------

export function getStoredUrlChecks(): URLCheckResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.URL_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load url check history', e);
    return [];
  }
}

export function saveUrlCheck(result: URLCheckResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredUrlChecks();
    const updated = [result, ...existing.filter(item => item.id !== result.id)];
    localStorage.setItem(STORAGE_KEYS.URL_HISTORY, JSON.stringify(updated));
    emitChange();
  } catch (e) {
    console.error('Failed to save url check', e);
  }
}

export function deleteUrlCheck(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredUrlChecks();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.URL_HISTORY, JSON.stringify(updated));
    emitChange();
  } catch (e) {
    console.error('Failed to delete url check', e);
  }
}

// ----------------- All History Combined Clear -----------------

export function clearAllHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.ANALYSIS_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.URL_HISTORY);
    emitChange();
  } catch (e) {
    console.error('Failed to clear history', e);
  }
}

// ----------------- Quiz Progress -----------------

export function getStoredQuizProgress(): QuizProgress {
  if (typeof window === 'undefined') {
    return {
      completed: false,
      score: 0,
      totalQuestions: 10,
      answers: {},
    };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_PROGRESS);
    if (!raw) {
      return {
        completed: false,
        score: 0,
        totalQuestions: 10,
        answers: {},
      };
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get quiz progress', e);
    return {
      completed: false,
      score: 0,
      totalQuestions: 10,
      answers: {},
    };
  }
}

export function saveQuizProgress(progress: QuizProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.QUIZ_PROGRESS, JSON.stringify(progress));
    emitChange();
  } catch (e) {
    console.error('Failed to save quiz progress', e);
  }
}

export function resetQuizProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.QUIZ_PROGRESS);
    emitChange();
  } catch (e) {
    console.error('Failed to reset quiz progress', e);
  }
}

// ----------------- Aggregated Statistics for Dashboard -----------------

export interface DashboardStats {
  totalScanned: number;
  messageScans: number;
  urlScans: number;
  highRiskCount: number;
  mediumRiskCount: number;
  safeCount: number;
  quizCompleted: boolean;
  quizScore: number;
  quizTotal: number;
  recentItems: Array<{
    id: string;
    type: 'email' | 'sms' | 'url';
    title: string;
    riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    timestamp: number;
  }>;
}

export function getDashboardStats(): DashboardStats {
  const analyses = getStoredAnalyses();
  const urlChecks = getStoredUrlChecks();
  const quiz = getStoredQuizProgress();

  let highRiskCount = 0;
  let mediumRiskCount = 0;
  let safeCount = 0;

  analyses.forEach(a => {
    if (a.riskLevel === 'high' || a.riskLevel === 'critical') highRiskCount++;
    else if (a.riskLevel === 'medium') mediumRiskCount++;
    else safeCount++;
  });

  urlChecks.forEach(u => {
    if (u.riskLevel === 'high' || u.riskLevel === 'critical') highRiskCount++;
    else if (u.riskLevel === 'medium') mediumRiskCount++;
    else safeCount++;
  });

  const recentList = [
    ...analyses.map(a => ({
      id: a.id,
      type: a.type,
      title: a.summary || (a.contentPreview.substring(0, 50) + '...'),
      riskLevel: a.riskLevel,
      riskScore: a.riskScore,
      timestamp: a.timestamp,
    })),
    ...urlChecks.map(u => ({
      id: u.id,
      type: 'url' as const,
      title: u.hostname + (u.pathname && u.pathname !== '/' ? u.pathname : ''),
      riskLevel: u.riskLevel,
      riskScore: u.riskScore,
      timestamp: u.timestamp,
    }))
  ].sort((a, b) => b.timestamp - a.timestamp);

  return {
    totalScanned: analyses.length + urlChecks.length,
    messageScans: analyses.length,
    urlScans: urlChecks.length,
    highRiskCount,
    mediumRiskCount,
    safeCount,
    quizCompleted: quiz.completed,
    quizScore: quiz.score,
    quizTotal: quiz.totalQuestions || 10,
    recentItems: recentList.slice(0, 5),
  };
}
