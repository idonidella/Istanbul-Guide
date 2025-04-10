import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    TextInput
} from 'react-native';

// Örnek favori yerler verileri
const favoriteAttractions = [
    {
        id: '1',
        name: 'Ayasofya (Hagia Sophia)',
        address: 'Sultan Ahmet, Ayasofya Meydanı No:1, 34122 Fatih/İstanbul',
        rating: 4.8,
        image: require('../../../assets/slider/ayasofya.jpg')
    },
    {
        id: '2',
        name: 'Topkapı Sarayı',
        address: 'Cankurtaran, 34122 Fatih/İstanbul',
        rating: 4.7,
        image: require('../../../assets/slider/topkapisarayi.jpg')
    },
    {
        id: '3',
        name: 'Galata Kulesi',
        address: 'Bereketzade, Galata Kulesi, 34421 Beyoğlu/İstanbul',
        rating: 4.6,
        image: require('../../../assets/slider/galatakulesi.jpg') 
    },
];

const UserFavorites = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    
    const goBack = () => {
        navigation.goBack();
    };
    
    const handleAttractionPress = (attractionId) => {
        navigation.navigate('AttractionDetail', { attractionId });
    };
    
    const removeFavorite = async (attractionId) => {
        // Backend istek kodunuzu buraya ekleyebilirsiniz
        // Örnek: await removeFavoriteAPI(attractionId);
        
        // UI güncellemesi burada yapılacak
        console.log(`Attraction ${attractionId} removed from favorites`);
    };
    
    const renderFavoriteItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.favoriteItem}
            onPress={() => handleAttractionPress(item.id)}
        >
            <Image source={item.image} style={styles.attractionImage} />
            <View style={styles.overlayContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.attractionName}>{item.name}</Text>
                    <Text style={styles.attractionAddress}>{item.address}</Text>
                    <View style={styles.ratingContainer}>
                        <Text style={styles.stars}>
                            {"⭐️⭐️⭐️⭐️⭐️".slice(0, Math.floor(item.rating))}
                        </Text>
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={styles.favoriteButton}
                    onPress={() => removeFavorite(item.id)}
                >
                    <Text style={styles.favoriteIcon}>❤️</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={goBack}>
                    <Image source={require("../../../assets/global/goBack.png")} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favoriler</Text>
            </View>
            
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Ne arıyorsunuz?"
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <TouchableOpacity style={styles.filterIcon}>
                        <Image source={require("../../../assets/global/goBack.png")} style={{ width: 20, height: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>
            
            <FlatList
                data={favoriteAttractions}
                renderItem={renderFavoriteItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default UserFavorites;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#2A2438',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 25,
        paddingHorizontal: 16,
        
    },
    backButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    searchContainer: {
        backgroundColor: '#2A2438',
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    searchInputContainer: {
        flexDirection: 'row',
        backgroundColor: '#EEEEEE',
        borderRadius: 25,
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: '#333333',
    },
    filterIcon: {
        padding: 6,
    },
    listContainer: {
        padding: 12,
    },
    favoriteItem: {
        height: 140,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    attractionImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlayContainer: {
        flex: 1,
        backgroundColor: 'rgba(42, 36, 56, 0.6)',
        flexDirection: 'row',
        padding: 16,
        justifyContent: 'space-between',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    attractionName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    attractionAddress: {
        fontSize: 13,
        color: '#FFFFFF',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stars: {
        marginRight: 8,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    favoriteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 44,
    },
    favoriteIcon: {
        fontSize: 24,
    },
});