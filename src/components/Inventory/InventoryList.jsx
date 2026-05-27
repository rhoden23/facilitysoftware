import React from 'react';
import { ShoppingCart, Archive, Edit, Trash2 } from 'lucide-react';

const InventoryList = ({ title, items, onUpdateStatus, onEdit, onDelete }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="space-y-3 flex-grow overflow-y-auto max-h-96 pr-2"> {/* Added scrollbar styles */}
            {(Array.isArray(items) ? items : []).map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center group">
                    <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'Stocked' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                        <button onClick={() => onUpdateStatus(item.id, item.status === 'Needed' ? 'Stocked' : 'Needed')} className="p-1.5 rounded-full hover:bg-gray-200" title={`Mark as ${item.status === 'Needed' ? 'Stocked' : 'Needed'}`}>
                            {item.status === 'Needed' ? <ShoppingCart size={16} className="text-green-600" /> : <Archive size={16} className="text-yellow-800" />}
                        </button>
                        {/* Edit and Delete Buttons - Visible on hover */}
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(item)} className="p-1.5 rounded-full hover:bg-emerald-100 text-emerald-600 ml-1" title="Edit Item">
                                <Edit size={16} />
                            </button>
                            <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-full hover:bg-red-100 text-red-600 ml-1" title="Delete Item">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {(!Array.isArray(items) || items.length === 0) && (
                <p className="text-gray-500 text-center py-4">No items in this category yet.</p>
            )}
        </div>
    </div>
);

export default InventoryList;