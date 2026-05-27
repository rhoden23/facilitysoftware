import React, { useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import InventoryList from '../components/Inventory/InventoryList';

const InventoryView = ({ items, onAddItem, onUpdateItemStatus, onEditItem, onDeleteItem }) => {
    const validItems = Array.isArray(items) ? items : [];
    // Memoize categorized lists
    const groceries = useMemo(() => validItems.filter(i => i.category === 'Groceries'), [validItems]);
    const supplies = useMemo(() => validItems.filter(i => i.category === 'Medical Supplies'), [validItems]);
    const household = useMemo(() => validItems.filter(i => i.category === 'Household Supplies'), [validItems]);
    const office = useMemo(() => validItems.filter(i => i.category === 'Office Supplies'), [validItems]);
    const other = useMemo(() => validItems.filter(i => !['Groceries', 'Medical Supplies', 'Household Supplies', 'Office Supplies'].includes(i.category)), [validItems]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
                <div className="flex items-center space-x-2">
                    {/* Removed AI Shopping List Button */}
                    <button onClick={onAddItem} className="flex items-center bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 shadow"><PlusCircle className="w-5 h-5 mr-2" />Add Item</button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <InventoryList title="Grocery List" items={groceries} onUpdateStatus={onUpdateItemStatus} onEdit={onEditItem} onDelete={onDeleteItem} />
                <InventoryList title="Medical Supplies" items={supplies} onUpdateStatus={onUpdateItemStatus} onEdit={onEditItem} onDelete={onDeleteItem} />
                <InventoryList title="Household Supplies" items={household} onUpdateStatus={onUpdateItemStatus} onEdit={onEditItem} onDelete={onDeleteItem} />
                <InventoryList title="Office Supplies" items={office} onUpdateStatus={onUpdateItemStatus} onEdit={onEditItem} onDelete={onDeleteItem} />
                <InventoryList title="Other" items={other} onUpdateStatus={onUpdateItemStatus} onEdit={onEditItem} onDelete={onDeleteItem} />
            </div>
        </div>
    );
};

export default InventoryView;