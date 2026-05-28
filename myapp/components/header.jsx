import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
    return (
        <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container} >
            <View style={styles.content}>
                <Image source={require('../assets/images/icon.png')} style={styles.logo} />
                <Text style={styles.title}>Drive Your Journey</Text>
                <Text style={styles.subtitle}>Your Way</Text>
                <Text style={styles.desc}> Rent the perfect car for any occasion and explore the world with comfort. </Text>
            </View>

            <View style={styles.card}>
                <Feature icon="car-sport" label="Wide Range" />
                <Feature icon="pricetag" label="Best Prices" />
                <Feature icon="shield-checkmark" label="Safe & Secure" />
                <Feature icon="headset" label="24/7 Support" />
            </View>
        </LinearGradient>
    );
}

const Feature = ({ icon, label }) => (
    <View style={styles.feature}>
        <Ionicons name={icon} size={22} color="#007bff" />
        <Text style={styles.featureText}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        height: 250,
        borderTopLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: 20,
        justifyContent: 'center',
        gap: 10,
        elevation: 5,
        borderWidth: 2,
        borderColor: '#067108',

    },

    content: {
        marginTop: 40,
    },

    logo: {
        width: 40,
        height: 40,
        alignSelf: 'center'
    },

    title: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
        marginTop: 10,
    },

    subtitle: {
        color: '#4da6ff',
        fontSize: 22,
        fontStyle: 'italic',
    },

    desc: {
        color: '#ccc',
        marginTop: 10,
        width: '85%',
    },

    card: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 15,
        elevation: 6,
        borderWidth: 5,
        borderColor: '#067108',
    },

    feature: {
        alignItems: 'center',
    },

    featureText: {
        fontSize: 12,
        marginTop: 5,
    },
});