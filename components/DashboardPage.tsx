import React, { useState, useEffect } from 'react';
import { useApp } from '../App.tsx';
import { View } from '../types.ts';
import { ChevronRightIcon, ChevronLeftIcon } from './icons';

const Slider: React.FC = () => {
    const slides = [
        {
            image: '/images/BANNERDENIM.jpeg',
            title: '',
            subtitle: ''
        },
        {
            image: '/images/BANNERDENIM.jpeg',
            title: '',
            subtitle: ''
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    
    const nextSlide = () => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    useEffect(() => {
        const slideInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(slideInterval);
    }, []);

    return (
        <div className="relative w-full h-56 sm:h-72 md:h-96 rounded-lg overflow-hidden shadow-lg">
            {slides.map((slide, index) => (
                <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-opacity-30 flex flex-col items-center justify-center text-white p-4">
                        <h2 className="text-4xl md:text-6xl font-extrabold" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{slide.title}</h2>
                        <p className="text-xl md:text-2xl font-light tracking-widest" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>{slide.subtitle}</p>
                         {/*<button className="mt-4 bg-white text-black font-bold py-2 px-6 rounded-full text-sm hover:bg-gray-200 transition">
                            Ver más →
                        </button>*/}
                    </div>
                </div>
            ))}
             <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 focus:outline-none">
                <ChevronLeftIcon className="w-6 h-6 text-gray-800"/>
            </button>
            <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 rounded-full p-2 focus:outline-none">
                <ChevronRightIcon className="w-6 h-6 text-gray-800"/>
            </button>
        </div>
    );
}


const DashboardPage: React.FC = () => {
    const { setView, userData, isSliderVisible } = useApp();
    
    const financialData = {
        creditLine: "S/ 500",
        available: "S/ 200",
        totalDebt: "S/ 300",
    };

    const prizePromos = [
        { points: 250, image: '/images/banner3.png' },
        { points: 250, image: '/images/banner2.png' },
        { points: 250, image: '/images/banner1.png' },
    ];

    return (
        <div className="space-y-6">
            {isSliderVisible && <Slider />}
            
            <div className="bg-white p-4 rounded-lg shadow-md text-center sm:text-left">
                <p className="text-lg font-semibold text-gray-800">Hola Mariela, estas en campaña 01</p>
                <p className="text-sm text-gray-500">Pedido C13: Inicia - 12 de setiembre | Vence - 31 de setiembre</p>
            </div>
            
            <div className="bg-rose-50 p-6 rounded-lg shadow-md">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                        <div className="bg-white p-4 rounded-lg border text-center">
                            <p className="text-xs text-gray-700">LÍNEA DE CRÉDITO</p>
                            <p className="font-bold text-lg text-gray-800">{financialData.creditLine}</p>
                        </div>
                         <div className="bg-white p-4 rounded-lg border text-center">
                            <p className="text-xs text-gray-700">DISPONIBLE</p>
                            <p className="font-bold text-lg text-gray-800">{financialData.available}</p>
                        </div>
                         <div className="bg-white p-4 rounded-lg border text-center">
                            <p className="text-xs text-gray-700">DEUDA TOTAL</p>
                            <p className="font-bold text-lg text-gray-800">{financialData.totalDebt}</p>
                        </div>
                    </div>
                    <div className="border-l pl-4 ml-4 mt-4 md:mt-0">
                         <p className="text-xs text-gray-700">FECHA DE PAGO</p>
                         <select className="font-bold text-lg bg-transparent focus:outline-none text-gray-800">
                            <option>31 de setiembre</option>
                            <option>15 de octubre</option>
                         </select>
                         <button className="text-red-600 font-semibold text-sm mt-2 block hover:underline">Paga en línea</button>
                    </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <button onClick={() => setView(View.MY_BUSINESS_ORDERS)} className="w-full text-center border-2 border-red-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition text-gray-800">
                    Seguimiento de pedido
                </button>
                <button onClick={() => setView(View.PRIZES)} className="w-full text-center border-2 border-red-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition flex justify-center items-center text-gray-800">
                    <span>Puntos</span>
                    <span className="ml-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">{userData.points}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {prizePromos.map((promo, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden shadow-md group">
                        <img src={promo.image} alt={`Gana con ${promo.points} pts`} className="w-full object-cover transform group-hover:scale-110 transition-transform duration-300"/>
                        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center">
                            <div className="text-center text-white" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
                                <p className="font-extrabold text-2xl">GANA</p>
                                <p className="font-semibold">con {promo.points} pts.</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default DashboardPage;