import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serialize } from '@/lib/serialize';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const item = await prisma.items.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(serialize(item));
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();
  const updated = await prisma.items.update({ where: { id }, data: body });
  return NextResponse.json(serialize(updated));
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.items.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
