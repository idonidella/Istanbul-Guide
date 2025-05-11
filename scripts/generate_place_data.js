const db = require('../config/db');
const openai = require('../config/openai');

// İstanbul'un farklı bölgeleri (genişletilmiş liste)
const istanbulDistricts = [
  // Ana merkez bölgeler
  'Fatih', 'Beyoğlu', 'Üsküdar', 'Kadıköy', 'Beşiktaş', 'Şişli', 
  // Tarihi yarımada ve çevresi
  'Sultanahmet', 'Eminönü', 'Sirkeci', 'Karaköy', 'Cankurtaran', 'Süleymaniye', 'Fener', 'Balat',
  // Avrupa yakası
  'Sarıyer', 'Eyüp', 'Bakırköy', 'Zeytinburnu', 'Bayrampaşa', 'Gaziosmanpaşa', 'Kağıthane', 
  'Başakşehir', 'Bahçelievler', 'Güngören', 'Bağcılar', 'Esenler', 'Küçükçekmece', 'Avcılar',
  'Esenyurt', 'Beylikdüzü', 'Arnavutköy', 'Başakşehir',
  // Anadolu yakası
  'Maltepe', 'Kartal', 'Pendik', 'Tuzla', 'Beykoz', 'Çekmeköy', 'Ümraniye', 'Ataşehir', 'Sancaktepe',
  // Lüks ve turistik semtler
  'Ortaköy', 'Bebek', 'Levent', 'Etiler', 'Nişantaşı', 'Maslak', 'Cihangir', 'Galata',
  // Adalar
  'Büyükada', 'Heybeliada', 'Burgazada', 'Kınalıada'
];

// Alt bölgeler ve bilinen yerler
const istanbulSubdistricts = [
  'Taksim', 'Galatasaray', 'Kapalıçarşı', 'Çemberlitaş', 'Laleli', 'Beyazıt', 
  'Sarachane', 'Vefa', 'Zeyrek', 'Aksaray', 'Yenikapı', 'Kumkapı', 'Çengelköy',
  'Moda', 'Fenerbahçe', 'Caddebostan', 'Suadiye', 'Bostancı', 'Florya', 'Yeşilköy',
  'Rumeli Hisarı', 'Anadolu Hisarı', 'Tarabya', 'Yeniköy', 'İstinye', 'Kanlıca', 'Emirgan',
  'Kuruçeşme', 'Arnavutköy', 'Teşvikiye', 'Harbiye', 'Şehzadebaşı'
];

// İstanbul'dan bir yer seçme fonksiyonu
function selectRandomIstanbulLocation() {
  // %70 ihtimalle ana bölge, %30 ihtimalle alt bölge seç
  if (Math.random() < 0.7) {
    return istanbulDistricts[Math.floor(Math.random() * istanbulDistricts.length)];
  } else {
    return istanbulSubdistricts[Math.floor(Math.random() * istanbulSubdistricts.length)];
  }
}

// Koordinat aralıkları (İstanbul)
const latitudeBounds = [40.8, 41.3];  // Enlem (Kuzey-Güney)
const longitudeBounds = [28.5, 29.4]; // Boylam (Doğu-Batı)

// Gerçek kategori listesi
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
  { id: 11, name: 'Tarihi Meydanlar ve Anıtlar' }
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

// Rastgele koordinat üret
function generateRandomCoordinates() {
  const latitude = latitudeBounds[0] + (Math.random() * (latitudeBounds[1] - latitudeBounds[0]));
  const longitude = longitudeBounds[0] + (Math.random() * (longitudeBounds[1] - longitudeBounds[0]));
  return {
    latitude: parseFloat(latitude.toFixed(6)),
    longitude: parseFloat(longitude.toFixed(6))
  };
}

// GPT ile yer verisi oluşturma
async function generatePlaceWithGPT(district) {
  try {
    // Rastgele bir kategori seç
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Sen İstanbul'daki tarihi, kültürel ve turistik yerler konusunda uzman bir turizm rehberisin.
          İstanbul'un çeşitli bölgelerindeki gerçek ve bilinen yerler hakkında bilgi vereceksin.
          
          Her yer için şu alanı JSON formatında dönmen gerekiyor:
          - name: Gerçekte var olan, bilinen yerin tam adı (kategori ile uyumlu olmalı)
          
          Kategori: ${category.name}
          
          ÖNEMLİ: TAMAMEN GERÇEK ve MEVCUT olan, İstanbul'da var olan, bilinen turistik yerler önermeni istiyorum. 
          Hayal ürünü değil, az bilinen bile olsa gerçekte var olan yerler olmalı.`
        },
        {
          role: "user",
          content: `İstanbul'un ${district} bölgesinde '${category.name}' kategorisine uyan, gerçekte var olan bir yerin adını verir misin?
          JSON formatında dön ve sadece name alanını doldur. İsim, tam ve doğru şekilde yazılmış olmalı.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    
    // JSON yanıtını ayrıştır
    const placeData = JSON.parse(completion.choices[0].message.content);
    
    // Rastgele koordinat ekle
    const coordinates = generateRandomCoordinates();
    placeData.latitude = coordinates.latitude;
    placeData.longitude = coordinates.longitude;
    
    // Kategori ID'sini ekle
    placeData.categoryId = category.id;
    
    // QR kodu oluştur
    placeData.qrCode = generateQRCode(placeData.name);
    
    // Açıklamayı boş bırak
    placeData.description = '';
    
    return placeData;
  } catch (error) {
    console.error(`GPT veri üretme hatası: ${error.message}`);
    return null;
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
        place.description,
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

// Veritabanından mevcut yer isimlerini al
async function getExistingPlaceNames() {
  try {
    const [rows] = await db.execute('SELECT name FROM places');
    return rows.map(row => row.name.toLowerCase().trim());
  } catch (error) {
    console.error('Mevcut yer isimlerini alma hatası:', error);
    return [];
  }
}

// Ana fonksiyon
async function generatePlaces(count = 10) {
  console.log(`${count} adet yer verisi oluşturuluyor...`);
  
  // Mevcut yer isimlerini al
  const existingPlaceNames = await getExistingPlaceNames();
  console.log(`Veritabanında ${existingPlaceNames.length} yer zaten mevcut.`);
  
  let successCount = 0;
  let attempts = 0;
  const maxAttempts = count * 3; // En fazla bu kadar deneme yapılacak
  
  for (let i = 0; i < count && attempts < maxAttempts; attempts++) {
    // Rastgele bir bölge seç
    const district = selectRandomIstanbulLocation();
    
    console.log(`${i+1}/${count}: ${district} bölgesi için veri üretiliyor...`);
    
    // GPT ile yer oluştur
    const place = await generatePlaceWithGPT(district);
    
    if (place) {
      // İsim kontrolü yap - mevcut mu (büyük/küçük harf ve boşluklardan bağımsız)
      const normalizedName = place.name.toLowerCase().trim();
      if (existingPlaceNames.includes(normalizedName)) {
        console.log(`❌ Bu isimde bir yer zaten var: ${place.name}`);
        continue; // Bu isimde yer varsa, döngüye devam et
      }
      
      // İsim benzerlik kontrolü
      let isSimilar = false;
      for (const existingName of existingPlaceNames) {
        // Eğer %80'den fazla benzerlik varsa, benzer kabul et
        if (existingName.includes(normalizedName) || normalizedName.includes(existingName)) {
          if (existingName.length > 5 && normalizedName.length > 5) { // Kısa isimler için atla
            console.log(`❌ Benzer isimde bir yer zaten var: ${place.name} -> benzerlik: ${existingName}`);
            isSimilar = true;
            break;
          }
        }
      }
      
      if (isSimilar) continue;
      
      console.log('Oluşturulan yer:', place);
      
      // Veritabanına ekle
      const insertId = await insertPlaceToDatabase(place);
      
      if (insertId) {
        successCount++;
        i++; // Sadece başarılı ekleme olduğunda sayacı artır
        
        // Eklenen yeri mevcut isimler listesine ekle
        existingPlaceNames.push(normalizedName);
        
        console.log(`✅ Eklendi: ${place.name} (ID: ${insertId}, Kategori: ${categories.find(c => c.id === place.categoryId).name})`);
      } else {
        console.log(`❌ Veritabanına eklenirken hata: ${place.name}`);
      }
    } else {
      console.log(`❌ Yer oluşturulamadı`);
    }
    
    // API limitlerini aşmamak için biraz bekle
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  // Maksimum deneme sayısı aşıldı mı kontrol et
  if (attempts >= maxAttempts && successCount < count) {
    console.log(`⚠️ Maksimum deneme sayısına (${maxAttempts}) ulaşıldı. Sadece ${successCount} yer eklenebildi.`);
  }
  
  console.log(`İşlem tamamlandı! ${successCount}/${count} yer eklendi.`);
  process.exit(0);
}

// Çalıştır (varsayılan olarak 10 yer eklenecek)
const count = process.argv[2] ? parseInt(process.argv[2]) : 10;
generatePlaces(count); 