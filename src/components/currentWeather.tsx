import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wind, WaterLevel, Thermometer, Cloudy } from '@icon-park/react';

import WeatherCard from './weatherCard';

interface WeatherData {
    temperature: string;
    conditionText: string;
    iconUrl: string;
    wind: string;
    humidity: string;
    feelsLike: string;
    cloud: string;
}

const CurrentWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
                    params: {
                        key: '3ed0121b9d044816ad7140143230112', // Replace with your API key
                        q: 'Andorra la Vella', // Replace with the desired location
                    },
                });

                const { current } = response.data;

                setWeather({
                    temperature: current.temp_c,
                    conditionText: current.condition.text,
                    iconUrl: current.condition.icon,
                    wind: `${current.wind_kph} kph`,
                    humidity: `${current.humidity}`,
                    feelsLike: current.feelslike_c,
                    cloud: `${current.cloud}`,
                });
            } catch (err) {
                setError('Failed to fetch weather data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return weather ? (
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Current Weather</h2>
            <div className="flex items-center justify-between mb-4">
                <span className="font-medium">Temperature:</span>
                <span className="font-bold text-lg">{weather.temperature}°C</span>
            </div>
            <div className="flex items-center justify-between mb-6 flex-col">
                <div className="mb-2">
                    <img src={weather.iconUrl} className="w-24 h-24 mr-2 text-gray-700" alt="weather icon" />
                </div>
                <div>
                    <span className="font-medium">{weather.conditionText}</span>
                </div>
            </div>
            <WeatherDetails weather={weather} />
        </div>
    ) : null;
};

// Weather Details component
interface WeatherDetailsProps {
    weather: {
        temperature: string;
        conditionText: string;
        wind: string;
        humidity: string;
        feelsLike: string;
        cloud: string;
    };
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather }) => {
    return (
        <div>
            <div className="grid grid-cols-2 gap-4">
                <WeatherCard title="Wind" value={weather.wind} Icon={Wind} />
                <WeatherCard title="Humidity" value={`${weather.humidity}%`} Icon={WaterLevel} />
                <WeatherCard title="Real Feel" value={`${weather.feelsLike}°C`} Icon={Thermometer} />
                <WeatherCard title="Cloud Cover" value={`${weather.cloud}%`} Icon={Cloudy} />
            </div>
        </div>
    );
};

export default CurrentWeather;
