"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCardIcon, LandmarkIcon, InfoIcon } from "@/components/icons";
import { useRouter } from "next/navigation";

type Product = { id: number; name: string; price: number; photo?: string; image?: string };

type ApiItem = { product: Product; quantity: number; size?: string | null; color?: string | null };

type CartState = { id: string; items: ApiItem[] };

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartState | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'domicilio' | 'tienda'>('domicilio');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/cart', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const mappedItems = (data.items || []).map((i: any) => ({
        ...i,
        product: i.product ?? i.item?.product ?? {},
      }));
      setCart({ id: String(data.id || ''), items: mappedItems });
    };
    load();
  }, []);

  // Modal se abre solo al hacer clic en "Confirmar pedido"

  const subtotalForClient = useMemo(() => {
    if (!cart) return 0;
    return cart.items.reduce((acc, i) => acc + ((i.product?.price ?? 0) as number) * (i.quantity ?? 1), 0);
  }, [cart]);

  const gain = subtotalForClient * 0.20;
  const shippingCost = deliveryMethod === 'domicilio' ? 9.5 : 0;
  const total = subtotalForClient - gain + shippingCost;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-500">INICIO | CHECKOUT</div>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-600">No hay nada que pagar. Tu carrito está vacío.</p>
          <Link href="/products" className="mt-4 inline-block text-red-600 font-semibold hover:underline">Ir a comprar</Link>
        </div>
      </div>
    );
  }

  const handleCreateOrder = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: selectedPayment, shipping: deliveryMethod })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || 'No se pudo crear la orden');
      }
      await res.json();
      router.push('/dashboard');
    } catch (e: any) {
      setError(e.message || 'Error al confirmar');
    } finally {
      setSubmitting(false);
      setShowPayModal(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">INICIO | PEDIDOS | PAGAR</div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex border border-gray-200 rounded-lg p-1 mb-4 max-w-sm mx-auto">
              <button onClick={() => setDeliveryMethod('domicilio')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${deliveryMethod === 'domicilio' ? 'bg-red-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}>Envío a domicilio</button>
              <button onClick={() => setDeliveryMethod('tienda')} className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${deliveryMethod === 'tienda' ? 'bg-red-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}>Retiro en tienda</button>
            </div>
            {deliveryMethod === 'domicilio' ? (
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-red-500 rounded-lg cursor-pointer bg-red-50">
                  <input type="radio" name="address" className="h-4 w-4 text-red-600 focus:ring-red-500" defaultChecked />
                  <div className="ml-3 flex-1 flex justify-between items-center">
                    <p className="text-gray-700">Dirección - Calle La Molina 120 Dpto. 202 La Molina, Lima</p>
                    <div className="flex items-center space-x-2">
                      <button className="text-sm font-semibold text-gray-600">Cambiar</button>
                      <InfoIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </label>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-sm text-gray-600">En hasta 2 días hábiles <span className="font-bold ml-4">S/ 9.50</span></p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Selecciona una tienda para el recojo</h3>
                <div className="space-y-3">
                  {['Topitop San Miguel', 'Topitop Jockey Plaza', 'Topitop MegaPlaza'].map((s, idx) => (
                    <label key={idx} className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-red-500">
                      <input type="radio" name="store" className="h-4 w-4 text-red-600 focus:ring-red-500" />
                      <div className="ml-3">
                        <p className="font-semibold">{s}</p>
                        <p className="text-sm text-gray-600">Dirección de ejemplo</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Métodos de pago</h2>
            <div className="space-y-4">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'billetera' ? 'border-red-500 bg-red-50 shadow-md' : 'hover:border-gray-400'}`}>
                <input type="radio" name="payment" value="billetera" checked={selectedPayment === 'billetera'} onChange={() => setSelectedPayment('billetera')} className="h-4 w-4 text-red-600 focus:ring-red-500" />
                <span className="ml-4 font-semibold text-gray-800 flex-1">Yape / Plin / Billeteras electrónicas</span>
                <CreditCardIcon className="w-6 h-6 text-gray-500" />
              </label>
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'transferencia' ? 'border-red-500 bg-red-50 shadow-md' : 'hover:border-gray-400'}`}>
                <input type="radio" name="payment" value="transferencia" checked={selectedPayment === 'transferencia'} onChange={() => setSelectedPayment('transferencia')} className="h-4 w-4 text-red-600 focus:ring-red-500" />
                <span className="ml-4 font-semibold text-gray-800 flex-1">Transferencia bancaria</span>
                <CreditCardIcon className="w-6 h-6 text-gray-500" />
              </label>
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === 'credito' ? 'border-red-500 bg-red-50 shadow-md' : 'hover:border-gray-400'}`}>
                <input type="radio" name="payment" value="credito" checked={selectedPayment === 'credito'} onChange={() => setSelectedPayment('credito')} className="h-4 w-4 text-red-600 focus:ring-red-500" />
                <span className="ml-4 font-semibold text-gray-800 flex-1">Línea de crédito</span>
                <LandmarkIcon className="w-6 h-6 text-gray-500" />
              </label>
            </div>
            <div className="text-right mt-4">
              <button
                disabled={!selectedPayment || submitting}
                onClick={() => setShowPayModal(true)}
                className={`px-6 py-2 rounded-lg font-bold ${selectedPayment && !submitting ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              >
                {submitting ? 'Confirmando...' : 'Confirmar pedido'}
              </button>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-sm">
              <div className="flex justify-between items-center"><p className="text-gray-700">Crédito disponible para esta compra</p><p className="font-bold text-red-600">S/ 100.00</p></div>
              <div className="flex justify-between items-center mt-1"><p className="text-gray-700">Puntos acumulados</p><p className="text-gray-800 font-medium">250 pts</p></div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-center mb-4">Resumen de la compra</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between"><p>Productos</p><p>S/ {subtotalForClient.toFixed(2)}</p></div>
                <div className="flex justify-between"><p>Ganancia</p><p>- S/ {gain.toFixed(2)}</p></div>
                <div className="flex justify-between"><p>Costo de envio</p><p>S/ {shippingCost.toFixed(2)}</p></div>
                <hr className="my-3" />
                <div className="flex justify-between font-bold text-lg bg-rose-50 p-3 rounded-md"><p>Total:</p><p>S/ {total.toFixed(2)}</p></div>
              </div>
              <p className="text-xs text-gray-500 mt-3">Los montos son referenciales.</p>
            </div>
          </div>
        </div>
      </div>
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setShowPayModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
            <h3 className="text-lg font-bold mb-2">Confirmación de pago</h3>
            <p className="text-sm text-gray-700 mb-6">
              {selectedPayment === 'billetera' || selectedPayment === 'transferencia'
                ? 'Procesando con LIGO'
                : 'Procesando con su linea de credito'}
            </p>
            <div className="flex gap-3 justify-end">
              <button disabled={submitting} onClick={() => setShowPayModal(false)} className="px-4 py-2 rounded border font-semibold">Cancelar</button>
              {(selectedPayment === 'billetera' || selectedPayment === 'transferencia') ? (
                <button disabled={submitting} onClick={handleCreateOrder} className={`px-4 py-2 rounded font-semibold ${submitting ? 'bg-gray-300 text-gray-600' : 'bg-red-600 text-white hover:bg-red-700'}`}>Confirmar</button>
              ) : (
                <button disabled={submitting} onClick={() => setShowPayModal(false)} className="px-4 py-2 rounded font-semibold bg-red-600 text-white hover:bg-red-700">Entendido</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
