import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      access_token,
      prefix = process.env.LIGO_PREFIX || 'dev',
      cci = process.env.LIGO_CCI || '92100123859535942040',
      type = 'cci',
      method = type === 'qr' ? 'billetera' : 'transferencia',
      amount,
      cellphone = process.env.LIGO_CELLPHONE || '964248151',
      email = null,
      expiredAt = process.env.LIGO_EXPIRED_AT || '2025-12-31 19:55:22',
      description = '',
    } = body || {};

    if (!access_token) return NextResponse.json({ error: 'access_token is required' }, { status: 400 });
    if (typeof amount !== 'number' || !Number.isInteger(amount)) return NextResponse.json({ error: 'amount (integer cents) is required' }, { status: 400 });

    const url = `https://cce-api-gateway-${prefix}.ligocloud.tech/v1/generate-efimero-cci`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cci, type, amount, cellphone, email, expiredAt, description })
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: json?.message || 'Efimero request failed', raw: json }, { status: res.status });
    }

    try {
      await prisma.ligo_transactions.create({
        data: {
          method,
          type,
          order_number: description || null,
          description,
          amount,
          cci: json?.data?.efimeroCci || json?.data?.cci || null,
          hash_qr: json?.data?.hashQr || null,
          response: JSON.stringify(json),
          created_at: new Date(),
        }
      });
    } catch (e) {
      // no bloquear por error de log
    }

    return NextResponse.json({ ok: true, data: json?.data ?? json, raw: json });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to request efimero CCI' }, { status: 500 });
  }
}
