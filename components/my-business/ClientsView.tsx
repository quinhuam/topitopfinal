import React, { useState } from 'react';
import { SearchIcon, PlusCircleIcon, EditIcon, Trash2Icon, XIcon } from '../icons';

type Client = {
    id: number;
    name: string;
    lastName: string;
    phone: string;
    cellphone: string;
    email: string;
};

const initialClients: Client[] = [
    { id: 1, name: 'David Daniel', lastName: 'Murillo Campos', phone: '0123456789', cellphone: '987654321', email: 'davidmurillo@gmail.pe' },
    { id: 2, name: 'Maria Clara', lastName: 'Dammert Altan', phone: '0124343259', cellphone: '943654945', email: 'damert0921@gmail.pe' },
    { id: 3, name: 'Zulema Sara', lastName: 'Carman Thorn', phone: '0123456789', cellphone: '976654765', email: 'sara73232@gmail.pe' },
    { id: 4, name: 'Lorena Olga', lastName: 'Quispe Sarda', phone: '012345439', cellphone: '9127654343', email: 'dolga432432@gmail.pe' },
];

const ClientModal: React.FC<{ client: Client | null, onClose: () => void, onSave: (client: Client) => void }> = ({ client, onClose, onSave }) => {
    const [formData, setFormData] = useState<Client>(client || { id: Date.now(), name: '', lastName: '', phone: '', cellphone: '', email: '' });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{client ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
                    <button onClick={onClose}><XIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Nombres" className="border p-2 rounded" />
                        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Apellidos" className="border p-2 rounded" />
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Teléfono Fijo" className="border p-2 rounded" />
                        <input name="cellphone" value={formData.cellphone} onChange={handleChange} placeholder="Celular" className="border p-2 rounded" />
                        <input name="email" value={formData.email} onChange={handleChange} placeholder="Correo" className="border p-2 rounded md:col-span-2" />
                    </div>
                    <div className="flex justify-end mt-6">
                        <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DeleteConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void }> = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4">Confirmar Eliminación</h2>
            <p className="text-gray-600 mb-6">¿Estás seguro de que quieres eliminar a este cliente?</p>
            <div className="flex justify-center space-x-4">
                <button onClick={onCancel} className="px-6 py-2 bg-gray-200 rounded">Cancelar</button>
                <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded">Eliminar</button>
            </div>
        </div>
    </div>
);

const ClientsView: React.FC = () => {
    const [clients, setClients] = useState<Client[]>(initialClients);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [deletingClientId, setDeletingClientId] = useState<number | null>(null);

    const handleSaveClient = (client: Client) => {
        if (editingClient) {
            setClients(clients.map(c => c.id === client.id ? client : c));
        } else {
            setClients([...clients, { ...client, id: Date.now() }]);
        }
        setEditingClient(null);
    };
    
    const handleDeleteClient = () => {
        if(deletingClientId === null) return;
        setClients(clients.filter(c => c.id !== deletingClientId));
        setDeletingClientId(null);
    };

    return (
        <div className="bg-white p-4 sm:p-8 rounded-lg shadow-md">
            {isModalOpen && <ClientModal client={editingClient} onClose={() => { setIsModalOpen(false); setEditingClient(null); }} onSave={handleSaveClient} />}
            {deletingClientId !== null && <DeleteConfirmationModal onConfirm={handleDeleteClient} onCancel={() => setDeletingClientId(null)} />}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Mis clientes</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-4 w-full sm:w-auto">
                    <button className="text-sm text-center p-2 border rounded-lg">Descargar Excel</button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700">
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Agregar clientes
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-700">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                        <tr>
                            <th className="p-4">NOMBRES</th>
                            <th className="p-4">APELLIDOS</th>
                            <th className="p-4">TELÉFONO FIJO</th>
                            <th className="p-4">CELULAR</th>
                            <th className="p-4">CORREO</th>
                            <th className="p-4">EDITAR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                             <tr key={client.id} className="border-b">
                                <td className="p-4 whitespace-nowrap">{client.name}</td>
                                <td className="p-4 whitespace-nowrap">{client.lastName}</td>
                                <td className="p-4 whitespace-nowrap">{client.phone}</td>
                                <td className="p-4 whitespace-nowrap">{client.cellphone}</td>
                                <td className="p-4 whitespace-nowrap">{client.email}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button onClick={() => { setEditingClient(client); setIsModalOpen(true);}} className="text-gray-500 hover:text-red-600"><EditIcon className="w-5 h-5" /></button>
                                        <button onClick={() => setDeletingClientId(client.id)} className="text-gray-500 hover:text-red-600"><Trash2Icon className="w-5 h-5" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientsView;