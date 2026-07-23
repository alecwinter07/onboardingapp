import crypto from 'crypto';

// Matches the signing logic from n8n workflow 04 (Generate-Questionnaire-Link):
// payload = base64url(JSON.stringify({ clientId, email, exp }))
// signature = HMAC-SHA256(payload, secret) -> base64url
// token = `${payload}.${signature}`

const SECRET = process.env.QUESTIONNAIRE_JWT_SECRET || 'lm-jwt-secret-2025';

export interface TokenPayload {
  clientId: string;
  email: string;
  opportunityId?: string;
  exp: number;
}

export function verifyToken(token: string): { valid: boolean; payload?: TokenPayload; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'Malformed token' };
    }
    const [payloadB64, signature] = parts;

    const expectedSig = crypto
      .createHmac('sha256', SECRET)
      .update(payloadB64)
      .digest('base64url');

    if (expectedSig !== signature) {
      return { valid: false, error: 'Invalid signature' };
    }

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: TokenPayload = JSON.parse(payloadJson);

    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, payload };
  } catch (e) {
    return { valid: false, error: 'Token verification failed' };
  }
}

