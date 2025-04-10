import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Linking,
    Alert
} from 'react-native';

const attractionData = {
    id: '1',
    name: 'Ayasofya (Hagia Sophia)',
    rating: 4.8,
    reviewCount: 24563,
    description: 'Ayasofya, İstanbul\'un en görkemli tarihi yapılarından biridir. MS 537 yılında Bizans İmparatoru I. Justinianus tarafından inşa ettirilen bu yapı, uzun yıllar boyunca kilise ve cami olarak kullanılmış, şu anda ise müze olarak hizmet vermektedir. Muhteşem kubbesi ve benzersiz mimarisi ile dünya mimarlık tarihinin en önemli anıtlarından biri olarak kabul edilir.',
    longDescription: 'Ayasofya (Hagia Sophia), Roma İmparatoru I. Justinianus tarafından 532-537 yılları arasında inşa ettirilen, İstanbul\'un en önemli tarihi ve kültürel miraslarından biridir. Yaklaşık bin yıl boyunca dünyanın en büyük katedrali unvanını elinde bulunduran yapı, 1453\'te Osmanlı İmparatorluğu\'nun İstanbul\'u fethinden sonra camiye çevrilmiştir. Mustafa Kemal Atatürk\'ün direktifiyle 1935 yılında müzeye dönüştürülen Ayasofya, 2020 yılında tekrar cami statüsüne kavuşmuştur.\n\nYapının en etkileyici özelliği, 55 metre yüksekliğindeki ana kubbesi ve iç mekânı aydınlatan 40 penceresidir. İçerisinde bulunan Bizans dönemine ait altın yaldızlı mozaikler ve Osmanlı dönemine ait hat sanatı örnekleri, farklı kültürlerin izlerini bir arada görmek açısından eşsiz bir deneyim sunar.\n\nAyasofya\'nın mimarları Miletoslu (Aydın) İsidoros ile Trallesli (Aydın) Anthemios\'tur. Yapımında 10.000 işçinin çalıştığı tahmin edilmektedir.',
    address: 'Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul',
    openingHours: 'Her gün 09:00-17:00',
    entryFee: 'Ücretsiz (Cami statüsünde olduğu için)',
    website: 'https://ayasofyacamii.gov.tr',
    phone: '+90 (212) 522 17 50',
    location: {
        latitude: 41.008587,
        longitude: 28.980175,
    },
    images: [
        require('../../../assets/slider/ayasofya.jpg'),
    ]
};

const AttractionDetailScreen = ({ route, navigation }) => {
    // In a real app, you'd get the ID from route.params and fetch data
    // const { attractionId } = route.params;
    const attraction = attractionData; // In real app: fetch based on attractionId

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const goBack = () => {
        navigation.goBack();
    };

    const openWebsite = () => {
        if (attraction.website) {
            Linking.openURL(attraction.website);
        }
    };

    const openMap = () => {
        const { latitude, longitude } = attraction.location;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };

    const toggleFavorite = async () => {
        try {
            // Here you would make your backend request
            // For example:
            // const response = await fetch('your-api-endpoint', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         attractionId: attraction.id,
            //         action: isFavorite ? 'remove' : 'add'
            //     }),
            // });
            
            // if (response.ok) {
                // Toggle favorite state after successful API call
                Alert.alert(
                    'BAŞARILI',
                    isFavorite ? 'Favorilerden çıkarıldı.' : 'Favorilere eklendi.',
                    [{ text: 'Tamam' }]
                );
                setIsFavorite(!isFavorite);
            // } else {
            //     throw new Error('API request failed');
            // }
        } catch (error) {
            console.error('Favori işlemi başarısız:', error);
            Alert.alert(
                'Hata',
                'Favori işlemi gerçekleştirilemedi. Lütfen tekrar deneyin.',
                [{ text: 'Tamam' }]
            );
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={goBack}>
                        <Image source={require("../../../assets/global/goBack.png")} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Geri</Text>
                    <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
                        <Text style={styles.favoriteEmoji}>{isFavorite ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.mainImageContainer}>
                    <Image
                        source={attraction.images[activeImageIndex]}
                        style={styles.mainImage}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.attractionHeader}>
                    <Text style={styles.attractionName}>{attraction.name}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>{attraction.rating}</Text>
                        <View style={styles.starsContainer}>
                            <Text>
                                {"⭐️⭐️⭐️⭐️⭐️".slice(0, Math.floor(attraction.rating))}
                            </Text>
                        </View>
                        <Text style={styles.reviewCount}>({attraction.reviewCount.toLocaleString()})</Text>
                    </View>
                </View>
                <View style={styles.tabsContainer}>
                    <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                        <Text style={[styles.tabText, styles.activeTabText]}>Genel Bakış</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Yorumlar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tab}>
                        <Text style={styles.tabText}>Hakkında</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{attraction.description}</Text>
                </View>
                <View style={styles.infoSection}>
                    <TouchableOpacity style={styles.infoItem} onPress={openMap}>
                        <Text style={styles.infoIcon}>📍</Text>
                        <Text style={styles.infoText}>{attraction.address}</Text>
                    </TouchableOpacity>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoIcon}>🕒</Text>
                        <Text style={styles.infoText}>{attraction.openingHours}</Text>
                    </View>
                </View>
                <View style={styles.moreDetailsContainer}>
                    <Text style={styles.moreDetailsTitle}>Detaylı Bilgi</Text>
                    <Text style={styles.moreDetailsText}>{attraction.longDescription}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AttractionDetailScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2A2438',
    },
    container: {
        paddingBottom: 100,
        backgroundColor: 'white',
    },
    header: {
        backgroundColor: '#2A2438',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'space-between',
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    backButtonText: {
        fontSize: 20,
        color: '#FFFFFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF', 
        flex: 1,
    },
    favoriteButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    favoriteEmoji: {
        fontSize: 24,
    },
    mainImageContainer: {
        width: '100%',
        height: 250,
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    attractionHeader: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    attractionName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2A2438',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2A2438',
        marginRight: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        marginRight: 8,
    },
    reviewCount: {
        fontSize: 14,
        color: '#666',
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#2A2438',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
    },
    activeTabText: {
        color: '#2A2438',
        fontWeight: 'bold',
    },
    descriptionContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
    },
    infoSection: {
        padding: 16,
        backgroundColor: '#F9F9F9',
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoIcon: {
        fontSize: 20,
        marginRight: 12,
        width: 24,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    thumbnailContainer: {
        width: 120,
        height: 90,
        marginRight: 10,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    activeThumbnail: {
        borderColor: '#4CAF50',
    },
    moreDetailsContainer: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        marginTop: 8,
    },
    moreDetailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2A2438',
        marginBottom: 12,
    },
    moreDetailsText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#333',
    }
});