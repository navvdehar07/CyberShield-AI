'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Award,
  Sparkles,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';
import { getStoredQuizProgress, saveQuizProgress, resetQuizProgress } from '@/lib/storage';
import { QuizProgress } from '@/lib/types';

export default function QuizPage() {
  const [progress, setProgress] = useState<QuizProgress>({
    completed: false,
    score: 0,
    totalQuestions: QUIZ_QUESTIONS.length,
    answers: {},
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = getStoredQuizProgress();
    setProgress(stored);
    // If not completed, jump to first unanswered question
    if (!stored.completed) {
      const answeredKeys = Object.keys(stored.answers).map(Number);
      const nextIdx = QUIZ_QUESTIONS.findIndex(q => !answeredKeys.includes(q.id));
      if (nextIdx !== -1) {
        setCurrentIndex(nextIdx);
      }
    }
  }, []);

  if (!mounted) {
    return <div className="p-8 text-center text-slate-400">Loading quiz data...</div>;
  }

  const currentQ = QUIZ_QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUIZ_QUESTIONS.length - 1;

  const handleSelectOption = (optionId: string) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);

    const isCorrect = currentQ.options.find(o => o.id === optionId)?.isCorrect || false;
    const newAnswers = { ...progress.answers, [currentQ.id]: optionId };
    const newScore = progress.score + (isCorrect ? 1 : 0);
    const isCompleted = Object.keys(newAnswers).length === QUIZ_QUESTIONS.length;

    const updatedProgress: QuizProgress = {
      completed: isCompleted,
      score: newScore,
      totalQuestions: QUIZ_QUESTIONS.length,
      answers: newAnswers,
      completedAt: isCompleted ? Date.now() : undefined,
    };

    setProgress(updatedProgress);
    saveQuizProgress(updatedProgress);
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
    }
  };

  const handleRetake = () => {
    resetQuizProgress();
    setProgress({
      completed: false,
      score: 0,
      totalQuestions: QUIZ_QUESTIONS.length,
      answers: {},
    });
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
  };

  const scorePercent = Math.round((progress.score / QUIZ_QUESTIONS.length) * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <GraduationCap size={14} />
            Phishing Readiness Assessment
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Interactive Phishing Simulator
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            10 true-to-life attack scenarios testing recognition of Business Email Compromise, Quishing, Smishing, and Spoofing.
          </p>
        </div>

        <button
          onClick={handleRetake}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
        >
          <RotateCcw size={13} />
          Reset Quiz
        </button>
      </div>

      {/* Completion View */}
      {progress.completed ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mx-auto shadow-sm">
              <Award size={32} />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Quiz Completed!
            </h3>
            <p className="text-sm text-slate-600">
              You scored <span className="font-bold text-slate-900">{progress.score} out of {progress.totalQuestions}</span> ({scorePercent}%).
            </p>

            <div className="py-2">
              {scorePercent >= 90 ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold">
                  <ShieldCheck size={16} /> Cyber Defense Master
                </div>
              ) : scorePercent >= 70 ? (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-bold">
                  <ShieldCheck size={16} /> Vigilant Security Scout
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-bold">
                  <AlertTriangle size={16} /> Needs Refresher Training
                </div>
              )}
            </div>
          </div>

          {/* Results Review Breakdown */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Scenario Review Breakdown:
            </h4>
            <div className="space-y-3">
              {QUIZ_QUESTIONS.map(q => {
                const userChoiceId = progress.answers[q.id];
                const chosenOption = q.options.find(o => o.id === userChoiceId);
                const isCorrect = chosenOption?.isCorrect ?? false;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/40 border-red-200'
                    } flex items-start gap-3`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      ) : (
                        <XCircle size={18} className="text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-xs sm:text-sm">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-bold text-slate-800">
                          {q.id}. {q.title}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 uppercase">
                          {q.category}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs mb-1.5">
                        <strong className="text-slate-700">Your Answer:</strong> {chosenOption?.text || 'Not answered'}
                      </p>
                      <p className="text-slate-600 text-xs">
                        <strong className="text-slate-700">Key takeaway:</strong> {q.safeAction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button
              onClick={handleRetake}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
            >
              Retake All Questions
            </button>
          </div>
        </div>
      ) : (
        /* Active Question View */
        <div className="space-y-6">
          {/* Progress Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>Score: {progress.score}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Scenario Presentation Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {currentQ.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Scenario #{currentQ.id}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {currentQ.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentQ.scenario}
              </p>
            </div>

            {/* Simulated Inbox / SMS Preview Box */}
            <div className="rounded-xl border border-slate-300/80 bg-slate-900 text-slate-100 p-4 font-mono text-xs space-y-2 shadow-inner">
              {currentQ.sender && (
                <div className="text-slate-400 pb-1 border-b border-slate-800">
                  <span className="text-slate-500">From: </span>
                  <span className="text-slate-200">{currentQ.sender}</span>
                </div>
              )}
              {currentQ.subject && (
                <div className="text-slate-400 pb-1 border-b border-slate-800">
                  <span className="text-slate-500">Subject: </span>
                  <span className="text-amber-300 font-semibold">{currentQ.subject}</span>
                </div>
              )}
              <div className="pt-1 whitespace-pre-line text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
                {currentQ.messageBody}
              </div>
            </div>

            {/* Question Prompt */}
            <div className="pt-2">
              <h4 className="text-sm font-bold text-slate-800 mb-3">
                What is the safest, most appropriate response?
              </h4>

              <div className="space-y-2.5">
                {currentQ.options.map(option => {
                  let optionStyles = 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/30 text-slate-700';

                  if (isAnswered) {
                    if (option.isCorrect) {
                      optionStyles = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium';
                    } else if (option.id === selectedOptionId) {
                      optionStyles = 'border-red-400 bg-red-50/70 text-red-950';
                    } else {
                      optionStyles = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option.id)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-start gap-3 ${optionStyles}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0 mt-0.5">
                        {option.id.slice(-1).toUpperCase()}
                      </span>
                      <span className="flex-1 leading-relaxed">{option.text}</span>
                      {isAnswered && option.isCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && !option.isCorrect && option.id === selectedOptionId && (
                        <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Feedback & Educational Breakdown */}
            {isAnswered && (
              <div className="mt-6 pt-5 border-t border-slate-200 space-y-4 animate-in fade-in duration-300">
                <div
                  className={`p-4 rounded-xl border text-xs sm:text-sm ${
                    currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-red-50 border-red-200 text-red-950'
                  }`}
                >
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {currentQ.options.find(o => o.id === selectedOptionId)?.isCorrect ? (
                      <>
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        Correct Analysis!
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="text-red-600" />
                        Vulnerability Detected
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed">{currentQ.explanation}</p>
                </div>

                {/* Red Flags Identified */}
                {currentQ.redFlags.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm space-y-2">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-xs flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-red-600" />
                      Key Indicators in this Scenario:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                      {currentQ.redFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-md shadow-blue-600/20"
                  >
                    {isLastQuestion ? 'View Final Results' : 'Next Question'}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
