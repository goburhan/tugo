'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';

async function getPharmacies() {
  const res = await fetch('/api/pharmacies/bolu', {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch pharmacies');
  }
  
  return res.json();
}

export default function BoluPage() {
  const [pharmacies, setPharmacies] = useState([]);
  const [showVideo, setShowVideo] = useState(false);

  // Function to check if current time is between 15:00-16:00
  const checkTimeAndUpdate = () => {
    const now = new Date();
    const hours = now.getHours();
    setShowVideo(hours >= 15 && hours < 16);
  };

  useEffect(() => {
    getPharmacies().then(data => setPharmacies(data.pharmacies));

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