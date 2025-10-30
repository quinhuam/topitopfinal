import { NextResponse } from 'next/server';
import { exec, type ExecException } from 'child_process';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const issuer = body.issuer ?? 'ligo';
    const audience = body.audience ?? 'ligo-calidad.com';
    const subject = body.subject ?? 'ligo@gmail.com';
    const companyId = body.companyId ?? 'e8b4a36d-6f1d-4a2a-bf3a-ce9371dde4ab';

    const cwd = path.join(process.cwd(), 'src', 'lib', 'generate-token');

    const command = `npm run generate-token issuer=${issuer} audience=${audience} subject=${subject} companyId=${companyId}`;
    const shellPath = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
    const token: string = await new Promise((resolve, reject) => {
      exec(
        command,
        { cwd, shell: shellPath, maxBuffer: 1024 * 1024 },
        (error: ExecException | null, stdout: string, stderr: string) => {
          if (error) return reject(new Error(stderr || error.message || 'Failed to exec'));
          const lines = String(stdout).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
          const last = lines[lines.length - 1] || '';
          resolve(last);
        }
      );
    });

    if (!token) return NextResponse.json({ error: 'No token generated' }, { status: 500 });
    return NextResponse.json({ token });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to generate token' }, { status: 500 });
  }
}
