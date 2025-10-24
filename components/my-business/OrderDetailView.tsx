
import React from 'react';
// FIX: Add .tsx/.ts extensions to fix module resolution errors. Note the double .. for path traversal.
import { useApp } from '../../App.tsx';
import { View } from '../../types.ts';
import { ChevronLeftIcon } from '../icons';

const OrderDetailView: React.FC = () => {
    const { setView, selectedOrder } = useApp();
    
    if (!selectedOrder) {
        return (
             <div>
                <button onClick={() => setView(View.MY_BUSINESS_ORDERS)} className="flex items-center text-gray-600 hover:text-gray-800 font-semibold mb-4">
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Volver a mis pedidos
                </button>
                <p>No se ha seleccionado ningún pedido.</p>
            </div>
        )
    }

    const order = selectedOrder;

    return (
        <div>
            <button onClick={() => setView(View.MY_BUSINESS_ORDERS)} className="flex items-center text-gray-600 hover:text-gray-800 font-semibold mb-4">
                <ChevronLeftIcon className="w-5 h-5 mr-2" />
                Volver a mis pedidos
            </button>

            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start border-b pb-6 mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Pedido N° {order.id}</h2>
                        <p className="text-gray-500">Campaña: {order.campaign}</p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                        <p className="text-gray-500">Estado:</p>
                        <p className="font-bold text-green-600">{order.status}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <div>
                        <h3 className="font-bold text-gray-700 mb-2">Dirección de entrega</h3>
                        <p className="text-gray-600">{order.address}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700 mb-2">Resumen de pago</h3>
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal:</span>
                            <span>S/ {order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Envío:</span>
                            <span>S/ 0.00</span>
                        </div>
                        <div className="flex justify-between font-bold text-gray-800 mt-2 pt-2 border-t">
                            <span>Total:</span>
                            <span>S/ {order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-gray-700 mb-4">Artículos en el pedido ({order.items.length})</h3>
                    <div className="space-y-4">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">Talla: {item.size} | Color: {item.color}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">S/ {item.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailView;