


import React from 'react';
// FIX: Add .tsx/.ts extensions to fix module resolution errors. Note the double .. for path traversal.
import { useApp } from '../../App.tsx';
import { View } from '../../types.ts';
// FIX: Remove unused SearchIcon
import { ChevronRightIcon } from '../icons';

// FIX: Change component definition to use React.FC to fix typing issue with the `key` prop.
const OrderRow: React.FC<{ order: any, onSelect: (order: any) => void }> = ({ order, onSelect }) => (
    <tr className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onSelect(order)}>
        <td className="p-4">{order.id}</td>
        <td className="p-4">{order.campaign}</td>
        <td className="p-4">{order.status}</td>
        <td className="p-4">S/ {order.total.toFixed(2)}</td>
        <td className="p-4 text-right">
             <button className="text-red-600 flex items-center font-semibold text-sm hover:underline">
                Detalle del pedido <ChevronRightIcon className="w-4 h-4 ml-1" />
            </button>
        </td>
    </tr>
);

const OrderListView: React.FC = () => {
    const { setView, setSelectedOrder } = useApp();
    
    const orders = [
        { 
            id: '2510236010', campaign: 'Campaña C12', status: 'Entregado', total: 286.50,
            address: 'Av. Las Flores 748 Int. 302, San Miguel, Lima',
            items: [
                { id: 110739, name: 'Jean Mom Fit - Classic Denim', size: '28', color: 'Denim', price: 89.90, quantity: 1, image: 'https://picsum.photos/seed/jeans/200' },
                { id: 110743, name: 'Casaca Bomber - Olive Green', size: 'M', color: 'Verde', price: 129.90, quantity: 1, image: 'https://picsum.photos/seed/bomber/200' },
                 { id: 110741, name: 'Polo Básico - Black', price: 29.90, image: 'https://picsum.photos/seed/blackpolo/200', size: 'M', color: 'Negro', quantity: 2 },
            ]
        },
        { 
            id: '2510236009', campaign: 'Campaña C11', status: 'Entregado', total: 545.50,
            address: 'Calle Los Pinos 123, Surco, Lima',
            items: [
                { id: 110742, name: 'Pantalón Cargo - Beige', size: '32', color: 'Beige', price: 99.90, quantity: 2, image: 'https://picsum.photos/seed/cargopants/200' },
                { id: 110748, name: 'Camisa Leñador - Red Plaid', size: 'L', color: 'Rojo', price: 75.00, quantity: 3, image: 'https://picsum.photos/seed/plaidshirt/200' },
            ]
        },
        { 
            id: '2510236008', campaign: 'Campaña C10', status: 'Entregado', total: 454.50,
            address: 'Jirón de la Unión 456, Cercado de Lima',
             items: [
                { id: 110749, name: 'Falda Mini - Black', size: 'S', color: 'Negro', price: 55.00, quantity: 5, image: 'https://picsum.photos/seed/skirt/200' },
            ]
        },
    ];

    const handleSelectOrder = (order: any) => {
        setSelectedOrder(order);
        setView(View.MY_BUSINESS_ORDER_DETAIL);
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lista de pedidos</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-700">
                    <tbody>
                        {orders.map(order => (
                            <OrderRow key={order.id} order={order} onSelect={handleSelectOrder} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderListView;