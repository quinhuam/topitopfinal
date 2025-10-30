import { NextResponse } from 'next/server';
import { buildExternalPayload } from '@/lib/external-payload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      orderNumber,
      amountCents,
      method,
      type,
      efimero,
      url = process.env.EXTERNAL_API_URL,
      apiKey = process.env.EXTERNAL_API_KEY,
      extraHeaders = {} as Record<string, string>,
    } = body || {};

    if (!orderNumber || typeof amountCents !== 'number' || !method) {
      return NextResponse.json({ ok: false, error: 'orderNumber, amountCents and method are required' }, { status: 400 });
    }
    if (!url) {
      return NextResponse.json({ ok: false, error: 'Missing EXTERNAL_API_URL' }, { status: 500 });
    }

    const payload = buildExternalPayload({ orderNumber, amountCents, method, type, efimero });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...extraHeaders,
    };
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    const json = await res.json().catch(async () => ({ text: await res.text().catch(() => '') }));
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: json?.message || 'External dispatch failed', raw: json }, { status: res.status });
    }

    return NextResponse.json({ ok: true, data: json });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Failed to dispatch external payload' }, { status: 500 });
  }
}
