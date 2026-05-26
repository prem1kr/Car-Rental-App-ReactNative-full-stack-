import { View, FlatList, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';

const CarImageSlider = ({ photos }) => {

    const [activeIndex, setActiveIndex] = useState(0);
    const [width, setWidth] = useState(0);

    return (

        <View
            onLayout={(e) => {
                setWidth(e.nativeEvent.layout.width);
            }}
        >

            <FlatList
                data={photos}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                onScroll={(e) => {

                    if (!width) return;

                    const index = Math.round(
                        e.nativeEvent.contentOffset.x / width
                    );

                    setActiveIndex(index);
                }}
                scrollEventThrottle={16}
                renderItem={({ item }) => (

                    <Image
                        source={{ uri: item.url }}
                        style={[styles.image, { width }]}
                        resizeMode="cover"
                    />
                )}
            />

            <View style={styles.dotsContainer}>

                {photos.map((_, index) => (

                    <View
                        key={index}
                        style={[
                            styles.dot,
                            activeIndex === index && styles.activeDot
                        ]}
                    />
                ))}

            </View>

        </View>
    );
};

export default CarImageSlider;

const styles = StyleSheet.create({

    image: {
        height: 180,
    },

    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 8,
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