
import React, { useState } from 'react';
import { PlusCircleIcon, EditIcon, ChevronLeftIcon } from './icons';

const AddAddressModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex items-center mb-6">
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800 ml-4">Agregar dirección</h2>
                </div>
                <form>
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Departamento:</label>
                            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                                <option>Selecciona un departamento</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Provincia:</label>
                            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                                <option>Selecciona una provincia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Distrito:</label>
                            <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                                <option>Selecciona un distrito</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Avenida / Calle / Jirón:</label>
                            <input type="text" placeholder="Ingresa el nombre de la calle" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Número:</label>
                            <input type="text" placeholder="Ingresa el número de la calle" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dpto. / Casa / Oficina / Condominio (Opcional):</label>
                            <input type="text" placeholder="Ejm. Casa 3, Dpto. 01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="mt-8">
                        <button type="button" onClick={onClose} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300">
                            Confirmar dirección
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProfilePage: React.FC = () => {
    const [isAddingAddress, setIsAddingAddress] = useState(false);

    const EditableField: React.FC<{ label: string; value: string; isProtected?: boolean; }> = ({ label, value, isProtected = false }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [currentValue, setCurrentValue] = useState(value);

        return (
            <div className="flex items-center justify-between py-4 border-b">
                <div>
                    <p className="text-gray-500">{label}</p>
                    {isEditing ? (
                        <input 
                            type={isProtected ? "password" : "text"}
                            value={currentValue}
                            onChange={(e) => setCurrentValue(e.target.value)}
                            className="text-gray-800 font-semibold bg-gray-100 p-1 rounded"
                        />
                    ) : (
                        <p className="text-gray-800 font-semibold">{isProtected ? '************' : value}</p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setIsEditing(!isEditing)} className="flex items-center text-sm text-gray-600 hover:text-red-600">
                        <EditIcon className="w-4 h-4 mr-1" />
                        {isEditing ? 'Cancelar' : 'Editar'}
                    </button>
                    {isEditing && (
                        <button onClick={() => setIsEditing(false)} className="bg-red-600 text-white text-sm px-3 py-1 rounded-md hover:bg-red-700">
                            Confirmar
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            {isAddingAddress && <AddAddressModal onClose={() => setIsAddingAddress(false)} />}
            <div className="text-sm text-gray-500 mb-4">INICIO | MI PERFIL</div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                <div className="flex flex-col items-center text-center border-b pb-6 mb-6">
                    <img src="https://picsum.photos/seed/woman/200" alt="Mariela" className="w-24 h-24 rounded-full mb-4" />
                    <h2 className="text-xl font-bold text-gray-800">MARIELA ESTHER MOLINA DURAND</h2>
                    <p className="text-gray-600">Código: 0499 | Zona: 0012</p>
                    <p className="text-gray-600">Líder de Zona: JULIA ROBLES SUAREZ</p>
                    <p className="text-gray-600">Celular LZ: 921853478</p>
                </div>

                <h3 className="text-lg font-bold text-gray-500 mb-4">MIS DATOS</h3>
                
                <EditableField label="¿Como quieres que te llamemos?" value="Mariela" />
                <EditableField label="Contraseña" value="password" isProtected />
                <EditableField label="Correo Electrónico*" value="mariela_md@gmail.com" />
                
                <div className="flex items-center justify-between py-4 border-b">
                    <div>
                        <p className="text-gray-500">Celular*</p>
                        <p className="text-gray-800 font-semibold">987654321</p>
                        <div className="flex items-center mt-2">
                            <input type="checkbox" id="receive-tips" className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                            <label htmlFor="receive-tips" className="ml-2 text-sm text-gray-600">Quiero recibir tips, ofertas, capacitaciones y más</label>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center text-sm text-gray-600 hover:text-red-600">
                            <EditIcon className="w-4 h-4 mr-1" />
                            Editar
                        </button>
                    </div>
                </div>

                <EditableField label="Numero fijo" value="321456789" />
                <button className="flex items-center text-red-600 font-semibold py-4 border-b w-full hover:text-red-700">
                    <PlusCircleIcon className="w-6 h-6 mr-2" />
                    AGREGAR NÚMERO
                </button>
                
                <EditableField label="Dirección" value="Av. Las Flores 748 Int. 302, San Miguel, Lima" />
                <button onClick={() => setIsAddingAddress(true)} className="flex items-center text-red-600 font-semibold py-4 w-full hover:text-red-700">
                    <PlusCircleIcon className="w-6 h-6 mr-2" />
                    AGREGAR DIRECCIÓN
                </button>

                <div className="mt-8">
                    <div className="flex items-center">
                        <input type="checkbox" id="terms" className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                        <label htmlFor="terms" className="ml-2 text-sm text-gray-600">(*) Estoy de acuerdo con los términos y condiciones sobre Protección de datos personales</label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">(*) Datos obligatorios</p>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 transition">
                        GUARDAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
