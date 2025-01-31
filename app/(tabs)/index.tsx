import React, {useEffect, useState} from 'react';
import {Platform, useColorScheme, View} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import MapComponent from '@/components/MapComponent';
import {useRouter} from 'expo-router';
import styles from '../styles/IndexStyles';

type MarkerType = {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
};

export default function HomeScreen() {
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const fetchMarkers = async () => {
        try {
            const response = await fetch('https://kebabapipanel-tg6o.onrender.com/api/kebabs');
            const data = await response.json();
            setMarkers(data);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchMarkers();
    }, []);

    const handleMarkerPress = (marker: MarkerType) => {
        router.push({
            pathname: '/screens/KebabDetails',
            params: {markerId: marker.id},
        });
    };

    return (
        <View style={styles.container}>
            <View
                style={[styles.headerContainer, {backgroundColor: isDarkMode ? "#1b1b1b" : "#fff"}]}
            >
                <ThemedText style={[styles.title, {color: isDarkMode ? "#fff" : "#000"}]} type="title">
                    Kebab Map
                </ThemedText>
            </View>

            <View testID="map-container" style={styles.mapContainer} >
                {Platform.OS === 'web' ? (
                    <View  testID="web-fallback" style={styles.webFallback}>
                        <ThemedText>Map is currently not available on the web.</ThemedText>
                    </View>
                ) : (
                    <MapComponent markers={markers} onMarkerPress={handleMarkerPress}/>
                )}
            </View>
        </View>
    );
}
