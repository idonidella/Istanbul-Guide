import React, { useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Modal,
} from 'react-native';

export default function HelpPage({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [activeContent, setActiveContent] = useState({
        title: '',
        content: '',
        icon: null
    });

    const helpSections = [
        {
            title: 'QR Code Scanning',
            items: [
                {
                    title: 'How to Scan a QR Code?',
                    content: 'Click the "Scan QR Code" button in the main menu. Your camera will open. Hold the QR code near the historical structures in Istanbul in your camera\'s viewfinder. When the QR code is successfully scanned, detailed information about the structure will appear on your screen.',
                    icon: 'qr-code',
                },
                {
                    title: 'Scanning Problems',
                    content: 'If you are having trouble scanning a QR code:\n\n• Ensure your camera is clean\n• Make sure there is enough light\n• Ensure the QR code is fully within your camera\'s viewfinder\n• Move your phone closer or farther from the QR code\n• Check that your camera permissions are enabled',
                    icon: 'error',
                },
            ],
        },
        {
            title: 'Visited Places',
            items: [
                {
                    title: 'How to See My Visited Places?',
                    content: 'Go to the "Visited Places" section in the main menu to see all the historical structures you have visited and scanned the QR code for. In this section, you can see your visits, visit dates, and brief information about each structure.',
                    icon: 'history',
                },
                {
                    title: 'Creating a Visit Record',
                    content: 'Your visit records are automatically created. When you scan the QR code of a historical structure, it is automatically added to the list of places you have visited. This way, all the places you have discovered in Istanbul are recorded.',
                    icon: 'bookmark',
                },
            ],
        },
        {
            title: 'Recommendations and Notifications',
            items: [
                {
                    title: 'How do Recommendations Work?',
                    content: 'Our app recommends historical structures similar to the ones you have visited before. For example, if you have visited a mosque, you will be recommended other mosques or similar architectural works in your area. This way, you can discover the city based on your interests.',
                    icon: 'lightbulb',
                },
                {
                    title: 'Nearby Places Notifications',
                    content: 'Our app sends you notifications when there are historical structures that might interest you nearby. When you have visited and liked a place before, you will be notified if similar structures are nearby. Make sure your location permissions are enabled to receive notifications.',
                    icon: 'notifications',
                },
            ],
        },
        {
            title: 'Account and Privacy',
            items: [
                {
                    title: 'Location Permissions',
                    content: 'Our app uses your location information to provide you with recommendations of historical structures nearby. You can manage your location permissions in your phone settings or in the app settings. Your location information is only used to provide you with personalized recommendations and is not shared with third parties.',
                    icon: 'location',
                },
                {
                    title: 'Account Information',
                    content: 'You can view and edit your account information from the "Profile" tab. You can change your password, update your profile picture, or change your email address using this section.',
                    icon: 'person',
                },
            ],
        },
    ];

    const openModal = (title, content, icon) => {
        setActiveContent({ title, content, icon });
        setModalVisible(true);
    };

    const renderHelpItem = (item, index) => {
        return (
            <TouchableOpacity
                key={index}
                style={styles.helpItemContainer}
                activeOpacity={0.7}
                onPress={() => openModal(item.title, item.content, item.icon)}
            >
                <Text style={styles.helpItemText}>{item.title}</Text>
                <View style={styles.arrowContainer}>
                    <Text style={styles.arrowIcon}>›</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2A2438" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Help and Support</Text>
                <Text style={styles.headerSubtitle}>Let us help you discover Istanbul</Text>
            </View>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {helpSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <View style={styles.sectionDivider} />
                        {section.items.map((item, itemIndex) => renderHelpItem(item, itemIndex))}
                    </View>
                ))}
                <View style={styles.additionalHelp}>
                    <Text style={styles.additionalHelpTitle}>About the Application</Text>
                    <Text style={styles.additionalHelpText}>
                        This application is designed to help you discover historical and cultural structures in Istanbul. You can scan QR codes to learn about the structures, record your visits, and make new discoveries based on your interests.
                    </Text>
                    <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
                        <Text style={styles.contactButtonText}>Contact Us</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{activeContent.title}</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalDivider} />
                        <ScrollView style={styles.modalScrollView}>
                            <Text style={styles.modalText}>{activeContent.content}</Text>
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>I understand</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2A2438',
    },
    header: {
        padding: 20,
        paddingTop: 24,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginVertical:12,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#A593E0',
        opacity: 0.9,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionContainer: {
        marginBottom: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    sectionDivider: {
        height: 1,
        backgroundColor: 'rgba(165, 147, 224, 0.3)',
        marginBottom: 16,
    },
    helpItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.07)',
    },
    helpItemText: {
        fontSize: 16,
        color: '#E8E8E8',
        flex: 1,
    },
    arrowContainer: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowIcon: {
        fontSize: 20,
        color: '#A593E0',
        fontWeight: 'bold',
    },
    additionalHelp: {
        marginTop: 10,
        marginBottom: 120,
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
    },
    additionalHelpTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center',
    },
    additionalHelpText: {
        fontSize: 15,
        color: '#DDDDDD',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    contactButton: {
        backgroundColor: '#7B68EE',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#7B68EE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#352F44',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    modalDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 15,
    },
    modalScrollView: {
        maxHeight: 300,
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        color: '#E8E8E8',
        lineHeight: 24,
    },
    modalButton: {
        backgroundColor: '#7B68EE',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 5,
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});