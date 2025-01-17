import React, { useState } from 'react';
import { Platform, StyleSheet, View, Text, TouchableOpacity, Modal, useColorScheme } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import darkMapStyle from '@/components/darkMapStyle';
import lightMapStyle from '@/components/lightMapStyle';

type MarkerType = {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
};

type MapComponentProps = {
    markers: MarkerType[];
    onMarkerPress: (marker: MarkerType) => void;
};

const MapComponent: React.FC<MapComponentProps> = ({ markers, onMarkerPress }) => {
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const [selectedMarker, setSelectedMarker] = useState<MarkerType | null>(null);
    const [kebabDetails, setKebabDetails] = useState<{ description: string } | null>(null);

    const openModal = async (marker: MarkerType) => {
        setSelectedMarker(marker);
        await fetchKebabDetails(marker.id);
    };

    const closeModal = () => {
        setSelectedMarker(null);
        setKebabDetails(null);
    };

    const fetchKebabDetails = async (kebabId: string) => {
        try {
            const response = await fetch(`http://192.168.0.210:8000/api/kebabs/${kebabId}`);
            const data = await response.json();
            setKebabDetails(data);
        } catch (error) {
            console.error("Błąd podczas pobierania szczegółów kebaba:", error);
        }
    };

    if (Platform.OS === 'web') {
        return (
            <View style={styles.webFallback}>
                <Text style={styles.webFallbackText}>
                    Map is not supported on the web version at the moment.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 51.2100600,
                    longitude: 16.1619000,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                customMapStyle={isDarkMode ? darkMapStyle : lightMapStyle}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        testID={`marker-${marker.id}`}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }}
                        anchor={{ x: 0.5, y: 1 }}
                    >
                        <Callout tooltip onPress={() => openModal(marker)}>
                            <View style={[styles.calloutContainer, isDarkMode ? styles.darkCallout : styles.lightCallout]}>
                                <Text style={[styles.calloutTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                                    {marker.title}
                                </Text>
                                <Text style={[styles.calloutDescription, isDarkMode ? styles.darkText : styles.lightText]}>
                                    {marker.description}
                                </Text>
                                <TouchableOpacity
                                    style={[styles.detailsButton, { backgroundColor: isDarkMode ? '#f39c12' : '#007bff' }]}
                                >
                                    <Text style={styles.detailsButtonText}>Details</Text>
                                </TouchableOpacity>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {selectedMarker && (
                <Modal
                    visible={!!selectedMarker}
                    animationType="slide"
                    transparent
                    onRequestClose={closeModal}
                >
                    <TouchableOpacity style={styles.modalContainer} onPress={closeModal} activeOpacity={1}>
                        <View style={[styles.modalContent, isDarkMode ? styles.darkModal : styles.lightModal]}>
                            <Text style={[styles.modalTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                                {selectedMarker.title}
                            </Text>
                            <Text style={[styles.modalDescription, isDarkMode ? styles.darkText : styles.lightText]}>
                                {kebabDetails ? kebabDetails.description : "Loading..."}
                            </Text>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: isDarkMode ? "#f39c12" : "#2980b9" }]}
                                onPress={() => {
                                    onMarkerPress(selectedMarker);
                                    closeModal();
                                }}
                            >
                                <Text style={styles.modalButtonText}>Go to Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: isDarkMode ? "#555" : "#ccc" }]}
                                onPress={closeModal}
                            >
                                <Text style={styles.modalButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    );
};


export default MapComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    calloutContainer: {
        width: 200,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    lightCallout: {
        backgroundColor: '#ffffff',
    },
    darkCallout: {
        backgroundColor: '#1e1e1e',
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    calloutDescription: {
        fontSize: 14,
        marginBottom: 5,
        textAlign: 'center',
    },
    detailsButton: {
        marginTop: 8,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
    },
    detailsButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    webFallback: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    webFallbackText: {
        marginLeft: 10,
        fontSize: 18,
        color: '#333',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
    },
    lightModal: {
        backgroundColor: '#ffffff',
    },
    darkModal: {
        backgroundColor: '#1e1e1e',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalDescription: {
        fontSize: 16,
        marginBottom: 25,
        textAlign: 'center',
    },
    lightText: {
        color: '#333',
    },
    darkText: {
        color: '#fff',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
