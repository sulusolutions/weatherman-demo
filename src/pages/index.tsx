import { Inter } from 'next/font/google';
import CurrentWeather from '@/components/currentWeather';
import React, { useEffect, useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeader(false);
    }, 20000);

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, []);

  return (
    <>
      {showHeader && (
        <header className="sticky top-0 bg-yellow-300 p-4 text-black shadow-md transition-opacity duration-500">
          <p className="font-semibold">
            This app is lightning powered, consumes a weather L402 API, powered by <a href="https://www.sulu.sh" className="text-blue-500 hover:text-blue-800">Sulu</a>. 
            It requires the <a href="https://www.getalby.com" className="text-blue-500 hover:text-blue-800">Alby</a> browser extension, 
            or another <a href="https://www.webln.dev/" className="text-blue-500 hover:text-blue-800">WebLN</a> browser wallet to work.
          </p>
        </header>
      )}

      <main className={`flex min-h-screen flex-col items-center justify-between p-4 sm:p-24 ${inter.className}`}>
        <CurrentWeather />
      </main>
    </>
  );
}
