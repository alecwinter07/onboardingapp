import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/verifyToken';

// This single n8n webhook is expected to:
// 1. Write the section's answers into the appropriate Airtable table
// 2. Internally advance questionnaire_progress / GHL stage (same logic as
//    the existing "Questionnaire-Progress" workflow)
const N8N_WEBHOOK_URL =
  process.env.N8N_QUESTIONNAIRE_WEBHOOK_URL ||
  'https://n8n.level.us/webhook/questionnaire-section-submit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, section, data } = body;

    if (!token || !section) {
      return NextResponse.json({ error: 'Missing token or section' }, { status: 400 });
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.error }, { status: 401 });
    }

    const { clientId, email, opportunityId } = verification.payload!;

    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        email,
        opportunity_id: opportunityId || '',
        section_completed: section, // "Q1" | "Q2" | "Q3" | "Q4" | "Q6"
        section_data: data,
      }),
    });

    if (!n8nResponse.ok) {
      const text = await n8nResponse.text();
      return NextResponse.json({ error: 'n8n webhook failed', detail: text }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Submit failed' }, { status: 500 });
  }
}