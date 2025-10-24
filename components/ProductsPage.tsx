
import React, { useState, useMemo, useEffect } from 'react';
// FIX: Add .tsx/.ts extensions to fix module resolution errors.
import { useApp } from '../App.tsx';
import { ChevronDownIcon, ChevronUpIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import { Product } from '../types.ts';

// Mock Data Enhanced
const initialProducts: Product[] = [
    { id: 110737, name: 'Polera Franela - Pink Rose', price: 50.00, image: '/images/products/57b70hem.png', gender: 'Mujer', category: 'Poleras', brand: 'Topitop' },
    { id: 110738, name: 'Short Mujer Madeleine - Celeste Indigo', price: 25.00, image: '/images/products/0wfw82nb.png', gender: 'Mujer', category: 'Shorts', brand: 'Hawk' },
    { id: 110739, name: 'Jean Mujer Zara - Total Bleach', price: 89.90, image: '/images/products/73h54yeq.png', gender: 'Mujer', category: 'Jeans', brand: 'Topitop' },
    { id: 110740, name: 'Blusa Manga Larga - White', price: 45.00, image: '/images/products/n0jdiufd.png', gender: 'Mujer', category: 'Blusas', brand: 'Xiomi' },
    { id: 110741, name: 'Polo Básico - Black', price: 29.90, image: '/images/products/3038ukk9.png', gender: 'Hombre', category: 'Polos', brand: 'Hawk' },
    { id: 110742, name: 'Pantalón Cargo - Beige', price: 99.90, image: '/images/products/70st97zk.png', gender: 'Hombre', category: 'Pantalones', brand: 'Topitop' },
    { id: 110743, name: 'Casaca Hombre Eryc Camel', price: 129.90, image: '/images/products/aqhko8jj.png', gender: 'Hombre', category: 'Casacas', brand: 'Hawk' },
    { id: 110745, name: 'Vestido Estampado - Floral', price: 69.90, image: '/images/products/f4cqeci9.png', gender: 'Mujer', category: 'Vestidos', brand: 'Topitop' },
    { id: 110750, name: 'Polo Hombre System - Negro', price: 35.00, image: '/images/products/b2kdhbxu.png', gender: 'Hombre', category: 'Polos', brand: 'Hawk' },
    { id: 110748, name: 'Camisa Leñador - Red Plaid', price: 75.00, image: '/images/products/4mozfkre.png', gender: 'Hombre', category: 'Camisas', brand: 'Topitop' },
    { id: 110749, name: 'Falda Mini - Black', price: 55.00, image: '/images/products/kosm5slj.png', gender: 'Mujer', category: 'Faldas', brand: 'Hawk' },
];

const categories = [...new Set(initialProducts.map(p => p.category))];
const brands = [...new Set(initialProducts.map(p => p.brand))];
const priceRanges = [
    { label: 'Hasta S/.30', max: 30 },
    { label: 'S/.30 - S/.50', min: 30, max: 50 },
    { label: 'S/.50 - S/.70', min: 50, max: 70 },
    { label: 'S/.70 a más', min: 70 },
];
const PRODUCTS_PER_PAGE = 9;

const FilterSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full font-semibold mb-2">
                {title}
                {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
            </button>
            {isOpen && <div className="pl-2">{children}</div>}
        </div>
    );
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const { addToCart } = useApp();
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-150 object-cover" />
            </div>
            <div className="p-4">
                <p className="text-sm text-gray-500">{product.id}</p>
                <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                <div className="flex justify-between items-center mt-2">
                    <div>
                        <p className="text-xs text-gray-500">Para tu cliente:</p>
                        <p className="font-bold text-gray-800">S/ {product.price.toFixed(2)}</p>
                    </div>
                     <div>
                        <p className="text-xs text-red-600">Para ti:</p>
                        <p className="font-bold text-red-600">S/ {(product.price * 0.8).toFixed(2)}</p>
                    </div>
                </div>
                 <button onClick={() => addToCart(product, 1)} className="w-full mt-3 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
                    Agregar al carrito
                </button>
            </div>
        </div>
    )
};

const Pagination: React.FC<{ currentPage: number, totalPages: number, onPageChange: (page: number) => void }> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-8">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50">
                <ChevronLeftIcon className="w-5 h-5" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
                <button 
                    key={i} 
                    onClick={() => onPageChange(i + 1)} 
                    className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-semibold ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'hover:bg-gray-200'}`}
                >
                    {i + 1}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50">
                <ChevronRightIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


const ProductsPage: React.FC = () => {
    const { activeProductCategory, setActiveProductCategory } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1); // Reset page when filters change
    }, [activeProductCategory, debouncedSearchTerm, selectedCategories, selectedBrands, selectedPriceRanges]);

    const handleFilterChange = (filterType: 'category' | 'brand' | 'price', value: string) => {
        const setters = {
            category: setSelectedCategories,
            brand: setSelectedBrands,
            price: setSelectedPriceRanges,
        };
        const states = {
            category: selectedCategories,
            brand: selectedBrands,
            price: selectedPriceRanges,
        };

        const currentValues = states[filterType];
        const setter = setters[filterType];
        
        if (currentValues.includes(value)) {
            setter(currentValues.filter(item => item !== value));
        } else {
            setter([...currentValues, value]);
        }
    };
    
    const topLevelCategories = ['Mujer', 'Hombre', 'Niños', 'Hogar'];

    const filteredProducts = useMemo(() => {
        let products = initialProducts;

        if (activeProductCategory) {
            products = products.filter(p => p.gender === activeProductCategory);
        }

        if (debouncedSearchTerm) {
            products = products.filter(p => p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
        }

        if (selectedCategories.length > 0) {
            products = products.filter(p => selectedCategories.includes(p.category));
        }
        
        if (selectedBrands.length > 0) {
            products = products.filter(p => selectedBrands.includes(p.brand));
        }

        if (selectedPriceRanges.length > 0) {
            products = products.filter(p => {
                return selectedPriceRanges.some(rangeLabel => {
                    const range = priceRanges.find(r => r.label === rangeLabel);
                    if (!range) return false;
                    const price = p.price;
                    const minMatch = range.min ? price >= range.min : true;
                    const maxMatch = range.max ? price < range.max : true;
                    return minMatch && maxMatch;
                });
            });
        }
        
        return products;
    }, [activeProductCategory, debouncedSearchTerm, selectedCategories, selectedBrands, selectedPriceRanges]);

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

    return (
        <div>
            <div className="text-sm text-gray-500 mb-4">INICIO | PRODUCTOS</div>
            <div className="bg-gray-300 rounded-lg h-48 mb-8 flex items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('https://picsum.photos/seed/fashion-banner/1200/300')"}}>
                 <div className="text-center text-white bg-black/30 p-4 rounded">
                    <h2 className="text-4xl font-bold">BLUSAS</h2>
                    <p>NUEVOS INGRESOS</p>
                </div>
            </div>

             <div className="flex justify-center border-b mb-6 overflow-x-auto">
                {['Todo', ...topLevelCategories].map(cat => (
                     <button 
                        key={cat}
                        onClick={() => setActiveProductCategory(cat === 'Todo' ? null : cat)}
                        className={`py-2 px-4 font-semibold text-sm whitespace-nowrap ${ (activeProductCategory === cat || (!activeProductCategory && cat === 'Todo')) ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-red-500'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <h3 className="font-bold text-lg mb-4">Filtrar por:</h3>
                    <div className="space-y-6">
                        <FilterSection title="CATEGORÍA">
                             <ul className="space-y-2 text-sm text-gray-700">
                                {categories.map(cat => (
                                    <li key={cat}><label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" onChange={() => handleFilterChange('category', cat)} checked={selectedCategories.includes(cat)} />{cat}</label></li>
                                ))}
                            </ul>
                        </FilterSection>
                        <FilterSection title="MARCA">
                            <ul className="space-y-2 text-sm text-gray-700">
                                {brands.map(brand => (
                                    <li key={brand}><label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" onChange={() => handleFilterChange('brand', brand)} checked={selectedBrands.includes(brand)}/>{brand}</label></li>
                                ))}
                            </ul>
                        </FilterSection>
                        <FilterSection title="PRECIO">
                             <ul className="space-y-2 text-sm text-gray-700">
                                {priceRanges.map(range => (
                                    <li key={range.label}><label className="flex items-center"><input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" onChange={() => handleFilterChange('price', range.label)} checked={selectedPriceRanges.includes(range.label)}/>{range.label}</label></li>
                                ))}
                            </ul>
                        </FilterSection>
                    </div>
                </aside>
                
                {/* Products Grid */}
                <main className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                         <input
                            type="text"
                            placeholder="Buscar producto por nombre..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full sm:w-auto border rounded-md py-2 px-4"
                        />
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Ordenar por:</span>
                            <button className="flex items-center text-sm font-semibold border rounded-md px-3 py-2 hover:bg-gray-100">
                                Precio <ChevronDownIcon className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginatedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </main>
            </div>
        </div>
    );
};

export default ProductsPage;