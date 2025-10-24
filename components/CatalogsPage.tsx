import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayCircleIcon } from './icons';

const CatalogsPage: React.FC = () => {
    const catalogs = [
        { title: 'Mágica NAVIDAD', image: 'https://picsum.photos/seed/navidad/400/600' },
        { title: 'Tendencias de verano', image: 'https://picsum.photos/seed/verano/400/600' },
        { title: 'Verano con estilo!', image: 'https://picsum.photos/seed/estilo/400/600' },
    ];
    return (
        <div>
            <div className="text-sm text-gray-500 mb-4">INICIO | CATÁLOGOS</div>
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Mis catálogos</h2>
                <div className="flex items-center justify-center space-x-4 mb-8">
                    <button className="text-gray-600 hover:text-red-600"><ChevronLeftIcon className="w-6 h-6"/></button>
                    <span className="font-semibold text-lg text-gray-700">CAMPAÑA 13</span>
                    <button className="text-gray-600 hover:text-red-600"><ChevronRightIcon className="w-6 h-6"/></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
                    {catalogs.map((catalog, index) => (
                        <div key={index} className="text-center group">
                            <div className="rounded-lg overflow-hidden shadow-md transform group-hover:scale-105 transition-transform duration-300">
                                <img src={catalog.image} alt={catalog.title} className="w-full h-auto object-cover"/>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mb-12">
                    <button className="border-2 border-gray-400 text-gray-700 font-semibold py-2 px-8 rounded-full hover:bg-gray-100 transition">
                        Descargar catálogo
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-6 rounded-lg">
                    <div className="relative mb-4 md:mb-0 md:mr-6 w-full md:w-auto">
                        <img src="https://picsum.photos/seed/woman-shopping/400/200" alt="Como comprar" className="rounded-lg w-full h-auto object-cover"/>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <PlayCircleIcon className="w-20 h-20 text-white opacity-80 hover:opacity-100 cursor-pointer"/>
                        </div>
                        <div className="absolute top-4 right-4 text-white font-bold text-lg text-right">
                            <p>¿Como comprar</p>
                            <p>por el <span className="bg-red-600 px-1">catálogo</span></p>
                            <p>Digital?</p>
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-gray-700 mb-4">Enseña a tus clientes a usar el catálogo</p>
                        <button className="border-2 border-gray-400 text-gray-700 font-semibold py-2 px-8 rounded-full hover:bg-gray-100 transition">
                            Compartir
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CatalogsPage;