import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, useColorScheme } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import MapComponent from '@/components/MapComponent';
import { useNavigation } from '@react-navigation/native';

type MarkerType = {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
};

export default function HomeScreen() {
    const [markers, setMarkers] = useState<MarkerType[]>([]);
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const fetchMarkers = async () => {
        try {
            const response = await fetch('http://192.168.0.210/kebab_api/get_kebab_list.php');
            const data = await response.json();
            setMarkers(data);
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
        }
    };

    useEffect(() => {
        fetchMarkers();
    }, []);

    const handleMarkerPress = (marker: MarkerType) => {
        console.log(`Navigating to KebabDetails with markerId: ${marker.id}`);
        // @ts-ignore
        navigation.navigate('KebabDetails', { markerId: marker.id });
    };

    // @ts-ignore
    return (
        <View style={styles.container}>
            <View style={[styles.headerContainer, colorScheme === 'dark' ? styles.darkheaderContainer : styles.lightheaderContainer]}>
                <ThemedText style={styles.title} type="title">Welcome to Kebab Map!</ThemedText>
                <HelloWave />
            </View>

            <View style={styles.mapContainer}>
                {Platform.OS === 'web' ? (
                    <View style={styles.webFallback}>
                        <ThemedText>Map is currently not available on the web.</ThemedText>
                    </View>
                ) : (
                    <MapComponent markers={markers} onMarkerPress={handleMarkerPress} />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    darkheaderContainer:{
      backgroundColor: '#1b1b1b',
    },
    lightheaderContainer:{
        backgroundColor: '#fff',
    },
    title: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    mapContainer: {
        flex: 1,
    },
    webFallback: {
        flex: 1,
        backgroundColor:'#2e2e2e',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
