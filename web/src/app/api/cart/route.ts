import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { serialize } from '@/lib/serialize';

const CART_COOKIE = 'cartId';

async function getOrCreateCart() {
  const cookieStore = await cookies();
  const id = cookieStore.get(CART_COOKIE)?.value;

  if (id) {
    const parsed = BigInt(id);
    const cart = await prisma.carts.findUnique({ where: { id: parsed } });
    if (cart) return cart;
  }
  const created = await prisma.carts.create({ data: {} });
  // Set cookie after creation
  const res = NextResponse.json(serialize({ ok: true }));
  res.cookies.set(CART_COOKIE, created.id.toString(), { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 });
  return created;
}

export async function GET() {
  const cookieStore = await cookies();
  let id = cookieStore.get(CART_COOKIE)?.value;
  let cart;
  if (!id) {
    cart = await prisma.carts.create({ data: {} });
    id = cart.id.toString();
  } else {
    cart = await prisma.carts.findUnique({ where: { id: BigInt(id) } });
    if (!cart) {
      cart = await prisma.carts.create({ data: {} });
      id = cart.id.toString();
    }
  }

  const items = await prisma.cart_items.findMany({
    where: { cart_id: BigInt(id!) },
    include: { item: { include: { /* @ts-ignore */ product: true } }, product: true },
  });

  const cartId = id! as string;
  const res = NextResponse.json(serialize({ id: cartId, items }));
  if (!cookieStore.get(CART_COOKIE)?.value) {
    res.cookies.set(CART_COOKIE, cartId, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 });
  }
  return res;
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  let id = cookieStore.get(CART_COOKIE)?.value;
  if (!id) {
    const created = await prisma.carts.create({ data: {} });
    id = created.id.toString();
  }

  const { sku, quantity } = await req.json();
  if (!sku || !quantity || quantity < 1) {
    return NextResponse.json({ error: 'sku and quantity >= 1 are required' }, { status: 400 });
  }

  const item = await prisma.items.findUnique({ where: { sku: Number(sku) } });
  if (!item || !item.product_id) {
    return NextResponse.json({ error: 'El item (sku) no existe' }, { status: 400 });
  }

  await prisma.cart_items.upsert({
    where: {
      cart_id_sku: {
        cart_id: BigInt(id!),
        sku: Number(sku),
      },
    },
    create: {
      cart_id: BigInt(id!),
      product_id: Number(item.product_id),
      sku: Number(sku),
      quantity: Number(quantity),
      size: item.talla ?? null,
    },
    update: {
      quantity: { increment: Number(quantity) },
    },
  });

  const items = await prisma.cart_items.findMany({ where: { cart_id: BigInt(id!) }, include: { item: { include: { /* @ts-ignore */ product: true } }, product: true } });
  const cartId = id! as string;
  const res = NextResponse.json(serialize({ id: cartId, items }));
  res.cookies.set(CART_COOKIE, cartId, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30 });
  return res;
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies();
  const id = cookieStore.get(CART_COOKIE)?.value;
  if (!id) return NextResponse.json({ error: 'No cart' }, { status: 400 });

  const { sku, quantity } = await req.json();
  if (!sku || quantity == null) {
    return NextResponse.json({ error: 'sku and quantity are required' }, { status: 400 });
  }

  if (Number(quantity) <= 0) {
    await prisma.cart_items.delete({ where: { cart_id_sku: { cart_id: BigInt(id!), sku: Number(sku) } } });
  } else {
    await prisma.cart_items.update({ where: { cart_id_sku: { cart_id: BigInt(id!), sku: Number(sku) } }, data: { quantity: Number(quantity) } });
  }

  const items = await prisma.cart_items.findMany({ where: { cart_id: BigInt(id!) }, include: { item: { include: { product: true } }, product: true } });
  const cartId = id! as string;
  return NextResponse.json(serialize({ id: cartId, items }));
}

export async function DELETE(req: NextRequest) {
  const cookieStore = await cookies();
  const id = cookieStore.get(CART_COOKIE)?.value;
  if (!id) return NextResponse.json({ error: 'No cart' }, { status: 400 });
  let body: any = {};
  try { body = await req.json(); } catch {}

  if (body && body.sku) {
    await prisma.cart_items.delete({ where: { cart_id_sku: { cart_id: BigInt(id!), sku: Number(body.sku) } } });
  } else {
    await prisma.cart_items.deleteMany({ where: { cart_id: BigInt(id!) } });
  }

  const items = await prisma.cart_items.findMany({ where: { cart_id: BigInt(id!) }, include: { product: true } });
  const cartId = id! as string;
  return NextResponse.json(serialize({ id: cartId, items }));
}
