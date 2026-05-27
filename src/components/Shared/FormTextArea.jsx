import React from 'react';

const FormTextArea = ({ id, label, value, onChange, required = false, rows = 3, placeholder = '' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
        <textarea
            id={id}
            name={id}
            rows={rows}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        />
    </div>
);

export default FormTextArea;