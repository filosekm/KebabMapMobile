import React, { useEffect, useState, useContext } from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity, FlatList, TextInput, Alert, useColorScheme,} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { AntDesign } from '@expo/vector-icons';

type CommentType = {
    id: string;
    user: string;
    content: string;
};

type KebabDetailsType = {
    id: string;
    name: string;
    logo: string;
    address: string;
    latitude: number;
    longitude: number;
    description: string;
    opening_hours: string;
    rating: number;
    yearOpened: number;
    yearClosed: number | null;
    hours: string;
    meats: string[];
    sauces: string[];
    status: string;
    craft: boolean;
    orderMethods: string[];
};

export default function KebabDetails() {
    const { userEmail, userToken } = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const { markerId } = useLocalSearchParams<{ markerId: string }>();
    const [kebabDetails, setKebabDetails] = useState<KebabDetailsType | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (markerId) {
            fetchKebabDetails();
            fetchComments();
        }
    }, [markerId]);

    const fetchKebabDetails = async () => {
        try {
            const response = await fetch(
                `http://192.168.0.210/kebab_api/get_kebab_details.php?id=${markerId}`
            );
            const data = await response.json();

            // Mapowanie danych z API na typ `KebabDetailsType`
            const mappedData: KebabDetailsType = {
                id: data.id.toString(),
                name: data.title,
                logo: data.logo || '', // Jeśli brakuje logo, ustaw pusty ciąg
                address: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
                description: data.description || '', // Obsługa opcjonalnego opisu
                opening_hours: data.opening_hours || '',
                rating: data.rating || 0,
                yearOpened: data.yearOpened || new Date().getFullYear(), // Przyjmujemy obecny rok, jeśli brak
                yearClosed: data.yearClosed || null,
                hours: data.opening_hours || 'Brak danych',
                meats: data.meats || [], // Obsługa pustej tablicy
                sauces: data.sauces || [],
                status: data.status || 'unknown',
                craft: data.craft || false,
                orderMethods: data.orderMethods || [],
            };

            setKebabDetails(mappedData);
        } catch (error) {
            console.error('Error fetching kebab details:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(
                `http://192.168.0.210/kebab_api/get_comments.php?kebab_id=${markerId}`
            );
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!userToken) {
            Alert.alert('Error', 'You must be logged in to add a comment.');
            return;
        }
        if (!newComment.trim()) {
            Alert.alert('Error', 'Comment cannot be empty.');
            return;
        }
        try {
            const response = await fetch('http://192.168.0.210/kebab_api/add_comment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kebab_id: markerId,
                    user: userEmail,
                    content: newComment,
                }),
            });
            if (response.ok) {
                setNewComment('');
                fetchComments();
            } else {
                Alert.alert('Error', 'Failed to add comment.');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleToggleFavorite = async () => {
        if (!userToken) {
            Alert.alert('Error', 'You must be logged in to add to favorites.');
            return;
        }
        try {
            const response = await fetch('http://192.168.0.210/kebab_api/toggle_favorite.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kebab_id: markerId,
                    user: userEmail,
                }),
            });
            if (response.ok) {
                setIsFavorite(!isFavorite);
            } else {
                Alert.alert('Error', 'Failed to update favorites.');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    if (!kebabDetails) {
        return (
            <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
                <Text style={[styles.loadingText, isDarkMode ? styles.darkText : styles.lightText]}>
                    Loading...
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
            {/* Nagłówek */}

            <View style={styles.header}>
                <Image source={{ uri: kebabDetails.logo }} style={styles.logo} />
                <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                    {kebabDetails.name}
                </Text>

                <TouchableOpacity onPress={handleToggleFavorite}>
                    <AntDesign
                        name={isFavorite ? 'heart' : 'hearto'}
                        size={24}
                        color={isFavorite ? 'red' : isDarkMode ? 'white' : 'black'}
                    />
                </TouchableOpacity>
            </View>

            {/* Mapa */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: kebabDetails.latitude,
                        longitude: kebabDetails.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: kebabDetails.latitude,
                            longitude: kebabDetails.longitude,
                        }}
                        title={kebabDetails.name}
                    />
                </MapView>
            </View>
            <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                Rating: {kebabDetails.rating.toFixed(1)} ⭐
            </Text>
            {/* Informacje o kebabie */}
            <View style={styles.infoContainer}>

                <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                    Adres: {kebabDetails.address}
                </Text>
                <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                    Rok otwarcia: {kebabDetails.yearOpened}
                </Text>
                {kebabDetails.yearClosed ? (
                    <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                        Rok zamknięcia: {kebabDetails.yearClosed}
                    </Text>
                ) : (
                    <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                        Status: Otwarty
                    </Text>
                )}
                <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                    Godziny otwarcia: {kebabDetails.hours}
                </Text>
                <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                    Rodzaje mięs: {Array.isArray(kebabDetails.meats) ? kebabDetails.meats.join(', ') : 'Brak danych'}
                </Text>
                <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                    Sosy: {Array.isArray(kebabDetails.sauces) ? kebabDetails.sauces.join(', ') : 'Brak danych'}
                </Text>
                <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                    Kraftowość: {kebabDetails.craft ? 'Tak' : 'Nie'}
                </Text>
                <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                    Metody zamówienia: {Array.isArray(kebabDetails.orderMethods) ? kebabDetails.orderMethods.join(', ') : 'Brak danych'}
                </Text>
            </View>
            {/* Lista komentarzy */}
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.commentItem, isDarkMode ? styles.darkComment : styles.lightComment]}>
                        <Text style={[styles.commentUser, isDarkMode ? styles.darkText : styles.lightText]}>
                            {item.user}
                        </Text>
                        <Text
                            style={[
                                styles.commentContent,
                                isDarkMode ? styles.darkText : styles.lightText,
                            ]}
                        >
                            {item.content}
                        </Text>
                    </View>
                )}
                ListHeaderComponent={() => (
                    <Text style={[styles.commentsHeader, isDarkMode ? styles.darkText : styles.lightText]}>
                        Comments
                    </Text>
                )}
                ListEmptyComponent={() => (
                    <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                        There is no comments yet.
                    </Text>
                )}
                style={styles.commentsList}
            />

            {/* Dodaj komentarz */}
            <View style={styles.addCommentContainer}>
                <TextInput
                    style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                    placeholder="Add a comment..."
                    placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddComment}>
                    <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10, // Dodano odstęp na górze
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000', // Ustaw domyślny kolor
    },
    logo: {
        width: 25,
        height: 25,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    mapContainer: {
        borderRadius: 15, // Zaokrąglenie kontenera
        overflow: 'hidden', // Wymagane, aby `borderRadius` działało
        marginBottom: 20, // Opcjonalny odstęp
    },
    map: {
        height: 200,
        width: '100%',
    },
    infoContainer: {
        marginBottom: 20,
    },
    details: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 5,
        color: '#000',
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
    },
    commentsList: {
        flexGrow: 0,
        marginTop: 10,
    },
    commentItem: {
        padding: 8,
        borderRadius: 8,
        marginVertical: 5,
    },
    lightComment: {
        backgroundColor: '#f1f1f1',
    },
    darkComment: {
        backgroundColor: '#333',
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentContent: {
        marginTop: 5,
        fontSize: 12,
    },
    commentsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addCommentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    input: {
        flex: 1,
        borderRadius: 8,
        padding: 10,
    },
    lightInput: {
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderWidth: 1,
        color: '#000',
    },
    darkInput: {
        backgroundColor: '#333',
        borderColor: '#555',
        borderWidth: 1,
        color: '#fff',
    },
    addButton: {
        backgroundColor: '#f39c12',
        borderRadius: 8,
        padding: 10,
        marginLeft: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    darkBackground: {
        backgroundColor: '#121212',
    },
    lightBackground: {
        backgroundColor: '#ffffff',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#000',
    },
});
