import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serialize } from '@/lib/serialize';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const skip = Math.max(0, (page - 1) * pageSize);
  const take = Math.max(1, pageSize);
  const [data, total] = await Promise.all([
    prisma.tallas.findMany({ skip, take, orderBy: { talla: 'asc' } }),
    prisma.tallas.count(),
  ]);
  return NextResponse.json(serialize({ data, page, pageSize, total }));
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await prisma.tallas.create({ data: body });
  return NextResponse.json(serialize(created), { status: 201 });
}
