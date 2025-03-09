import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const response = await fetch('https://nobet.seo.org.tr/');
    const html = await response.text();
    const $ = cheerio.load(html);
    const pharmacies = [];

    // Sadece eczane bilgilerini içeren div'leri seç
    $('div[id^="eczane"]').each((i, element) => {
      const pharmacyDiv = $(element);
      
      // Eczane adını al
      const name = pharmacyDiv.find('h3 strong').first().text().trim();
      
      // Detayları al ve parse et
      const detailsText = pharmacyDiv.find('p').text().trim();
      const details = detailsText.split('\n');
      
      // Carousel'dan ilgili eczanenin kroki resmini bul
      const carouselItem = $(`.carousel-item:eq(${i})`);
      const mapImage = carouselItem.find('#map-picture').attr('src');

      pharmacies.push({
        id: i + 1,
        name: name,
        
        phone: details[0]?.trim() || '',
        address: details[1]?.trim() || '',
        district: details[2]?.trim() || '',
        mapImage: mapImage || '',
        qrCode: 'https://nobet.seo.org.tr/img/karekod.png',
        mapUrl: `https://maps.googleapis.com/maps/api/staticmap?center=39.92887565500589,32.84444332122803&zoom=15&size=600x300&markers=color:red%7C39.92887565500589,32.84444332122803&key=YOUR_GOOGLE_MAPS_API_KEY`
      });
    });

    // Debug için konsola yazdır
    console.log('Found pharmacies:', pharmacies.length);
    
    return NextResponse.json({ pharmacies });

  } catch (error) {
    console.error('Error scraping data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pharmacy data', details: error.message },
      { status: 500 }
    );
  }
}