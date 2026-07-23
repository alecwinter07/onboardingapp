import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/verifyToken';

// Clients never touch Drive directly. This forwards the file (as base64)
// to a new n8n workflow ("Questionnaire-File-Upload") which uses the
// already-configured Google Service Account credential to write it into
// this client's Drive folder, then returns the resulting file URL.
const N8N_UPLOAD_WEBHOOK_URL =
  process.env.N8N_UPLOAD_WEBHOOK_URL ||
  'https://n8n.level.us/webhook/questionnaire-file-upload';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;
    const fieldKey = formData.get('fieldKey') as string;
    const file = formData.get('file') as File;

    if (!token || !file) {
      return NextResponse.json({ error: 'Missing token or file' }, { status: 400 });
    }

    const verification = verifyToken(token);
    if (!verification.valid) {
      return NextResponse.json({ error: verification.error }, { status: 401 });
    }

    const { clientId } = verification.payload!;
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const n8nResponse = await fetch(N8N_UPLOAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        field_key: fieldKey,
        file_name: file.name,
        mime_type: file.type,
        file_base64: base64,
      }),
    });

    if (!n8nResponse.ok) {
      const text = await n8nResponse.text();
      return NextResponse.json({ error: 'Upload failed', detail: text }, { status: 502 });
    }

    const result = await n8nResponse.json();
    return NextResponse.json({ ok: true, url: result.file_url || result.url });
  } catch (e) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
