import React from 'react';

interface WeatherCardProps {
  title: string;
  value: string;
  Icon: React.ComponentType<{ className: string }>;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ title, value, Icon }) => {
    return (
      <div className="bg-gray-100 text-gray-800 p-3 rounded-lg shadow-lg flex flex-col items-center justify-center">
        {Icon && <Icon className="w-6 h-6 mb-2 text-gray-700" />}
        <span className="text-xs font-medium">{title}</span>
        <span className="font-semibold">{value}</span>
      </div>
    );
  };

export default WeatherCard;
