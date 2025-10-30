import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serialize } from '@/lib/serialize';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = BigInt(idParam);
  const item = await prisma.order_items.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(serialize(item));
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = BigInt(idParam);
  const body = await req.json();
  const updated = await prisma.order_items.update({ where: { id }, data: body });
  return NextResponse.json(serialize(updated));
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await context.params;
  const id = BigInt(idParam);
  await prisma.order_items.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
