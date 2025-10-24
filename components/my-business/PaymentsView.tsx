
import React from 'react';

const PaymentsView: React.FC = () => {
    const payments = [
        { id: 'PAY-1001', date: '2024-07-01', campaign: 'C12', amount: 500.00, status: 'Completado', method: 'Yape' },
        { id: 'PAY-1002', date: '2024-06-15', campaign: 'C11', amount: 400.00, status: 'Completado', method: 'BCP' },
        { id: 'PAY-1003', date: '2024-05-20', campaign: 'C10', amount: 650.00, status: 'Completado', method: 'Plin' },
        { id: 'PAY-1004', date: '2024-04-25', campaign: 'C09', amount: 320.50, status: 'Completado', method: 'Yape' },
    ];

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Mis Pagos</h2>
                    <p className="text-gray-500">Historial de pagos realizados</p>
                </div>
                <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center mt-4 sm:mt-0">
                    <p className="text-sm">Total Pagado (últimos 6 meses)</p>
                    <p className="font-bold text-xl">S/ {totalPaid.toFixed(2)}</p>
                </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-6 rounded-r-lg">
                <p><span className="font-bold">Recordatorio:</span> Realiza tus pagos a tiempo para evitar intereses y mantener tu línea de crédito activa.</p>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                        <tr>
                            <th className="p-4">ID de Pago</th>
                            <th className="p-4">Fecha</th>
                            <th className="p-4">Campaña</th>
                            <th className="p-4">Monto</th>
                            <th className="p-4">Método</th>
                            <th className="p-4">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {payments.map(payment => (
                             <tr key={payment.id} className="border-b">
                                <td className="p-4">{payment.id}</td>
                                <td className="p-4">{payment.date}</td>
                                <td className="p-4">{payment.campaign}</td>
                                <td className="p-4">S/ {payment.amount.toFixed(2)}</td>
                                <td className="p-4">{payment.method}</td>
                                <td className="p-4">
                                    <span className="bg-green-200 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{payment.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 text-center">
                <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition">
                    Realizar un nuevo pago
                </button>
            </div>
        </div>
    );
};

export default PaymentsView;
