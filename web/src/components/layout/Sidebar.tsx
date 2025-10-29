"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronDownIcon, ChevronUpIcon, HomeIcon, ShoppingCartIcon, BookOpenIcon, PackageIcon, GiftIcon, XIcon } from '@/components/icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [ayudaOpen, setAyudaOpen] = React.useState(false);
  const [legalOpen, setLegalOpen] = React.useState(false);

  const navItems = [
    { icon: <HomeIcon className="w-5 h-5" />, label: 'Inicio', href: '/dashboard' },
    { icon: <ShoppingCartIcon className="w-5 h-5" />, label: 'Pedidos', href: '/orders' },
    { icon: <BookOpenIcon className="w-5 h-5" />, label: 'Catálogos', href: '/catalogos' },
    { icon: <PackageIcon className="w-5 h-5" />, label: 'Productos', href: '/products' },
    { icon: <GiftIcon className="w-5 h-5" />, label: 'Premios', href: '/prizes' },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md flex-shrink-0 flex flex-col transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <img className="h-12 w-12 rounded-full object-cover" src="https://picsum.photos/seed/woman/200" alt="User avatar" />
          <div className="ml-4">
            <p className="font-semibold text-gray-800">¡Hola MARIELA!</p>
            <Link href="#" className="text-sm text-gray-600 hover:text-red-600">Ver mi perfil</Link>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 mt-6 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className="flex items-center w-full px-6 py-3 text-left transition-colors duration-200 justify-start text-gray-600 hover:bg-gray-200">
            <span className="mr-4">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        <div className="mt-8 px-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Otros accesos</p>
        </div>

        <div className="mt-2">
          <button onClick={() => setAyudaOpen(!ayudaOpen)} className="flex items-center justify-between w-full px-6 py-3 text-left text-gray-600 hover:bg-gray-200">
            <span className="font-medium">Ayuda</span>
            {ayudaOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>
          {ayudaOpen && (
            <div className="pl-10 pb-2 text-sm text-gray-500 space-y-2">
              <a href="#" className="block hover:text-red-600">Preguntas Frecuentes</a>
              <a href="#" className="block hover:text-red-600">Contactar a Soporte</a>
              <a href="#" className="block hover:text-red-600">Guía de Usuario</a>
            </div>
          )}
        </div>

        <div>
          <button onClick={() => setLegalOpen(!legalOpen)} className="flex items-center justify-between w-full px-6 py-3 text-left text-gray-600 hover:bg-gray-200">
            <span className="font-medium">Legal</span>
            {legalOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
          </button>
          {legalOpen && (
            <div className="pl-10 pb-2 text-sm text-gray-500 space-y-2">
              <a href="#" className="block hover:text-red-600">Términos y Condiciones</a>
              <a href="#" className="block hover:text-red-600">Política de Privacidad</a>
            </div>
          )}
        </div>
      </nav>

      <div className="p-6 mt-auto">
        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <img className="h-10 w-10 rounded-full object-cover" src="https://picsum.photos/seed/support/200" alt="Support" />
          <div className="ml-3 text-left">
            <p className="text-sm font-semibold text-gray-800">Chatea con Diana</p>
          </div>
        </a>
      </div>
    </div>
  );
}
