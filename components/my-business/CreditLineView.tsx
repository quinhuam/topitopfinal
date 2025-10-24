
import React from 'react';
import { InfoIcon } from '../icons';

const CreditLineView: React.FC = () => {
    const creditData = {
        totalCredit: 2000.00,
        availableCredit: 100.00,
        usedCredit: 1900.00,
        nextPaymentDate: '2024-07-30',
        nextPaymentAmount: 350.00,
        transactions: [
            { date: '2024-07-01', description: 'Pago Campaña C12', amount: -500.00 },
            { date: '2024-06-25', description: 'Compra Pedido 2510236010', amount: 286.50 },
            { date: '2024-06-15', description: 'Pago Campaña C11', amount: -400.00 },
            { date: '2024-06-10', description: 'Compra Pedido 2510236009', amount: 545.50 },
        ]
    };

    const usedPercentage = (creditData.usedCredit / creditData.totalCredit) * 100;

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Línea de crédito</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">Crédito Total</p>
                    <p className="text-2xl font-bold text-gray-800">S/ {creditData.totalCredit.toFixed(2)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-green-700">Crédito Disponible</p>
                    <p className="text-2xl font-bold text-green-600">S/ {creditData.availableCredit.toFixed(2)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-red-700">Crédito Utilizado</p>
                    <p className="text-2xl font-bold text-red-600">S/ {creditData.usedCredit.toFixed(2)}</p>
                </div>
            </div>

            <div className="mb-8">
                <p className="text-sm text-gray-600 mb-2">Uso de tu línea de crédito</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                        className="bg-red-500 h-4 rounded-full" 
                        style={{ width: `${usedPercentage}%` }}
                    ></div>
                </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-r-lg mb-8 flex items-start">
                <InfoIcon className="w-6 h-6 mr-3 mt-1 flex-shrink-0" />
                <div>
                    <p className="font-bold">Próximo pago</p>
                    <p>Tu próximo pago de <span className="font-semibold">S/ {creditData.nextPaymentAmount.toFixed(2)}</span> vence el <span className="font-semibold">{creditData.nextPaymentDate}</span>.</p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Últimos movimientos</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-sm text-gray-600">
                            <tr>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Descripción</th>
                                <th className="p-3 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditData.transactions.map((tx, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-3">{tx.date}</td>
                                    <td className="p-3">{tx.description}</td>
                                    <td className={`p-3 text-right font-semibold ${tx.amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {tx.amount > 0 ? `S/ ${tx.amount.toFixed(2)}` : `S/ ${(-tx.amount).toFixed(2)}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CreditLineView;
