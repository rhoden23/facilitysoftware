
import React from 'react';

const StatCard = ({ title, value, icon, color }) => (<div className={`p-6 bg-white rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}><div className="flex-shrink-0">{icon}</div><div><p className="text-gray-500">{title}</p><p className="text-2xl font-semibold text-gray-900">{value}</p></div></div>);

export default StatCard;
