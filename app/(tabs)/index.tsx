import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import MapView, { Marker, Callout } from 'react-native-maps';
import darkMapStyle from '@/components/darkMapStyle';
import lightMapStyle from '@/components/lightMapStyle';

export default function HomeScreen() {
    const [markers, setMarkers] = useState([]);
    const colorScheme = useColorScheme();

    const fetchMarkers = async () => {
        try {
            const response = await fetch('https://api.com/kebab-locations');
            const data = await response.json();
            setMarkers(data);
        } catch (error) {
            console.error("Błąd podczas pobierania danych:", error);
        }
    };

    useEffect(() => {
        fetchMarkers();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ThemedText style={styles.title} type="title">Welcome to Kebab Map!</ThemedText>
                <HelloWave />
            </View>
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 51.2100600,
                        longitude: 16.1619000,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                    customMapStyle={colorScheme === 'dark' ? darkMapStyle : lightMapStyle}
                    markers={markers} // Przekazywanie markerów dla wersji web
                >
                    <Marker
                        coordinate={{
                            latitude: 51.204417302269924,
                            longitude: 16.159923675621094,
                        }}
                        anchor={{ x: 0.5, y: 1 }}
                    >
                        <Callout tooltip>
                            <View style={styles.calloutContainer}>
                                <Text style={styles.calloutTitle}>Leo Kebab Legnica</Text>
                                <Text style={styles.calloutDescription}>Lokal serwujący różnorodne dania kebabowe z opcją zamówienia online i dostawy.</Text>
                                <Text style={styles.calloutDetails}>Adres: ul. Przykładowa 4, Legnica</Text>
                                <Text style={styles.calloutDetails}>Godziny otwarcia: 10:00 - 20:00</Text>
                                <Text style={styles.calloutDetails}>Kontakt: +48 222 333 444</Text>
                            </View>
                        </Callout>
                    </Marker>
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }}
                            title={marker.title}
                            description={marker.description}
                        />
                    ))}
                </MapView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#A1CEDC',
    },
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: '#1D3D47',
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
    map: {
        width: '100%',
        height: '100%',
    },
    calloutContainer: {
        width: 200,
        padding: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)",
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    calloutDescription: {
        fontSize: 14,
        marginBottom: 5,
    },
    calloutDetails: {
        fontSize: 12,
        color: '#555',
        marginBottom: 3,
    },
});
