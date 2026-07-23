import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/verifyToken';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 400 });
  }
  const result = verifyToken(token);
  if (!result.valid) {
    return NextResponse.json({ valid: false, error: result.error }, { status: 401 });
  }
  return NextResponse.json({ valid: true, payload: result.payload });
}
