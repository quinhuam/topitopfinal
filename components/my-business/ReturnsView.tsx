
import React from 'react';

const ReturnsView: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Queremos verte siempre satisfecha</h2>
            <p className="text-gray-600 mb-6">Si tuviste inconvenientes con algún producto y estás dentro del plazo permitido sigue estos pasos:</p>

            <div className="flex justify-center items-center space-x-4 mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                </div>
                 <div className="flex-1 h-0.5 bg-gray-300"></div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>
                </div>
                 <div className="flex-1 h-0.5 bg-gray-300"></div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-gray-300">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-700 mb-4">¿Con qué producto has tenido el inconveniente?</h3>

            <form>
                <div className="flex flex-col md:flex-row gap-4">
                    <input type="text" placeholder="¿En que campaña lo solicitaste?" className="w-full border rounded-md p-3" />
                    <input type="text" placeholder="Ingresa el nombre o código del producto" className="w-full border rounded-md p-3" />
                    <div className="flex items-center border rounded-md">
                        <button type="button" className="px-3 py-1 text-lg font-bold">-</button>
                        <span className="px-4 py-3 bg-gray-100">1</span>
                        <button type="button" className="px-3 py-1 text-lg font-bold">+</button>
                    </div>
                </div>
                <div className="mt-8">
                    <button className="bg-red-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-red-700 transition">
                        Siguiente
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReturnsView;
