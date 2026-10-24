import { NextResponse } from 'next/server';
import { isGeminiConfigured, RECOMMENDED_GEMINI_MODEL } from '@/lib/gemini';

export async function GET() {
  const configured = isGeminiConfigured();
  return NextResponse.json({
    configured,
    model: RECOMMENDED_GEMINI_MODEL,
    message: configured 
      ? 'AI Security Engine is active and operational.' 
      : 'AI services are currently in offline standby. Local URL inspection and training quizzes remain fully operational.',
  });
}
