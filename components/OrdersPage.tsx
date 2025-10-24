
import React, { useState, useMemo } from 'react';
// FIX: Add .tsx/.ts extensions to fix module resolution errors.
import { useApp } from '../App.tsx';
import { View, Product } from '../types.ts';
// FIX: Import GiftIcon to fix compilation error.
import { Trash2Icon, GiftIcon } from './icons';

// Mock product data for search functionality
const allProducts: Product[] = [
    { id: 110737, name: 'Polera Franela - Pink Rose', price: 50.00, image: 'https://images.pexels.com/photos/1032110/pexels-photo-1032110.jpeg?auto=compress&cs=tinysrgb&w=400', gender: 'Mujer', category: 'Poleras', brand: 'Topitop' },
    { id: 110738, name: 'Short Urban - Sporty blue', price: 50.00, image: 'https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&w=400', gender: 'Mujer', category: 'Shorts', brand: 'Hawk' },
    { id: 110739, name: 'Jean Mom Fit - Classic Denim', price: 89.90, image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=400', gender: 'Mujer', category: 'Jeans', brand: 'Topitop' },
    { id: 110740, name: 'Blusa Manga Larga - White', price: 45.00, image: 'https://images.pexels.com/photos/1898555/pexels-photo-1898555.jpeg?auto=compress&cs=tinysrgb&w=400', gender: 'Mujer', category: 'Blusas', brand: 'Xiomi' },
    { id: 110741, name: 'Polo Básico - Black', price: 29.90, image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400', gender: 'Hombre', category: 'Polos', brand: 'Hawk' },
];

const OrdersPage: React.FC = () => {
    const { cart, updateCartItemQuantity, removeFromCart, setView, addToCart } = useApp();
    
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const subtotalForClient = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const totalGain = subtotalForClient * 0.20; // Assuming 20% gain
    const subtotalForYou = subtotalForClient - totalGain;
    
    const prizeGoal = 200;
    const amountToPrize = Math.max(0, prizeGoal - subtotalForYou);
    const prizeProgress = Math.min((subtotalForYou / prizeGoal) * 100, 100);

    const handleSearch = (term: string, field: 'code' | 'description') => {
        if (field === 'code') setCode(term);
        if (field === 'description') setDescription(term);
        setSelectedProduct(null);

        if (term.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const lowerCaseTerm = term.toLowerCase();
        const results = allProducts.filter(p => 
            (field === 'code' && p.id.toString().includes(term)) ||
            (field === 'description' && p.name.toLowerCase().includes(lowerCaseTerm))
        );

        if (results.length === 1) {
            const exactMatch = results[0];
            const isExactCode = field === 'code' && exactMatch.id.toString() === term;
            const isExactDescription = field === 'description' && exactMatch.name.toLowerCase() === lowerCaseTerm;
            if (isExactCode || isExactDescription) {
                 setTimeout(() => handleSelectProduct(exactMatch), 50);
                 return;
            }
        }

        setSearchResults(results);
    };

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setCode(product.id.toString());
        setDescription(product.name);
        setSearchResults([]);
    };
    
    const handleAddToCart = () => {
        if (selectedProduct) {
            addToCart(selectedProduct, quantity);
            // Reset form
            setCode('');
            setDescription('');
            setQuantity(1);
            setSize('');
            setSelectedProduct(null);
        } else {
            alert("Por favor, busca y selecciona un producto de la lista.");
        }
    };


    return (
        <div className="relative min-h-screen">
            <div className="text-sm text-gray-500 mb-4">INICIO | PEDIDOS</div>

            <div className="flex flex-col xl:flex-row gap-8">
                {/* Left side: Main Content */}
                <div className="flex-1">
                    <div className="bg-[#fcefee] p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-xl font-bold text-center mb-4 text-black uppercase">Ingresa tu pedido</h2>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center relative">
                           <div className="md:col-span-2">
                               <input type="text" value={code} placeholder="Código" onChange={e => handleSearch(e.target.value, 'code')} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                           </div>
                           <div className="md:col-span-3">
                                <input type="text" value={description} placeholder="Descripcion de producto" onChange={e => handleSearch(e.target.value, 'description')} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                           </div>
                           {searchResults.length > 0 && (
                                <div className="absolute top-full left-0 bg-white border shadow-lg z-10 rounded-b-lg max-h-60 overflow-y-auto w-full md:w-5/12">
                                    {searchResults.map(p => (
                                        <div key={p.id} onClick={() => handleSelectProduct(p)} className="p-2 cursor-pointer hover:bg-gray-100 text-sm">
                                            {p.id} - {p.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                           <div className="md:col-span-1">
                                <input type="text" value={size} placeholder="Talla" onChange={e => setSize(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                           </div>
                           <div className="md:col-span-1 flex justify-center">
                                <div className="flex items-stretch bg-white border border-gray-300 rounded-lg h-[44px]">
                                    <input
                                        type="text"
                                        readOnly
                                        value={quantity}
                                        className="w-10 text-center focus:outline-none rounded-l-lg text-sm"
                                    />
                                    <div className="border-l border-gray-300 flex flex-col">
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((q) => q + 1)}
                                            className="flex-1 px-1.5 text-gray-600 hover:bg-gray-100 text-xs rounded-tr-lg"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                            className="flex-1 px-1.5 text-gray-600 border-t border-gray-200 hover:bg-gray-100 text-xs rounded-br-lg"
                                            aria-label="Decrease quantity"
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                           </div>
                           <div className="md:col-span-3">
                               <input type="text" placeholder="Cliente (Opcional)" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm" />
                           </div>
                           <div className="md:col-span-2">
                                <button onClick={handleAddToCart} className="w-full bg-red-600 text-white font-bold py-2.5 rounded-lg hover:bg-red-700 h-[44px]">Agregar</button>
                           </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="mb-6">
                            <div className="flex items-center text-sm mb-2">
                                <GiftIcon className="w-5 h-5 mr-2 text-gray-600"/>
                                <span>Te faltan <span className="font-bold">S/. {amountToPrize.toFixed(2)}</span> para alcanzar tu premio</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: `${prizeProgress}%` }}></div>
                            </div>
                        </div>

                        <p className="font-semibold mb-4 text-gray-700">Has agregado {cart.length} productos</p>
                        
                        {cart.length === 0 ? (
                             <div className="text-center py-10 text-gray-500">
                                Tu carrito de compras está vacío.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map(item => (
                                    <div key={item.product.id} className="grid grid-cols-12 gap-4 items-center border-b pb-4">
                                        <div className="col-span-3 sm:col-span-2">
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-auto object-cover rounded"/>
                                        </div>
                                        <div className="col-span-9 sm:col-span-10 flex flex-wrap items-center">
                                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                                                <p className="text-xs text-gray-600">{item.product.id}</p>
                                                <p className="font-semibold text-sm text-gray-900">{item.product.name}</p>
                                                <p className="text-xs text-gray-600">Talla {item.size} | Color {item.color}</p>
                                                <p className="text-xs text-red-600 font-semibold cursor-pointer">Catálogo</p>
                                            </div>
                                            <div className="w-1/2 sm:w-[12%] text-center text-sm">
                                                <p className="text-xs text-gray-600 hidden sm:block">Precio catálogo</p>
                                                <p className="font-bold text-gray-900">S/ {item.product.price.toFixed(2)}</p>
                                            </div>
                                            <div className="w-1/2 sm:w-[10%] text-center text-sm">
                                                <p className="text-xs text-gray-600 hidden sm:block">Dscto. %</p>
                                                <p className="font-bold text-gray-900">20%</p>
                                            </div>
                                            <div className="w-1/2 sm:w-[15%] text-center text-sm">
                                                <p className="text-xs text-gray-600 hidden sm:block">Monto a pagar</p>
                                                <p className="font-bold text-gray-900">S/ {(item.product.price * 0.8).toFixed(2)}</p>
                                            </div>
                                            <div className="w-1/2 sm:w-[15%] text-center text-sm">
                                                <p className="text-xs text-gray-600 hidden sm:block">Sub total</p>
                                                <p className="font-bold text-gray-900 bg-gray-200 rounded px-2 py-1 inline-block">S/ {(item.product.price * 0.8 * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <div className="w-full sm:w-auto flex items-center justify-center space-x-2 mt-2 sm:mt-0 ml-auto">
                                                <div className="flex items-center border rounded">
                                                    <button onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 text-lg">-</button>
                                                    <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                                    <button onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 text-lg">+</button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-600 p-1">
                                                    <Trash2Icon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Summary */}
                <div className="w-full xl:w-80 flex-shrink-0">
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
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-xl font-bold text-center mb-4">Resumen de pedido</h3>
                            <div className="space-y-3 text-gray-700 text-sm">
                                <div className="flex justify-between">
                                    <p>Precio Catálogo</p>
                                    <p>S/ {subtotalForClient.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Tu ganancia</p>
                                    <p>S/ {totalGain.toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between font-bold text-base p-3 bg-rose-50 rounded-md">
                                    <p>Total a pagar</p>
                                    <p>S/ {subtotalForYou.toFixed(2)}</p>
                                </div>
                            </div>
                             <button 
                                onClick={() => setView(View.CHECKOUT)}
                                disabled={cart.length === 0}
                                className="w-full bg-red-600 text-white mt-6 py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:bg-gray-400"
                            >
                                Reservar pedido
                            </button>
                        </div>
                         <div className="rounded-lg overflow-hidden shadow-md cursor-pointer">
                           <img src="https://topitoprepo1-nlqt.vercel.app/assets/gana-mas-banner-u6uR9Fso.png" className="w-full" alt="gana mas" />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Floating WhatsApp Icon */}
             <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-20">
                <svg xmlns="http://www.w.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.516 1.905 6.471l-1.298 4.753 4.853-1.276z"/></svg>
            </a>
        </div>
    );
};

export default OrdersPage;
