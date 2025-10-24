
import React from 'react';
// FIX: Add .tsx/.ts extensions to fix module resolution errors.
import { useApp } from '../App.tsx';
import { View } from '../types.ts';
import { ChevronLeftIcon } from './icons';

const AffiliatePage: React.FC = () => {
    const { setView } = useApp();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would handle form submission, e.g., API call
        alert('¡Registro enviado con éxito! Serás redirigido a la página de inicio.');
        setView(View.LOGIN);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
             <header className="w-full max-w-4xl flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <img src="/images/logocatalogo-DOgmBwgp.jpg" alt="Topitop Catalogo Logo" className="w-40 mb-8" onClick={() => setView(View.LOGIN)} />
                </div>
                <div>
                    <a href="#" className="font-bold text-gray-700 hover:text-red-600 text-sm">CONTÁCTANOS</a>
                </div>
            </header>

            <main className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
                 <button onClick={() => setView(View.LOGIN)} className="flex items-center text-gray-600 hover:text-red-600 font-semibold mb-6">
                    <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    Volver al inicio
                </button>
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">¡Únete a Topitop Catálogo!</h1>
                <p className="text-center text-gray-600 mb-8">Completa tus datos para empezar a vender y ganar.</p>

                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Datos Personales</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombres*</label>
                            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Apellidos*</label>
                            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de documento*</label>
                            <select required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white">
                                <option>DNI</option>
                                <option>Carnet de Extranjería</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nro. de documento*</label>
                            <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Celular*</label>
                            <input type="tel" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo electrónico*</label>
                            <input type="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento*</label>
                            <input type="date" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                        </div>
                    </div>

                    <hr className="my-8" />
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Dirección de Entrega</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Departamento*</label>
                            <select required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white">
                                <option>Lima</option>
                                <option>Arequipa</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Provincia*</label>
                            <select required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white">
                                <option>Lima</option>
                                <option>Callao</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Distrito*</label>
                            <select required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 bg-white">
                                <option>Miraflores</option>
                                <option>San Isidro</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Dirección*</label>
                        <input type="text" required placeholder="Ej: Av. Larco 123, Dpto. 4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500" />
                    </div>
                    
                    <div className="mt-8">
                        <label className="flex items-center">
                            <input type="checkbox" required className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                            <span className="ml-2 text-sm text-gray-600">Acepto los <a href="#" className="text-red-600 underline">Términos y Condiciones</a> y la <a href="#" className="text-red-600 underline">Política de Privacidad</a>.*</span>
                        </label>
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                        <button type="submit" className="bg-red-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-red-700 transition">
                            Registrarme
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AffiliatePage;