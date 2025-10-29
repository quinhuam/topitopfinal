"use client";

import React from 'react';
import Link from 'next/link';
import { SearchIcon, BellIcon, MenuIcon, ShoppingCartIcon } from '@/components/icons';

interface HeaderProps {
  setIsOpen: (isOpen: boolean) => void;
}

export default function Header({ setIsOpen }: HeaderProps) {
  const totalCartItems = 0; // TODO: conectar a estado real de carrito

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Izquierda: botón menú y logo */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600 mr-4"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <Link href="/dashboard">
              <img src="/images/logocatalogo-DOgmBwgp.jpg" alt="Topitop Logo" className="h-10 cursor-pointer" />
            </Link>
          </div>

          {/* Centro: navegación y búsqueda (desktop) */}
          <div className="flex-1 items-center justify-center space-x-6 hidden lg:flex">
            <Link href="#" className="font-semibold text-gray-700 hover:text-red-600">Mi negocio</Link>
            <Link href="/products?category=Mujer" className="font-semibold text-gray-700 hover:text-red-600">Mujer</Link>
            <Link href="/products?category=Hombre" className="font-semibold text-gray-700 hover:text-red-600">Hombre</Link>
            <Link href="/products?category=Niños" className="font-semibold text-gray-700 hover:text-red-600">Niños</Link>
            <Link href="/products?category=Hogar" className="font-semibold text-gray-700 hover:text-red-600">Hogar</Link>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </span>
              <input
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm leading-5 bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-400 focus:border-red-500"
                type="search"
                placeholder="Buscar en Topitop"
              />
            </div>
          </div>

          {/* Derecha: iconos y acciones */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:bg-gray-100 focus:text-gray-600">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <Link href="/orders" className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:bg-gray-100 focus:text-gray-600">
              <ShoppingCartIcon className="h-6 w-6" />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">{totalCartItems}</span>
              )}
            </Link>
            <div className="hidden sm:block text-center border-l pl-4">
              <p className="text-xs text-gray-500">Estás en:</p>
              <p className="text-sm font-bold text-red-600">C-01</p>
            </div>
            <Link href="/login" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-red-600 border-l pl-4">
              Cerrar sesión
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
