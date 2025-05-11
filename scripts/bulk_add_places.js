const db = require('../config/db');
const openai = require('../config/openai');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// İstanbul'un koordinat aralıkları (yedek olarak saklıyoruz)
const latitudeBounds = [40.8, 41.3];  // Enlem (Kuzey-Güney)
const longitudeBounds = [28.5, 29.4]; // Boylam (Doğu-Batı)

// Google Maps API Key (bu değeri .env dosyasında saklamak daha güvenli olur)
require('dotenv').config();
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Kategoriler
const categories = [
  { id: 1, name: 'Köşkler / Vadi / Tepe / Parklar' },
  { id: 2, name: 'Camiler' },
  { id: 3, name: 'Kiliseler' },
  { id: 4, name: 'Şarküslalar ve Saraylar' },
  { id: 5, name: 'Çeşmeler' },
  { id: 6, name: 'Köprüler' },
  { id: 7, name: 'Resim Galerileri' },
  { id: 8, name: 'Müzeler' },
  { id: 9, name: 'Kuleler ve Gözetleme Yapıları' },
  { id: 10, name: 'Antik Kalıntılar / Sütunlar' },
  { id: 11, name: 'Tarihi Meydanlar ve Anıtlar' },
  { id: 12, name: 'Alışveriş Merkezleri' }
];

// QR kod oluşturma fonksiyonu
function generateQRCode(name) {
  // Ad'dan özel karakterleri kaldır ve boşlukları alt çizgiyle değiştir
  const cleanName = name.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
  
  // 4 haneli rastgele kod oluştur
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  
  return `qr_${cleanName}_${randomCode}`;
}

// Google Maps API'den koordinat al
async function getCoordinatesFromGoogleMaps(placeName) {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API anahtarı bulunamadı. Rastgele koordinatlar kullanılacak.');
    return generateRandomCoordinates();
  }

  try {
    // API isteğine daha fazla detay görelim
    console.log(`  🔍 Google Places API isteği gönderiliyor: "${placeName} Istanbul Turkey"`);
    
    // Places API (New) endpoint ve parametreleri kullanılıyor
    // Find Place API kullanarak önce yer arayalım
    const url = 'https://places.googleapis.com/v1/places:searchText';
    const data = {
      textQuery: `${placeName} Istanbul Turkey`,
      languageCode: "tr"
    };
    
    console.log(`  🔗 API URL: ${url}`);
    console.log(`  📊 API isteği: ${JSON.stringify(data)}`);
    
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.id'
      }
    });

    // API yanıtını daha detaylı görelim
    console.log(`  📊 API yanıt durumu: ${response.status}`);
    
    if (response.data.places && response.data.places.length > 0) {
      const place = response.data.places[0];
      console.log(`  ✅ Konum bulundu: ${place.displayName?.text || placeName}`);
      console.log(`  📍 Adres: ${place.formattedAddress || 'Adres bilgisi yok'}`);
      
      return {
        latitude: place.location?.latitude,
        longitude: place.location?.longitude,
        placeId: place.id,
        formattedAddress: place.formattedAddress,
        placeName: place.displayName?.text || placeName
      };
    } else {
      console.warn(`  ❌ Google Maps API'den "${placeName}" için koordinat bulunamadı. Rastgele koordinatlar kullanılacak.`);
      if (response.data) {
        console.warn(`  ℹ️ API Yanıtı: ${JSON.stringify(response.data)}`);
      }
      return generateRandomCoordinates();
    }
  } catch (error) {
    console.error(`  ❌ Google Maps API hatası: ${error.message}`);
    if (error.response) {
      console.error(`  ℹ️ Hata kodu: ${error.response.status}`);
      console.error(`  ℹ️ Hata detayları: ${JSON.stringify(error.response.data)}`);
    }
    return generateRandomCoordinates();
  }
}

// Yedek olarak rastgele koordinat üret
function generateRandomCoordinates() {
  const latitude = latitudeBounds[0] + (Math.random() * (latitudeBounds[1] - latitudeBounds[0]));
  const longitude = longitudeBounds[0] + (Math.random() * (longitudeBounds[1] - longitudeBounds[0]));
  return {
    latitude: parseFloat(latitude.toFixed(6)),
    longitude: parseFloat(longitude.toFixed(6)),
    isRandom: true
  };
}

// Mevcut yer isimlerini al
async function getExistingPlaceNames() {
  try {
    const [rows] = await db.execute('SELECT name FROM places');
    return new Set(rows.map(row => row.name.toLowerCase().trim()));
  } catch (error) {
    console.error('Mevcut yer isimlerini alma hatası:', error);
    return new Set();
  }
}

// Yerin gerçekten var olup olmadığını kontrol et ve kategori belirle
async function validateAndCategorizePlace(placeName) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Sen İstanbul'daki tarihi, kültürel ve turistik yerler konusunda uzman bir turizm rehberisin.
          Sana verilen yer isimlerinin İstanbul'da gerçekten var olup olmadığını kontrol etmen gerekiyor.
          
          Eğer yer gerçekten varsa, şu kategorilerden birine ata:
          1: Köşkler / Vadi / Tepe / Parklar
          2: Camiler
          3: Kiliseler
          4: Şarküslalar ve Saraylar
          5: Çeşmeler
          6: Köprüler
          7: Resim Galerileri
          8: Müzeler
          9: Kuleler ve Gözetleme Yapıları
          10: Antik Kalıntılar / Sütunlar
          11: Tarihi Meydanlar ve Anıtlar
          12: Alışveriş Merkezleri
          
          Eğer yer gerçekten yoksa veya İstanbul'da değilse, "Yok" yaz.
          
          Yanıtını JSON formatında şu şekilde ver:
          {
            "exists": true/false,
            "categoryId": 1-11 arası bir numara (eğer exists false ise boş bırak)
          }`
        },
        {
          role: "user",
          content: `"${placeName}" isimli yer İstanbul'da gerçekten var mı? Varsa hangi kategoriye girer?`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    
    const result = JSON.parse(completion.choices[0].message.content);
    return result;
  } catch (error) {
    console.error(`GPT doğrulama hatası: ${error.message}`);
    return { exists: false };
  }
}

// Veritabanına yer ekle
async function insertPlaceToDatabase(place) {
  try {
    const [result] = await db.execute(
      `INSERT INTO places (name, description, latitude, longitude, qrCode, categoryId) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        place.name,
        place.description || '',
        place.latitude,
        place.longitude,
        place.qrCode,
        place.categoryId
      ]
    );
    
    return result.insertId;
  } catch (error) {
    console.error(`Veritabanı ekleme hatası: ${error.message}`);
    return null;
  }
}

// Mekan listesini dosyadan oku
function readPlaceNamesFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  } catch (error) {
    console.error(`Dosya okuma hatası: ${error.message}`);
    return [];
  }
}

// Ana fonksiyon
async function bulkAddPlaces(filePath) {
  // Dosyadan yer isimlerini oku
  const placeNames = readPlaceNamesFromFile(filePath);
  console.log(`Dosyadan ${placeNames.length} yer ismi okundu.`);
  
  if (placeNames.length === 0) {
    console.log('İşlenecek yer bulunamadı. Lütfen dosyayı kontrol edin.');
    process.exit(1);
  }
  
  // API anahtarı kontrolü
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('\n⚠️ Google Maps API anahtarı bulunamadı! .env dosyasında GOOGLE_MAPS_API_KEY değerini ayarlayın.');
    console.warn('Koordinatlar rastgele oluşturulacak.\n');
  }
  
  // Mevcut yer isimlerini al
  const existingPlaceNames = await getExistingPlaceNames();
  console.log(`Veritabanında ${existingPlaceNames.size} yer zaten mevcut.`);
  
  let validCount = 0;
  let invalidCount = 0;
  let duplicateCount = 0;
  let errorCount = 0;
  let googleMapsSuccessCount = 0;
  
  console.log('\nYer doğrulama işlemi başlıyor...\n');
  
  for (let i = 0; i < placeNames.length; i++) {
    const placeName = placeNames[i];
    console.log(`[${i+1}/${placeNames.length}] "${placeName}" işleniyor...`);
    
    // Mekan adı zaten veritabanında var mı kontrol et
    if (existingPlaceNames.has(placeName.toLowerCase().trim())) {
      console.log(`  ❌ Bu yer zaten veritabanında mevcut: ${placeName}`);
      duplicateCount++;
      continue;
    }
    
    // GPT ile yeri doğrula ve kategorize et
    const validation = await validateAndCategorizePlace(placeName);
    
    if (!validation.exists) {
      console.log(`  ❌ Bu yer gerçekte yok veya İstanbul'da değil: ${placeName}`);
      invalidCount++;
      continue;
    }
    
    // Google Maps'ten koordinatları al
    const locationData = await getCoordinatesFromGoogleMaps(placeName);
    
    if (!locationData.isRandom) {
      googleMapsSuccessCount++;
      console.log(`  📍 Google Maps koordinatları bulundu: ${locationData.latitude}, ${locationData.longitude}`);
      if (locationData.formattedAddress) {
        console.log(`     Adres: ${locationData.formattedAddress}`);
      }
    } else {
      console.log(`  📍 Rastgele koordinatlar kullanılıyor: ${locationData.latitude}, ${locationData.longitude}`);
    }
    
    // Yer bilgilerini oluştur
    const place = {
      name: placeName,
      description: '',
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      qrCode: generateQRCode(placeName),
      categoryId: validation.categoryId
    };
    
    // Veritabanına ekle
    const insertId = await insertPlaceToDatabase(place);
    
    if (insertId) {
      validCount++;
      existingPlaceNames.add(placeName.toLowerCase().trim());
      const category = categories.find(c => c.id === validation.categoryId);
      console.log(`  ✅ Eklendi: ${placeName} (ID: ${insertId}, Kategori: ${category ? category.name : 'Bilinmiyor'})`);
    } else {
      errorCount++;
      console.log(`  ❌ Veritabanına eklenirken hata: ${placeName}`);
    }
    
    // API limitlerini aşmamak için biraz bekle
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\nToplu ekleme işlemi tamamlandı!');
  console.log(`Toplam ${placeNames.length} yer işlendi:`);
  console.log(`- ${validCount} yer başarıyla eklendi`);
  console.log(`- ${googleMapsSuccessCount} yer için Google Maps'ten gerçek koordinatlar alındı`);
  console.log(`- ${invalidCount} yer gerçekte yok veya İstanbul'da değil`);
  console.log(`- ${duplicateCount} yer zaten veritabanında mevcut`);
  console.log(`- ${errorCount} yer eklenirken hata oluştu`);
  
  process.exit(0);
}

// Komut satırı argümanlarını kontrol et
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Kullanım: node bulk_add_places.js <mekan_listesi_dosyasi.txt>');
  process.exit(1);
}

// Scripti çalıştır
bulkAddPlaces(args[0]); 