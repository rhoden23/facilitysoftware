import React from 'react';

const Modal = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"> {/* Added padding */}
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"> {/* Added max-h & flex */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b"> {/* Adjusted padding */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl">&times;</button>
            </div>
            {/* Made content scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto">{children}</div>
        </div>
    </div>
);

export default Modal;