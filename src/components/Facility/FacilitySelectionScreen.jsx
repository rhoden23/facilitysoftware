
import React from 'react';

const FacilitySelectionScreen = ({ facilities, onSelect, onAddNew }) => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800">Select a Facility</h2>
                    <p className="mt-2 text-gray-500">Choose the facility you want to manage.</p>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {/* Handle case where facilities might be loading or empty */}
                    {facilities && facilities.length > 0 ? (
                        facilities.map(facility => (
                            <button
                                key={facility.id}
                                onClick={() => onSelect(facility)}
                                className="w-full px-4 py-4 font-semibold text-lg text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
                            >
                                {facility.name}
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No facilities found. Please create one.</p>
                    )}
                </div>
                <div className="border-t pt-4">
                    <button
                        onClick={onAddNew}
                        className="w-full px-4 py-3 font-semibold text-emerald-600 bg-emerald-100 rounded-lg hover:bg-emerald-200"
                    >
                        + Create New Facility
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FacilitySelectionScreen;
