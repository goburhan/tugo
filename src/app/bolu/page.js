import Image from "next/image";

// Sayfayı static olarak render et
export const dynamic = 'force-static'
export const revalidate = 60 // her dakika yenile

async function getPharmacies() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/pharmacies/bolu`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch pharmacies');
    }
    
    return res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return { pharmacies: [] };
  }
}

export default async function BoluPage() {
  const data = await getPharmacies();
  const pharmacies = data.pharmacies || [];
  
  // Server-side saat kontrolü
  const now = new Date();
  const hours = now.getHours();
  const showVideo = hours >= 15 && hours < 16;

  if (!showVideo) {
    return (
      <div >
        <video 
          style={{width:"100vw",height:"100vh"}}
          autoPlay
          muted
          loop
          controls={false}
        >
          <source src="/videos/2.webm" type="video/mp4" />
          desteklenmiyor
        </video>
      </div>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Bolu Nöbetçi Eczaneler</h1>
      <div className="space-y-8">
        {pharmacies.map((pharmacy, index) => (
          <div key={pharmacy.id || index} className="border p-4 rounded-lg">
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