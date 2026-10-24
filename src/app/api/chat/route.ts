import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, isGeminiConfigured, RECOMMENDED_GEMINI_MODEL } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    if (!isGeminiConfigured()) {
      return NextResponse.json(
        {
          error: 'AI_UNAVAILABLE',
          message:
            'AI Security Assistant is currently in standby mode. Please check back shortly.',
        },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          error: 'INVALID_INPUT',
          message: 'Please provide messages array with at least one message.',
        },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are CyberShield AI — an expert, friendly cybersecurity awareness advisor specializing in phishing defense, social engineering, smishing, executive impersonation, and safe online practices.

Your core mission:
- Educate users on how to spot deceptive communications, fake login pages, quishing (QR code fraud), and business email compromise.
- Guide users through safe verification steps when they suspect an email, SMS, or phone call.
- Provide step-by-step guidance on what to do if someone accidentally clicked a link, downloaded an attachment, or entered credentials.
- Explain technical security concepts (e.g. SPF, DKIM, DMARC, Punycode, homoglyphs, MFA fatigue) in accessible, engaging terms.

STRICT SAFETY POLICY:
- Under NO circumstances generate realistic phishing templates, fraudulent lure texts, credential harvesting scripts, or social engineering pretexts to deceive real people.
- If a user asks "Write a phishing email for Netflix", explain how Netflix phishing scams work from a defensive perspective and how to spot them instead.
- Format responses cleanly with concise bullet points, bold key terms, and actionable takeaways.`;

    // Format contents for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let replyText: string | undefined;
    const modelsToTry = [RECOMMENDED_GEMINI_MODEL, 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError: unknown;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        replyText = response.text;
        if (replyText) break;
      } catch (err) {
        lastError = err;
        console.warn(`Chat failed with model ${model}, trying fallback...`, err);
      }
    }

    if (!replyText) {
      throw lastError || new Error('No response from Gemini AI');
    }

    return NextResponse.json({
      role: 'assistant',
      content: replyText,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    console.error('Error during AI chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown chat error';
    return NextResponse.json(
      {
        error: 'CHAT_FAILED',
        message: `Failed to generate response: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
