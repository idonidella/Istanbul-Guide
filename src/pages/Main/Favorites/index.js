import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { favoriteService } from '../../../networking/api';
import store from '../../../store';

const imageMap = {
    'Ayasofya': require('../../../assets/slider/ayasofya.jpg'),
    'Topkapı Sarayı': require('../../../assets/slider/topkapisarayi.jpg'),
    'Galata Kulesi': require('../../../assets/slider/galatakulesi.jpg'),
    'Sultanahmet Camii': require('../../../assets/slider/sultanahmetcami.jpg'),
    'Dolmabahçe Sarayı': require('../../../assets/slider/dolmabahcesarayi.jpg'),
    'Kız Kulesi': require('../../../assets/slider/kizkulesi.jpg'),
    'Kapalı Çarşı': require('../../../assets/slider/kapalicarsi.jpg'),
    'Yerebatan Sarnıcı': require('../../../assets/slider/yerebatansarnaci.jpg'),
    'Taksim Meydanı': require('../../../assets/slider/taksimmeydani.jpg'),
    'Pierre Loti Tepesi': require('../../../assets/slider/pierrelotitepesi.jpg'),
};

const UserFavorites = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = store.auth.data?.token;

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const data = await favoriteService.getFavorites(token);
            setFavorites(data);
        } catch (error) {
            console.log("Favoriler alınamadı", error);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => navigation.goBack();

    const handleAttractionPress = (attractionId) => {
        navigation.navigate('Top-Turizm-Areas', { attractionId });
    };
    
    const removeFavorite = async (attractionId) => {
        try {
            await favoriteService.removeFavorite(attractionId, token);
            fetchFavorites();
        } catch (error) {
            Alert.alert('Hata', 'Favoriden çıkarılamadı');
        }
    };

    const renderFavoriteItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.favoriteItem}
            onPress={() => handleAttractionPress(item.id)}
        >
            <Image source={imageMap[item.name] || imageMap['Ayasofya']} style={styles.attractionImage} />
            <View style={styles.overlayContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.attractionName}>{item.name}</Text>
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

    const filteredFavorites = favorites.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                </View>
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#7B68EE" />
            ) : filteredFavorites.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <Text style={{ fontSize: 16, color: '#444', textAlign: 'center', marginBottom: 12 }}>
                        Henüz favoriye eklemediniz.
                    </Text>
                    <TouchableOpacity
                        onPress={fetchFavorites}
                        style={{
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            backgroundColor: '#7B68EE',
                            borderRadius: 20,
                        }}
                    >
                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Yeniden Yükle</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredFavorites}
                    renderItem={renderFavoriteItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    favoriteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 44,
    },
    favoriteIcon: {
        fontSize: 24,
    },
});