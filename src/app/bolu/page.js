'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';

export default function BoluPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [showVideo, setShowVideo] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPharmacies = async () => {
    try {
      // Tam URL oluştur
      const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL 
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL
        : window.location.origin;

      console.log('Using base URL:', baseUrl);
      
      const res = await fetch(`${baseUrl}/api/pharmacies/bolu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch pharmacies: ${res.status} ${errorText}`);
      }
      
      const data = await res.json();
      console.log('Received data:', data);
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  // Function to check if current time is between 15:00-16:00
  const checkTimeAndUpdate = () => {
    const now = new Date();
    const hours = now.getHours();
    setShowVideo(hours >= 15 && hours < 16);
  };

  useEffect(() => {
    console.log('Component mounted, starting fetch...');
    
    fetchPharmacies()
      .then(data => {
        if (data && data.pharmacies) {
          setPharmacies(data.pharmacies);
        } else {
          throw new Error('Invalid data format received');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error in useEffect:', err);
        setError(err.message);
        setLoading(false);
      });

    checkTimeAndUpdate();

    const now = new Date();
    const minutesToNextHour = 60 - now.getMinutes();
    const secondsToNextHour = 60 - now.getSeconds();
    const msToNextHour = (minutesToNextHour * 60 + secondsToNextHour) * 1000;

    const initialTimeout = setTimeout(() => {
      checkTimeAndUpdate();
      
      const hourlyInterval = setInterval(checkTimeAndUpdate, 3600000); 
      
      return () => clearInterval(hourlyInterval);
    }, msToNextHour);

    return () => clearTimeout(initialTimeout);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2>Loading pharmacies...</h2>
        <p>Please wait while we fetch the data...</p>
        <p className="text-sm text-gray-500">Debug info: {typeof window !== 'undefined' ? window.location.origin : 'Server rendering'}</p>
      </div>
    );
  }

 

  if (showVideo) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black">
        <video 
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/videos/1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bolu Nöbetçi Eczaneler</h1>
      <div className="space-y-8">
        {pharmacies.map((pharmacy, index) => (
          <div key={pharmacy.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Eczane {index + 1}</h2>
            <p><strong>Eczane Adı:</strong> {pharmacy.name}</p>
            <p><strong>Telefon:</strong> {pharmacy.phone}</p>
            <p><strong>Adres:</strong> {pharmacy.address}</p>
            <p><strong>Bölge:</strong> {pharmacy.district}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {pharmacy.mapImage && (
                <div>
                  <p className="font-bold mb-2">Kroki:</p>
                  <img src={pharmacy.mapImage} alt="Kroki" className="max-w-sm" />
                </div>
              )}
              <div>
                <p className="font-bold mb-2">Karekod:</p>
                <img src={pharmacy.qrCode} alt="Karekod" className="max-w-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}