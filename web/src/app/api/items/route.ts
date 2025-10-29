import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serialize } from '@/lib/serialize';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');
  if (!productId) return NextResponse.json({ error: 'productId is required' }, { status: 400 });

  const items = await prisma.items.findMany({ where: { product_id: Number(productId), active: 1 } });
  if (items.length === 0) return NextResponse.json(serialize([]));

  const sizeKeys = Array.from(new Set(items.map((i: any) => i.talla).filter(Boolean) as string[]));
  const sizes = await prisma.sizes.findMany({ where: { size: { in: sizeKeys } } });
  const orderMap = new Map<string, number>(sizes.map((s: any) => [s.size as string, (s.order ?? 999) as number]));
  const nameMap = new Map<string, string>(sizes.map((s: any) => [s.size as string, (s.name ?? s.size) as string]));

  const data = items
    .map((i: any) => ({
      sku: i.sku as number,
      talla: i.talla as string | null,
      name: nameMap.get((i.talla ?? '') as string) ?? (i.talla as string | null) ?? '',
      order: orderMap.get((i.talla ?? '') as string) ?? 999,
      stock: (i.stock ?? null) as number | null,
    }))
    .sort((a: any, b: any) => a.order - b.order);

  return NextResponse.json(serialize(data));
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await prisma.items.create({ data: body });
  return NextResponse.json(serialize(created), { status: 201 });
}
