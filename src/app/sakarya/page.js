import Image from "next/image";

async function getPharmacies() {
  const res = await fetch('/api/pharmacies/sakarya', {
    cache: 'no-store'
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch pharmacies');
  }
  
  return res.json();
}

export default async function SakaryaPage() {
  const { pharmacies } = await getPharmacies();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Sakarya Nöbetçi Eczaneler</h1>
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