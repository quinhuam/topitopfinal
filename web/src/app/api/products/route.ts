import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serialize } from '@/lib/serialize';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const q = (searchParams.get('q') || '').trim();
  const by = (searchParams.get('by') || '').trim(); // 'code' | 'description'
  const skip = Math.max(0, (page - 1) * pageSize);
  const take = Math.max(1, pageSize);
  const where: any = {};
  if (q) {
    if (by === 'code') {
      const num = Number(q);
      if (!Number.isNaN(num)) where.id = num;
      else where.name = { contains: q, mode: 'insensitive' };
    } else {
      where.name = { contains: q, mode: 'insensitive' };
    }
  }
  const [data, total] = await Promise.all([
    prisma.products.findMany({ where, skip, take, orderBy: { id: 'desc' } }),
    prisma.products.count({ where }),
  ]);
  return NextResponse.json(serialize({ data, page, pageSize, total }));
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await prisma.products.create({ data: body });
  return NextResponse.json(serialize(created), { status: 201 });
}
