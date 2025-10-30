import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serialize } from '@/lib/serialize';

export async function GET(_req: NextRequest, context: { params: Promise<{ talla: string }> }) {
  const { talla } = await context.params;
  const item = await prisma.tallas.findUnique({ where: { talla } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(serialize(item));
}

export async function PUT(req: NextRequest, context: { params: Promise<{ talla: string }> }) {
  const { talla } = await context.params;
  const body = await req.json();
  const updated = await prisma.tallas.update({ where: { talla }, data: body });
  return NextResponse.json(serialize(updated));
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ talla: string }> }) {
  const { talla } = await context.params;
  await prisma.tallas.delete({ where: { talla } });
  return NextResponse.json({ ok: true });
}
