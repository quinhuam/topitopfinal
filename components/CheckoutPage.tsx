
import React, { useState } from 'react';
// FIX: Add .tsx/.ts extensions to fix module resolution errors.
import { useApp } from '../App.tsx';
import { View } from '../types.ts';
import { ChevronLeftIcon, InfoIcon, PlusCircleIcon, LandmarkIcon, CreditCardIcon } from './icons';

const CheckoutProgress: React.FC<{ step: 'delivery' | 'payment' }> = ({ step }) => {
    const isPayment = step === 'payment';

    return (
        <div className="max-w-md mx-auto mb-10">
            <div className="flex items-center">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold z-10">1</div>
                    <p className="text-sm mt-1 font-semibold">Carro</p>
                </div>

                {/* Line */}
                <div className={`flex-1 h-1 -mx-1 ${isPayment ? 'bg-red-600' : 'bg-black'}`}></div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 border-2 ${isPayment ? 'bg-red-600 text-white border-red-600' : 'bg-white text-black border-black'}`}>2</div>
                    <p className="text-sm mt-1 font-semibold">Entrega</p>
                </div>

                {/* Line */}
                <div className={`flex-1 h-1 -mx-1 ${isPayment ? 'bg-red-600' : 'bg-black'}`}></div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 border-2 ${isPayment ? 'bg-red-600 text-white border-red-600' : 'bg-white text-black border-black'}`}>3</div>
                    <p className="text-sm mt-1 font-semibold">Pago</p>
                </div>
            </div>
        </div>
    );
};

const PaymentOption: React.FC<{ name: string; label: string; icons: React.ReactNode; selected: string; onSelect: (name: string) => void;}> = ({ name, label, icons, selected, onSelect }) => (
    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selected === name ? 'border-red-500 bg-red-50 shadow-md' : 'hover:border-gray-400'}`}>
        <input type="radio" name="payment" value={name} checked={selected === name} onChange={() => onSelect(name)} className="h-4 w-4 text-red-600 focus:ring-red-500" />
        <span className="ml-4 font-semibold text-gray-800 flex-1">{label}</span>
        <div className="flex items-center space-x-2">{icons}</div>
    </label>
);

const CheckoutPage: React.FC = () => {
    const { cart, clearCart, setView } = useApp();
    const [step, setStep] = useState<'delivery' | 'payment'>('delivery');
    const [deliveryMethod, setDeliveryMethod] = useState<'domicilio' | 'tienda'>('domicilio');
    const [selectedPayment, setSelectedPayment] = useState<string>('');

    const subtotal = cart.reduce((acc, item) => acc + (item.product.price * 0.8) * item.quantity, 0);
    const gain = cart.reduce((acc, item) => acc + (item.product.price * 0.2) * item.quantity, 0);
    const shippingCost = deliveryMethod === 'domicilio' ? 9.50 : 0.00;
    const total = subtotal + shippingCost;

    const handleConfirmOrder = () => {
        alert('¡Tu pedido ha sido reservado con éxito!');
        clearCart();
        setView(View.DASHBOARD);
    };

    const handleNextStep = () => {
        if (step === 'delivery') {
            setStep('payment');
        } else {
            if (!selectedPayment) {
                alert('Por favor, seleccione un método de pago.');
                return;
            }
            handleConfirmOrder();
        }
    };
    
    const stores = [
        { id: 1, name: 'Topitop San Miguel', address: 'Av. La Marina 2000, San Miguel' },
        { id: 2, name: 'Topitop Jockey Plaza', address: 'Av. Javier Prado Este 4200, Surco' },
        { id: 3, name: 'Topitop MegaPlaza', address: 'Av. Alfredo Mendiola 3698, Independencia' },
    ];

    if (cart.length === 0) {
        return (
            <div>
                <div className="text-sm text-gray-500 mb-4">INICIO | CHECKOUT</div>
                <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No hay nada que pagar. Tu carrito está vacío.</p>
                    <button onClick={() => setView(View.PRODUCTS)} className="mt-4 text-red-600 font-semibold hover:underline">
                        Ir a comprar
                    </button>
                </div>
            </div>
        )
    }

    const renderDeliveryStep = () => (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex border border-gray-200 rounded-lg p-1 mb-4 max-w-sm mx-auto">
                <button
                    onClick={() => setDeliveryMethod('domicilio')}
                    className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${deliveryMethod === 'domicilio' ? 'bg-red-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                >
                    Envío a domicilio
                </button>
                <button
                    onClick={() => setDeliveryMethod('tienda')}
                    className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${deliveryMethod === 'tienda' ? 'bg-red-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                >
                    Retiro en tienda
                </button>
            </div>
            {deliveryMethod === 'domicilio' ? (
                <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-red-500 rounded-lg cursor-pointer bg-red-50">
                        <input type="radio" name="address" className="h-4 w-4 text-red-600 focus:ring-red-500" defaultChecked/>
                        <div className="ml-3 flex-1 flex justify-between items-center">
                            <p className="text-gray-700">Dirección - Calle La Molina 120 Dpto. 202 La Molina, Lima</p>
                            <div className="flex items-center space-x-2">
                                <button className="text-sm font-semibold text-gray-600">Cambiar</button>
                                <InfoIcon className="w-5 h-5 text-gray-500"/>
                            </div>
                        </div>
                    </label>
                     <div className="text-center p-3 border rounded-lg">
                        <p className="text-sm text-gray-600">En hasta 2 dias habiles <span className="font-bold ml-4">S/ 9.50</span></p>
                    </div>
                    <button className="flex items-center text-red-600 font-semibold mt-4">
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Entregar en otra dirección
                    </button>
                </div>
            ) : (
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Selecciona una tienda para el recojo</h3>
                    <div className="space-y-3">
                        {stores.map(store => (
                            <label key={store.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-red-500">
                                <input type="radio" name="store" className="h-4 w-4 text-red-600 focus:ring-red-500"/>
                                <div className="ml-3">
                                    <p className="font-semibold">{store.name}</p>
                                    <p className="text-sm text-gray-600">{store.address}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderPaymentStep = () => (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
                 <button onClick={() => setStep('delivery')} className="p-1 rounded-full hover:bg-gray-100">
                    <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <h2 className="text-xl font-bold text-gray-800 ml-4">Métodos de pago</h2>
            </div>

            <div className="space-y-4">
                <PaymentOption name="yapeplin" label="Yape / Plin" selected={selectedPayment} onSelect={setSelectedPayment} icons={
                    <>
                        <span className="font-bold text-sm text-purple-700 bg-purple-100 px-2 py-1 rounded">yape</span>
                        <span className="font-bold text-sm text-cyan-700 bg-cyan-100 px-2 py-1 rounded">plin</span>
                    </>
                }/>
                 <PaymentOption name="transferencia" label="Transferencia bancaria" selected={selectedPayment} onSelect={setSelectedPayment} icons={<LandmarkIcon className="w-6 h-6 text-gray-500" />}/>
                 <PaymentOption name="tarjeta" label="Tarjeta débito / crédito" selected={selectedPayment} onSelect={setSelectedPayment} icons={
                    <>
                        <span className="font-semibold text-xs border px-1 rounded">VISA</span>
                        <span className="font-semibold text-xs border px-1 rounded">MasterCard</span>
                        <span className="font-semibold text-xs border px-1 rounded">AMEX</span>
                    </>
                }/>
            </div>
            
            <div className="text-center my-6">
                <button className="border-2 border-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition">
                    Otro medio de pago
                </button>
            </div>
             
            <div className="space-y-4">
                 <PaymentOption name="linea_credito" label="Línea de crédito" selected={selectedPayment} onSelect={setSelectedPayment} icons={<CreditCardIcon className="w-6 h-6 text-gray-500" />}/>
            </div>
        </div>
    );

    return (
        <div>
            <div className="text-sm text-gray-500 mb-4">INICIO | PEDIDOS | PAGAR</div>
            <CheckoutProgress step={step} />
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                    {step === 'delivery' ? renderDeliveryStep() : renderPaymentStep()}
                </div>
                <div className="lg:w-1/3">
                     <div className="sticky top-24 space-y-6">
                        <div className="bg-gray-100 p-4 rounded-lg shadow-sm text-sm">
                             <div className="flex justify-between items-center">
                                <p className="text-gray-700">Crédito disponible para esta compra</p>
                                <p className="font-bold text-red-600">S/ 100.00</p>
                             </div>
                             <div className="flex justify-between items-center mt-1">
                                <p className="text-gray-700">Puntos acumulados</p>
                                <p className="text-gray-800 font-medium">250 pts</p>
                             </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold text-center mb-4">Resumen de la compra</h3>
                            <div className="mb-4">
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Ingrese cupón" className="w-full border rounded-md p-2 text-sm" />
                                    <button className="border border-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-100 text-sm">Agregar</button>
                                </div>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex justify-between">
                                    <p>Productos</p>
                                    <p>S/ {subtotal.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Ganancia</p>
                                    <p>- S/ {gain.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Costo de envio</p>
                                    <p>S/ {shippingCost.toFixed(2)}</p>
                                </div>
                                <hr className="my-3"/>
                                <div className="flex justify-between font-bold text-lg bg-rose-50 p-3 rounded-md">
                                    <p>Total:</p>
                                    <p>S/ {total.toFixed(2)}</p>
                                </div>
                            </div>
                            <button 
                              onClick={handleNextStep}
                              className="w-full bg-red-600 text-white mt-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
                            >
                                Ir a pagar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
