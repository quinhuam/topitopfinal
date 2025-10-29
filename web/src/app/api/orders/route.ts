import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serialize } from '@/lib/serialize';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const skip = Math.max(0, (page - 1) * pageSize);
  const take = Math.max(1, pageSize);
  const [data, total] = await Promise.all([
    prisma.orders.findMany({ skip, take, orderBy: { id: 'desc' } }),
    prisma.orders.count(),
  ]);
  return NextResponse.json(serialize({ data, page, pageSize, total }));
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;
  if (!cartId) return NextResponse.json({ error: 'No cart' }, { status: 400 });

  const items = await prisma.cart_items.findMany({
    where: { cart_id: BigInt(cartId) },
    include: { product: true },
  });
  if (items.length === 0) return NextResponse.json({ error: 'Empty cart' }, { status: 400 });

  const payload = await req.json().catch(() => ({} as any));
  const method = payload.method || 'manual';
  const shippingMethod = payload.shipping || 'domicilio';
  const shippingCost = shippingMethod === 'domicilio' ? 9.5 : 0;

  const subtotalForClient = items.reduce((acc: number, i: any) => acc + (Number(i.product.price) || 0) * i.quantity, 0);
  const gain = subtotalForClient * 0.2;
  const totalToPay = subtotalForClient - gain + shippingCost;
  const totalQty = items.reduce((acc: number, i: any) => acc + i.quantity, 0);

  const order_number = `TT-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 1000)}`;

  const created = await prisma.orders.create({
    data: {
      user_id: payload.user_id ?? null,
      cart: JSON.stringify(items.map(i => ({
        product_id: Number(i.product_id),
        quantity: i.quantity,
        size: i.size,
        color: i.color,
        price: Number(i.product.price) || 0,
      }))),
      method,
      shipping: shippingMethod,
      pickup_location: payload.pickup_location ?? null,
      totalQty: String(totalQty),
      pay_amount: Number(totalToPay),
      order_number,
      customer_email: payload.customer_email || 'cliente@example.com',
      customer_name: payload.customer_name || 'Cliente',
      customer_phone: payload.customer_phone || '000000000',
      currency_sign: 'S/',
      currency_name: 'PEN',
      currency_value: 1,
      shipping_cost: Number(shippingCost),
      packing_cost: 0,
      tax: 0,
    },
  });

  for (const i of items as any[]) {
    await prisma.order_items.create({
      data: {
        order_id: BigInt(created.id),
        product_id: BigInt(i.product_id),
        talla: i.size ?? null,
        cantidad: i.quantity,
        precio_unitario: (Number(i.product.price) || 0).toFixed(2) as any,
      },
    });
  }

  await prisma.cart_items.deleteMany({ where: { cart_id: BigInt(cartId) } });

  return NextResponse.json(serialize({ order: created }), { status: 201 });
}
