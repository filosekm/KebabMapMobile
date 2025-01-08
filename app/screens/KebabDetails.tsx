import React, { useEffect, useState, useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    TextInput,
    Alert,
    useColorScheme,
} from 'react-native';
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
            setKebabDetails(data);
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
                const newCommentData = {
                    id: Date.now().toString(), // Generowanie tymczasowego ID
                    user: userEmail,
                    content: newComment,
                };
                // Aktualizacja stanu lokalnego
                setComments((prevComments) => [newCommentData, ...prevComments]);
                // Czyszczenie pola tekstowego
                setNewComment('');
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
                Alert.alert('Success', isFavorite ? 'Removed from favorites.' : 'Added to favorites!');
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
            <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                {kebabDetails.name}
            </Text>
            <Image source={{ uri: kebabDetails.logo }} style={styles.logo} />
            <Text style={styles.details}>Adres: {kebabDetails.address}</Text>
            <Text style={styles.details}>
                Lokalizacja: {kebabDetails.latitude}, {kebabDetails.longitude}
            </Text>
            <Text style={styles.details}>Rok otwarcia: {kebabDetails.yearOpened}</Text>
            {kebabDetails.yearClosed ? (
                <Text style={styles.details}>Rok zamknięcia: {kebabDetails.yearClosed}</Text>
            ) : (
                <Text style={styles.details}>Status: Otwarty</Text>
            )}
            <Text style={styles.details}>Godziny otwarcia: {kebabDetails.hours}</Text>
            <Text style={styles.details}>Rodzaje mięs: {kebabDetails.meats.join(', ')}</Text>
            <Text style={styles.details}>Sosy: {kebabDetails.sauces.join(', ')}</Text>
            <Text style={styles.details}>Kraftowość: {kebabDetails.craft ? 'Tak' : 'Nie'}</Text>
            <Text style={styles.details}>Metody zamówienia: {kebabDetails.orderMethods.join(', ')}</Text>
            <TouchableOpacity onPress={handleToggleFavorite}>
                <AntDesign
                    name={isFavorite ? 'heart' : 'hearto'}
                    size={24}
                    color={isFavorite ? 'red' : isDarkMode ? 'white' : 'black'}
                />
            </TouchableOpacity>
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
            <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                Rating: {kebabDetails.rating}⭐
            </Text>
            <FlatList
                data={comments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={[styles.commentItem, isDarkMode ? styles.darkComment : styles.lightComment]}
                    >
                        <Text
                            style={[styles.commentUser, isDarkMode ? styles.darkText : styles.lightText]}
                        >
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
                    <Text
                        style={[styles.commentsHeader, isDarkMode ? styles.darkText : styles.lightText]}
                    >
                        Comments
                    </Text>
                )}
                style={styles.commentsList}
            />
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20
    },
    details: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10
    },
    locationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerContainer: {
        paddingTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    map: {
        height: 200,
        borderRadius: 8,
        marginVertical: 15,
    },
    subText: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 5,
    },
    description: {
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
    },
    commentsList: {
        flex: 1,
        marginTop: 10,
    },
    commentItem: {
        padding: 10,
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
    },
    commentsHeader: {
        fontSize: 18,
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
    lightBackground: {
        backgroundColor: '#ffffff',
    },
    darkBackground: {
        backgroundColor: '#121212',
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
    },
    favoriteButton: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
    },
    favoriteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    details: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
});