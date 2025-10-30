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
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [qrText, setQrText] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
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

  // Generar QR en el cliente usando la librería 'qrcode'
  useEffect(() => {
    const gen = async () => {
      if (!qrText) { setQrDataUrl(null); return; }
      try {
        const mod = await import('qrcode');
        const dataUrl = await mod.default.toDataURL(qrText, { width: 220, margin: 1 });
        setQrDataUrl(dataUrl);
      } catch (e) {
        // si falla, no bloqueamos la UI; mostramos el texto para conversión manual
        setQrDataUrl(null);
      }
    };
    gen();
  }, [qrText]);

  // Confirmación inline, sin modal

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
      const data = await res.json();
      return data;
    } catch (e: any) {
      setError(e.message || 'Error al confirmar');
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  // Procesa pago: genera token -> obtiene access_token -> muestra texto -> crea orden
  const handleProcessPaymentAndCreateOrder = async () => {
    setError(null);
    setSubmitting(true);
    setConfirmationMessage('');
    try {
      if (selectedPayment === 'credito') {
        // Solo crear la orden y mostrar mensaje de agradecimiento
        const order = await handleCreateOrder();
        if (!order) return;
        setConfirmationMessage('Muchas gracias por su pedido');
        const amountCents = Math.round((total || 0) * 100);
        fetch('/api/external-dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderNumber: order?.order_number || order?.orderNumber || order?.id || '', amountCents, method: 'credito' }),
        }).catch(() => {});
        return;
      }

      // Generar token y obtener access_token
      const tkRes = await fetch('/api/ligo-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ issuer: 'ligo', audience: 'ligo-calidad.com', subject: 'ligo@gmail.com', companyId: 'e8b4a36d-6f1d-4a2a-bf3a-ce9371dde4ab' }) });
      const tkJson = await tkRes.json();
      if (!tkRes.ok || !tkJson?.token) throw new Error(tkJson?.error || 'No se pudo generar token');
      const authRes = await fetch('/api/ligo-auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: tkJson.token }) });
      const authJson = await authRes.json();
      if (!authRes.ok || !authJson?.ok) throw new Error(authJson?.error || 'No se pudo autenticar');
      const accessToken: string = authJson?.data?.access_token || authJson?.access_token;
      if (!accessToken) throw new Error('No access_token recibido');

      // Crear orden para obtener order_number
      const order = await handleCreateOrder();
      if (!order) return;
      const orderNumber = order?.order_number || order?.orderNumber || order?.id || '';

      // Llamar efímero
      const cents = Math.round((total || 0) * 100);
      const type = selectedPayment === 'transferencia' ? 'cci' : 'qr';
      const efRes = await fetch('/api/ligo-efimero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: accessToken, amount: cents, description: String(orderNumber), type }),
      });
      const efJson = await efRes.json();
      if (!efRes.ok || !efJson?.ok) throw new Error(efJson?.error || 'No se pudo generar efímero');
      if (selectedPayment === 'transferencia') {
        const efCci = efJson?.data?.efimeroCci || efJson?.data?.cci || efJson?.efimeroCci || '';
        const monto = Number(total || 0).toFixed(2);
        const instr = [
          'Muchas gracias por su pedido, aqui las instrucciones para realizar el pago:',
          '1. Ingresar a su home banking',
          '2. Ingresar a la cuenta desde donde se hara la transferencia',
          `3. Debe ingresar el CCI: ${efCci}`,
          `4. Ingresar el monto: S/ ${monto}`,
        ].join('\n');
        setConfirmationMessage(instr);
        setQrText(null);
        setQrDataUrl(null);

        // Despachar payload externo (no bloquear ante error)
        const amountCents = Math.round((total || 0) * 100);
        fetch('/api/external-dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber,
            amountCents,
            method: 'transferencia',
            type: 'cci',
            efimero: efJson?.data ?? efJson,
          }),
        }).catch(() => {});
      } else {
        // billetera: mostrar instrucciones y QR
        const hashQr = efJson?.data?.hashQr || efJson?.hashQr || '';
        const monto = Number(total || 0).toFixed(2);
        const instr = [
          '1. Abrir su billetera electronica',
          '2. Escanear el siguiente QR',
          `3. Ingresar el monto: S/ ${monto}`,
        ].join('\n');
        setConfirmationMessage(instr);
        setQrText(hashQr || null);
        setQrDataUrl(null);

        // Despachar payload externo (no bloquear ante error)
        const amountCents = Math.round((total || 0) * 100);
        fetch('/api/external-dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber,
            amountCents,
            method: 'billetera',
            type: 'qr',
            efimero: efJson?.data ?? efJson,
          }),
        }).catch(() => {});
      }
    } catch (e: any) {
      setError(e.message || 'Error al procesar pago');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">INICIO | PEDIDOS | PAGAR</div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          {confirmationMessage ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirmación</h2>
              <p className="text-gray-700 whitespace-pre-line">{confirmationMessage}</p>
              {qrDataUrl && (
                <div className="mt-4 flex justify-center">
                  <img src={qrDataUrl} alt="QR de pago" className="w-56 h-56" />
                </div>
              )}
            </div>
          ) : (
            <>
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
                onClick={handleProcessPaymentAndCreateOrder}
                className={`px-6 py-2 rounded-lg font-bold ${selectedPayment && !submitting ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
              >
                {submitting ? 'Procesando...' : 'Confirmar pedido'}
              </button>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>
          </div>
            </>
          )}
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
      {/* Modal eliminado: confirmación inline */}
    </div>
  );
}
