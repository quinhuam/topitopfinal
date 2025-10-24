
import React from 'react';
// FIX: Add .tsx/.ts extensions to fix module resolution errors.
import { useApp } from '../App.tsx';
import { View } from '../types.ts';
import { HomeIcon, ShoppingCartIcon, BookOpenIcon, PackageIcon, GiftIcon, ChevronDownIcon, ChevronUpIcon, XIcon } from './icons';

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  view: View;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { view, setView } = useApp();
  const [ayudaOpen, setAyudaOpen] = React.useState(false);
  const [legalOpen, setLegalOpen] = React.useState(false);

  const handleSetView = (targetView: View) => {
    setView(targetView);
    setIsOpen(false);
  };

  const NavLink: React.FC<NavLinkProps> = ({ icon, label, view: targetView }) => {
    const isActive = view === targetView;
    return (
      <button
        onClick={() => handleSetView(targetView)}
        className={`flex items-center w-full px-6 py-3 text-left transition-colors duration-200 justify-start ${
          isActive
            ? 'bg-red-50 text-red-600 border-r-4 border-red-600'
            : 'text-gray-600 hover:bg-gray-200'
        }`}
      >
        <span className="mr-4">{icon}</span>
        <span className="font-medium">{label}</span>
      </button>
    );
  };
  
  const navItems: NavLinkProps[] = [
    { icon: <HomeIcon className="w-5 h-5" />, label: 'Inicio', view: View.DASHBOARD },
    { icon: <ShoppingCartIcon className="w-5 h-5" />, label: 'Pedidos', view: View.ORDERS },
    { icon: <BookOpenIcon className="w-5 h-5" />, label: 'Catálogos', view: View.CATALOGS },
    { icon: <PackageIcon className="w-5 h-5" />, label: 'Productos', view: View.PRODUCTS },
    { icon: <GiftIcon className="w-5 h-5" />, label: 'Premios', view: View.PRIZES },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md flex-shrink-0 flex flex-col transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <img className="h-12 w-12 rounded-full object-cover" src="https://picsum.photos/seed/woman/200" alt="User avatar" />
          <div className="ml-4">
            <p className="font-semibold text-gray-800">¡Hola MARIELA!</p>
            <button onClick={() => handleSetView(View.PROFILE)} className="text-sm text-gray-600 hover:text-red-600">Ver mi perfil</button>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <XIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 mt-6 overflow-y-auto">
        {navItems.map(item => <NavLink key={item.label} {...item} />)}
        
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
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
            <img className="h-10 w-10 rounded-full object-cover" src="https://picsum.photos/seed/support/200" alt="Support" />
            <div className="ml-3 text-left">
                <p className="text-sm font-semibold text-gray-800">Chatea con Diana</p>
            </div>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;