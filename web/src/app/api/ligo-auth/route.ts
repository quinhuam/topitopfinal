import { NextResponse } from 'next/server';
import { exec, type ExecException } from 'child_process';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const envUrlLogin = process.env.LIGO_URL_LOGIN || 'https://cce-auth-dev.ligocloud.tech';
    const envUsername = process.env.LIGO_USERNAME || 'ligopay-demo';
    const envPassword = process.env.LIGO_PASSWORD || 'Adm1ni23';
    const envCompanyId = process.env.LIGO_COMPANY_ID || 'e8b4a36d-6f1d-4a2a-bf3a-ce9371dde4ab';
    let { token, companyId = envCompanyId, urlLogin = envUrlLogin, username = envUsername, password = envPassword, issuer = 'ligo', audience = 'ligo-calidad.com', subject = 'ligo@gmail.com' } = body || {};

    // Auto-generate ephemeral token if not provided
    if (!token) {
      const cwd = path.join(process.cwd(), 'src', 'lib', 'generate-token');
      const command = `npm run generate-token issuer=${issuer} audience=${audience} subject=${subject} companyId=${companyId}`;
      const shellPath = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
      token = await new Promise<string>((resolve, reject) => {
        exec(
          command,
          { cwd, shell: shellPath, maxBuffer: 1024 * 1024 },
          (error: ExecException | null, stdout: string, stderr: string) => {
            if (error) return reject(new Error(stderr || error.message || 'Failed to exec token script'));
            const lines = String(stdout).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
            const last = lines[lines.length - 1] || '';
            if (!last) return reject(new Error('No token generated'));
            resolve(last);
          }
        );
      });
    }

    const url = `${urlLogin}/v1/auth/sign-in?companyId=${encodeURIComponent(companyId)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), Number(process.env.LIGO_TIMEOUT_MS || 15000));
    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch (e: any) {
      clearTimeout(timeout);
      return NextResponse.json({ ok: false, error: e?.message || 'fetch failed', detail: e?.cause || null }, { status: 502 });
    }
    clearTimeout(timeout);
    let json: any = null;
    try {
      json = await res.json();
    } catch {
      const text = await res.text().catch(() => '');
      if (!res.ok) return NextResponse.json({ ok: false, error: 'Auth failed', raw: text }, { status: res.status });
      return NextResponse.json({ ok: false, error: 'Unexpected response', raw: text }, { status: 500 });
    }
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: json?.message || 'Auth failed', raw: json }, { status: res.status });
    }

    const access_token = json?.data?.access_token;
    if (!access_token) {
      return NextResponse.json({ ok: false, error: 'No access_token in response', raw: json }, { status: 500 });
    }

    return NextResponse.json({ ok: true, access_token, raw: json });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to exchange token' }, { status: 500 });
  }
}
