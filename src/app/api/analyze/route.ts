import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, isGeminiConfigured, RECOMMENDED_GEMINI_MODEL } from '@/lib/gemini';
import { AnalysisResult, RiskLevel } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          error: 'AI_UNAVAILABLE',
          message:
            'AI message analysis is currently in standby mode. You can still use the Heuristic URL Inspector and Phishing Quiz without restriction.',
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { content, type } = body;

    if (!content || typeof content !== 'string' || content.trim().length < 5) {
      return NextResponse.json(
        {
          error: 'INVALID_INPUT',
          message: 'Please provide the text of the email or SMS message to analyze (at least 5 characters).',
        },
        { status: 400 }
      );
    }

    const messageType = type === 'sms' ? 'SMS / Text Message' : 'Email Message';
    const ai = getGeminiClient();

    const systemInstruction = `You are CyberShield AI, an elite cybersecurity and anti-phishing expert analyst.
Your task is to critically inspect incoming emails, SMS messages, and communications for signs of phishing, social engineering, credential harvesting, business email compromise (BEC), quishing, or malware distribution.

Guidelines:
1. Be objective, thorough, and precise.
2. Quote exact evidence from the provided text when identifying red flags.
3. If the message appears legitimate (e.g. standard receipt, internal newsletter without spoofing, routine notification), rate it 'safe' or 'low' with an accurate explanation. Do not falsely flag normal emails as high risk without genuine evidence.
4. If it has indicators of phishing, classify the severity accurately (low, medium, high, critical) and calculate a riskScore between 0 and 100.
5. Provide actionable, safe next steps (e.g., how to verify independently, what NOT to click, how to report).
6. Always return valid JSON matching the requested structure.`;

    const prompt = `Analyze this ${messageType} for phishing and cybersecurity threats:

---
${content}
---

Respond ONLY with a JSON object in this format:
{
  "riskLevel": "safe" | "low" | "medium" | "high" | "critical",
  "riskScore": number (0 to 100, where 0 is completely benign and 100 is confirmed severe phishing/malware),
  "summary": "1 to 2 sentence executive verdict",
  "urgencyLevel": "none" | "low" | "medium" | "high",
  "senderAnalysis": {
    "claimedSender": "Name or entity claimed by message, or 'Not specified'",
    "isSuspicious": boolean,
    "analysis": "Evaluation of sender legitimacy, spoofing cues, or domain mismatches"
  },
  "redFlags": [
    {
      "category": "e.g. Artificial Urgency / Brand Impersonation / Credential Harvesting / Generic Salutation / Suspicious Call-to-Action",
      "finding": "Specific explanation of this anomaly",
      "quote": "Exact quoted text from message demonstrating this flag",
      "severity": "low" | "medium" | "high"
    }
  ],
  "safeActions": [
    "Specific recommended action for the recipient",
    "e.g. Do not click links; verify at official website directly"
  ],
  "explanation": "2-3 paragraphs of detailed cybersecurity insight explaining the attacker's methodology or why the message is benign, and practical education for the user."
}`;

    let responseText: string | undefined;

    // Try recommended model, with fallback models if needed
    const modelsToTry = [RECOMMENDED_GEMINI_MODEL, 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError: unknown;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });
        responseText = response.text;
        if (responseText) break;
      } catch (err) {
        lastError = err;
        console.warn(`Failed with model ${model}, trying next if available...`, err);
      }
    }

    if (!responseText) {
      throw lastError || new Error('No response received from Gemini AI');
    }

    // Clean up potential markdown ticks if returned
    const cleaned = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    const validRiskLevels: RiskLevel[] = ['safe', 'low', 'medium', 'high', 'critical'];
    const riskLevel: RiskLevel = validRiskLevels.includes(parsed.riskLevel?.toLowerCase())
      ? (parsed.riskLevel.toLowerCase() as RiskLevel)
      : 'medium';

    const riskScore = typeof parsed.riskScore === 'number'
      ? Math.min(100, Math.max(0, parsed.riskScore))
      : riskLevel === 'critical' ? 90 : riskLevel === 'high' ? 75 : riskLevel === 'medium' ? 50 : 15;

    const result: AnalysisResult = {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type: type === 'sms' ? 'sms' : 'email',
      contentPreview: content.length > 120 ? content.substring(0, 120) + '...' : content,
      fullContent: content,
      riskLevel,
      riskScore,
      summary: parsed.summary || 'Analysis completed.',
      senderAnalysis: parsed.senderAnalysis,
      urgencyLevel: parsed.urgencyLevel || 'none',
      redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : [],
      safeActions: Array.isArray(parsed.safeActions) ? parsed.safeActions : ['Never share passwords or sensitive information over email or SMS.'],
      explanation: parsed.explanation || 'No detailed explanation provided.',
      timestamp: Date.now(),
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Error during AI analysis:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during analysis';
    return NextResponse.json(
      {
        error: 'ANALYSIS_FAILED',
        message: `Failed to analyze message: ${errorMessage}. Please check your API key and connection.`,
      },
      { status: 500 }
    );
  }
}
