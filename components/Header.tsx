import React from 'react';
// FIX: Add .tsx extension to fix module resolution error.
import { useApp } from '../App.tsx';
// FIX: Add .ts extension to fix module resolution error.
import { View } from '../types.ts';
import { SearchIcon, BellIcon, MenuIcon, ShoppingCartIcon } from './icons';

interface HeaderProps {
    setIsOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsOpen }) => {
    const { logout, setView, setActiveProductCategory, cart, toggleSliderVisibility } = useApp();
    const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleNavClick = (category: string) => {
      setActiveProductCategory(category);
      setView(View.PRODUCTS);
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side: Menu button and Logo */}
                    <div className="flex items-center">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="lg:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 mr-4"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                         {/* Desktop Menu/Banner Button */}
                        <button
                            onClick={toggleSliderVisibility}
                            className="hidden lg:block text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 mr-4"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <img src="https://topitoprepo1-nlqt.vercel.app/assets/logocatalogo-DOgmBwgp.jpg" alt="Topitop Logo" className="h-10 cursor-pointer" onClick={() => setView(View.DASHBOARD)} />
                    </div>

                    {/* Center: Main Navigation and Search */}
                    <div className="flex-1 flex items-center justify-center space-x-6 hidden lg:flex">
                         <div className="relative group">
                            <button className="font-semibold text-gray-700 hover:text-red-600">Mi negocio</button>
                         </div>
                         <button onClick={() => handleNavClick('Mujer')} className="font-semibold text-gray-700 hover:text-red-600">Mujer</button>
                         <button onClick={() => handleNavClick('Hombre')} className="font-semibold text-gray-700 hover:text-red-600">Hombre</button>
                         <button onClick={() => handleNavClick('Niños')} className="font-semibold text-gray-700 hover:text-red-600">Niños</button>
                         <button onClick={() => handleNavClick('Hogar')} className="font-semibold text-gray-700 hover:text-red-600">Hogar</button>
                         <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:border-red-500"
                                type="search"
                                placeholder="Buscar en Topitop"
                            />
                        </div>
                    </div>


                    {/* Right side: Icons, Profile, Logout */}
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:bg-gray-100 focus:text-gray-600">
                            <BellIcon className="h-6 w-6" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button onClick={() => setView(View.ORDERS)} className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:bg-gray-100 focus:text-gray-600">
                            <ShoppingCartIcon className="h-6 w-6" />
                             {totalCartItems > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">{totalCartItems}</span>
                             )}
                        </button>
                         <div className="hidden sm:block text-center border-l pl-4">
                            <p className="text-xs text-gray-500">Estás en:</p>
                            <p className="text-sm font-bold text-red-600">C-01</p>
                        </div>
                        <button
                            onClick={logout}
                            className="hidden sm:block text-sm font-medium text-gray-600 hover:text-red-600 border-l pl-4"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;