import React, { useState } from 'react';
import { Wind, WaterLevel, Thermometer, Cloudy } from '@icon-park/react';
import { useForm, FieldValues } from 'react-hook-form'; // Make sure to install react-hook-form
import { fetchWithL402 } from "@getalby/lightning-tools";

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

const placeholder_weather: WeatherData = {
    temperature: '',
    conditionText: '',
    iconUrl: 'http://cdn.weatherapi.com/weather/64x64/day/116.png',
    wind: '',
    humidity: '',
    feelsLike: '',
    cloud: '',
};

const CurrentWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(placeholder_weather);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState } = useForm();
    const [city, setCity] = useState<string>('Waterford, IE');


    const fetchWeather = async (city: string) => {
        try {
            setIsLoading(true);
            const formatted_city = city.replace(/\s/g, '');
            console.log(formatted_city)
            const response = await fetchWithL402(`https://weatherman.ln.sulu.sh/current?city=${formatted_city}`, 
            {}, 
            {headerKey: "L402"})

            const { current } = await response.json();

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

    const onSubmit = (data: FieldValues) => {
        setCity(data.cityInput);
        fetchWeather(data.cityInput);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return weather ? (
        <div className="bg-white text-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">LN Weather</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
                <input
                    {...register("cityInput")}
                    name="cityInput"
                    className="p-2 text-gray-700 border rounded shadow-inner mb-4"
                    placeholder="Enter city"
                    defaultValue={city}
                />
                {formState.errors.cityInput && <p className="text-red-500">City is required.</p>}
                <button type="submit" className="mx-4 bg-blue-500 text-white p-2 rounded shadow">
                    Get Weather
                </button>
            </form>
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
