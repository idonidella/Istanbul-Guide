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
            title: 'QR Kod Tarama',
            items: [
                {
                    title: 'QR Kod Nasıl Taranır?',
                    content: 'Uygulamanın ana menüsünden "QR Tara" butonuna tıklayın. Kameranız açılacaktır. İstanbul\'daki tarihi yapıların yanında bulunan QR kodları kameranızın görüş alanına getirerek taratın. QR kod başarıyla tarandığında, yapı hakkında detaylı bilgiler ekranınıza gelecektir.',
                    icon: 'qr-code',
                },
                {
                    title: 'Tarama Sorunları',
                    content: 'QR kodu taramakta sorun yaşıyorsanız:\n\n• Kameranızın temiz olduğundan emin olun\n• Yeterli ışık olduğundan emin olun\n• QR kodun tamamının kamera çerçevesinde olduğundan emin olun\n• Telefonu QR koda yaklaştırın veya uzaklaştırın\n• Kamera izinlerinin açık olduğunu kontrol edin',
                    icon: 'error',
                },
            ],
        },
        {
            title: 'Gezdiğim Yerler',
            items: [
                {
                    title: 'Gezdiğim Yerleri Nasıl Görebilirim?',
                    content: 'Ana menüden "Gezilerim" bölümüne giderek daha önce ziyaret ettiğiniz ve QR kodunu taradığınız tüm tarihi yapıları görebilirsiniz. Bu bölümde gezdiğiniz yerler, ziyaret tarihi ve her yapıya ait kısa bilgilere ulaşabilirsiniz.',
                    icon: 'history',
                },
                {
                    title: 'Ziyaret Kaydı Oluşturma',
                    content: 'Ziyaret kayıtlarınız otomatik olarak oluşturulur. Bir tarihi yapının QR kodunu taradığınızda, bu yapı otomatik olarak gezdiğiniz yerler listesine eklenir. Böylece İstanbul\'da keşfettiğiniz tüm mekânların kaydı tutulur.',
                    icon: 'bookmark',
                },
            ],
        },
        {
            title: 'Öneriler ve Bildirimler',
            items: [
                {
                    title: 'Öneriler Nasıl Çalışır?',
                    content: 'Uygulamamız, daha önce ziyaret ettiğiniz yerlere benzer tarihi yapıları size önerir. Örneğin, bir camii ziyaret ettiyseniz, yakındaki diğer camileri veya benzer mimari eserleri keşfetmeniz için öneriler sunulur. Böylece ilgi alanlarınıza göre şehri keşfedebilirsiniz.',
                    icon: 'lightbulb',
                },
                {
                    title: 'Yakındaki Yerler Bildirimleri',
                    content: 'Uygulama, konumunuza yakın ilgi çekebilecek yapılar olduğunda size bildirim gönderir. Daha önce ziyaret ettiğiniz ve beğendiğiniz yerlere benzer yapılar yakınınızda olduğunda haberdar olursunuz. Bildirimleri almak için konum izinlerinin açık olduğundan emin olun.',
                    icon: 'notifications',
                },
            ],
        },
        {
            title: 'Hesap ve Gizlilik',
            items: [
                {
                    title: 'Konum İzinleri',
                    content: 'Uygulamamız size yakındaki tarihi yapıları önerebilmek için konum bilginizi kullanır. Konum izinlerini telefon ayarlarınızdan veya uygulama içi ayarlar bölümünden yönetebilirsiniz. Konum bilginiz yalnızca size özel öneriler sunmak için kullanılır ve üçüncü taraflarla paylaşılmaz.',
                    icon: 'location',
                },
                {
                    title: 'Hesap Bilgilerim',
                    content: 'Hesap bilgilerinizi \"Profil\" sekmesinden görüntüleyebilir ve düzenleyebilirsiniz. Şifrenizi değiştirmek, profil fotoğrafınızı güncellemek veya e-posta adresinizi değiştirmek için bu bölümü kullanabilirsiniz.',
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
                <Text style={styles.headerTitle}>Yardım ve Destek</Text>
                <Text style={styles.headerSubtitle}>İstanbul'u keşfetmenize yardımcı olalım</Text>
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
                    <Text style={styles.additionalHelpTitle}>Uygulama Hakkında</Text>
                    <Text style={styles.additionalHelpText}>
                        Bu uygulama, İstanbul'daki tarihi ve kültürel yapıları keşfetmenizi kolaylaştırmak için tasarlandı. QR kodları tarayarak yapılar hakkında bilgi edinebilir, ziyaret ettiğiniz yerlerin kaydını tutabilir ve ilgi alanınıza göre yeni keşifler yapabilirsiniz.
                    </Text>
                    <TouchableOpacity style={styles.contactButton} activeOpacity={0.8}>
                        <Text style={styles.contactButtonText}>İletişime Geçin</Text>
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
                            <Text style={styles.modalButtonText}>Anladım</Text>
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
        marginBottom: 8,
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