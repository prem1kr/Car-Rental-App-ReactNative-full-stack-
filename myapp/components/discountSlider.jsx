import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getOffers } from '../hooks/offers';
import { setOffer } from '../features/offerSlice';


const CARD_WIDTH = 172;

const DiscountSlider = () => {
    const dispatch = useDispatch();
    const flatListRef = useRef(null);
    const indexRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const router = useRouter();
    const discounts = useSelector(state => state.offer.offer || []);

    const fetchOffers = async () => {
        try {
            const response = await getOffers();
            if (response.success) {
                dispatch(setOffer(response.offers))
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handlePress = (item) => {
        router.push('/pages/offer');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            indexRef.current += 1;

            if (indexRef.current >= discounts.length) {
                indexRef.current = 0;
            }

            flatListRef.current?.scrollToOffset({
                offset: indexRef.current * CARD_WIDTH,
                animated: true,
            });

            setActiveIndex(indexRef.current);

        }, 2500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchOffers();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Offers for You</Text>

            <FlatList ref={flatListRef} data={discounts} keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingLeft: 12 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                decelerationRate="fast"

                onMomentumScrollEnd={(e) => {
                    const index = Math.round(
                        e.nativeEvent.contentOffset.x / CARD_WIDTH
                    );
                    setActiveIndex(index);
                    indexRef.current = index;
                }}

                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.cardWrapper}>
                        <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.card}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.subtitle} >{item.description.length > 40 ? item.description.slice(0, 45) + '....' : item.description}</Text>

                            <TouchableOpacity style={styles.button} onPress={handlePress}>
                                <Text style={styles.buttonText}>Read more</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.dotsContainer}>
                {discounts.map((_, index) => (
                    <View key={index} style={[styles.dot, activeIndex === index && styles.activeDot]} />
                ))}
            </View>

        </View>
    );
};

export default DiscountSlider;

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        borderWidth: 1,
        borderRadius: 20,
        paddingBottom: 10,
    },

    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12,
        marginBottom: 10,
        color: '#203a43',
    },

    cardWrapper: {
        marginRight: 12,
        borderRadius: 16,
    },

    card: {
        width: 160,
        height: 90,
        borderRadius: 16,
        padding: 12,
        justifyContent: 'center',

    },

    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    subtitle: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 5,
    },

    button: {
        marginTop: 6,
    },

    buttonText: {
        color: '#4da6ff',
        fontSize: 12,
    },

    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },

    activeDot: {
        backgroundColor: '#007bff',
        width: 10,
    },
});