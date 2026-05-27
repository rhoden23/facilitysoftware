
import React from 'react';

const ErrorDisplay = ({ message }) => (<div className="flex items-center justify-center h-screen bg-red-50"><div className="text-center p-8 bg-white shadow-lg rounded-lg border border-red-200"><h2 className="text-2xl font-bold text-red-600">An Error Occurred</h2><p className="text-gray-600 mt-2">{message}</p></div></div>);

export default ErrorDisplay;
