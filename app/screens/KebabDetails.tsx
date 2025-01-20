import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, Alert, FlatList, Image, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocalSearchParams } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { AntDesign } from '@expo/vector-icons';
import styles from '../styles/KebabDetailsStyles';
import BackButton from '@/components/BackButton';
import { ScrollView } from 'react-native-virtualized-view'


type CommentType = {
    id: string;
    user: string;
    text: string;
};

type OpeningHours = {
    [day: string]: {
        open: string;
        close: string;
    };
};


type KebabDetailsType = {
    id: string;
    title: string;
    logo: string;
    location: string;
    latitude: number;
    longitude: number;
    description: string;
    opening_hours: OpeningHours | string;
    rating: number;
    yearOpened: number;
    yearClosed: number | null;
    hours: OpeningHours;
    meats: string[];
    sauces: string[];
    status: string;
    craft: boolean;
    orderMethods: string[];
    isFavorite: boolean;
};

export default function KebabDetails() {
    const {userEmail, userToken} = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const {markerId} = useLocalSearchParams<{ markerId: string }>();
    const [kebabDetails, setKebabDetails] = useState<KebabDetailsType | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [newComment, setNewComment] = useState('');
    const [openingHours, setOpeningHours] = useState<OpeningHours | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (markerId) {
            fetchKebabDetails();
            fetchComments();
            fetchFavoriteStatus();
        }
    }, [markerId]);

    useEffect(() => {
        if (kebabDetails) {
            fetchOpeningHours();
        }
    }, [kebabDetails]);



    const daysTranslation = {
        monday: "Poniedziałek",
        tuesday: "Wtorek",
        wednesday: "Środa",
        thursday: "Czwartek",
        friday: "Piątek",
        saturday: "Sobota",
        sunday: "Niedziela",
    };
    const fetchKebabDetails = async () => {
        try {
            const response = await fetch(`https://kebabapipanel-tg6o.onrender.com/api/kebabs/${markerId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch kebab details: ${response.status}`);
            }
            const data = await response.json();


            const mappedData: KebabDetailsType = {
                id: data.id?.toString() || '0',
                title: data.name || 'Brak tytułu',
                logo: data.logo || '',
                location: data.description || 'Brak adresu',
                latitude: data.latitude || 0,
                longitude: data.longitude || 0,
                description: data.location_details || 'Brak opisu',
                opening_hours: data.opening_hours || 'Brak danych',
                rating: data.google_rating || 0,
                yearOpened: data.year_opened || new Date().getFullYear(),
                yearClosed: data.year_closed || null,
                hours: typeof data.opening_hours === 'string' ? JSON.parse(data.opening_hours) : data.opening_hours || {},
                meats: data.meats ? data.meats.split(', ') : [],
                sauces: data.sauces ? data.sauces.split(', ') : [],
                status: data.status || 'unknown',
                craft: Boolean(data.craft_rating),
                orderMethods: data.order_methods ? data.order_methods.split(', ') : [],
                isFavorite: data.is_favorite || false,
            };

            setKebabDetails(mappedData);
        } catch (error) {
            setErrorMessage('Error fetching kebab details:');
        }
    };


    const fetchOpeningHours = async () => {
        if (!userToken) {
            console.error('User token is required to fetch opening hours.');
            return;
        }

        if (!kebabDetails?.title) {
            console.warn('Kebab details or title is missing. Skipping fetchOpeningHours.');
            return;
        }

        try {
            const response = await fetch('https://kebabapipanel-tg6o.onrender.com/api/kebab-hours', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch opening hours: ${response.status}`);
            }

            const data = await response.json();
            const kebabHours = data.find((item: { name: string }) => item.name === kebabDetails.title);

            if (kebabHours) {
                const parsedHours = typeof kebabHours.hours === 'string'
                    ? JSON.parse(kebabHours.hours.replace(/'/g, '"'))
                    : kebabHours.hours;
                setOpeningHours(parsedHours);
            } else {
                console.warn('No opening hours found for:', kebabDetails.title);
            }
        } catch (error) {
            setErrorMessage('Error fetching opening hours:');
        }
    };


    const fetchComments = async () => {
        try {
            const response = await fetch(`https://kebabapipanel-tg6o.onrender.com/api/kebabs/${markerId}/comments`);
            if (!response.ok) {
                throw new Error(`Failed to fetch comments: ${response.status}`);
            }
            const data: CommentType[] = await response.json();
            setComments(data);
        } catch (error) {
            setErrorMessage('Error fetching comments');
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
            const response = await fetch(`https://kebabapipanel-tg6o.onrender.com/api/kebabs/${markerId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    text: newComment,
                }),
            });

            if (response.ok) {
                setNewComment('');
                fetchComments();
            } else {
                const errorData = await response.json();
                Alert.alert('Error', errorData.message || 'Failed to add comment.');
            }
        } catch (error) {
            setErrorMessage('Error adding comment:');
        }
    };

    const fetchFavoriteStatus = async () => {
        if (!userToken) return;

        try {
            const response = await fetch(`https://kebabapipanel-tg6o.onrender.com/api/favorites`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const isFav = data.some((fav: { id: number; is_favorite: boolean }) =>
                    fav.id.toString() === markerId && fav.is_favorite
                );

                setIsFavorite(isFav);
            } else {
                console.error('Failed to fetch favorite status:', response.status);
            }
        } catch (error) {
            setErrorMessage('Nie udało się pobrać statusu ulubionego.');
        }
    };

    const toggleFavorite = async () => {
        if (!userToken) {
            Alert.alert('Error', 'You must be logged in to modify favorites.');
            return;
        }

        const endpoint = isFavorite
            ? `https://kebabapipanel-tg6o.onrender.com/api/kebabs/${markerId}/unfavorite`
            : `https://kebabapipanel-tg6o.onrender.com/api/kebabs/${markerId}/favorite`;

        const method = isFavorite ? 'DELETE' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
            });

            if (response.ok) {
                setIsFavorite(!isFavorite);
                Alert.alert(
                    'Success',
                    isFavorite
                        ? 'Removed from favorites!'
                        : 'Added to favorites!'
                );
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                Alert.alert(
                    'Error',
                    errorData.message || 'Failed to update favorites. Please try again.'
                );
            }
        } catch (error) {
            setErrorMessage('Error toggling favorite');
            Alert.alert('Error', 'An unexpected error occurred.');
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
            <View style={styles.header}>
                <BackButton/>
                <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                    {kebabDetails?.title}
                </Text>
                <TouchableOpacity testID="favorite-button" onPress={toggleFavorite}>
                    <AntDesign
                        name={isFavorite ? 'heart' : 'hearto'}
                        size={24}
                        color={isFavorite ? 'red' : isDarkMode ? 'white' : 'black'}
                        style={{marginTop: 18}}
                    />
                </TouchableOpacity>
            </View>



            <ScrollView
                style={styles.scrollContent}
                contentContainerStyle={styles.scrollContainer}
                nestedScrollEnabled={true}
            >

            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}

                    initialRegion={{
                        latitude: kebabDetails?.latitude || 0,
                        longitude: kebabDetails?.longitude || 0,
                        latitudeDelta: 0.001,
                        longitudeDelta: 0.001,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: kebabDetails?.latitude || 0,
                            longitude: kebabDetails?.longitude || 0,
                        }}
                        image={require('@/assets/images/kebab-icon.png')}
                        title={kebabDetails?.title}
                    />
                </MapView>
            </View>
                <ImageBackground
                    source={
                        kebabDetails?.logo
                            ? { uri: kebabDetails.logo }
                            : require('@/assets/images/default-logo.png')
                    }
                    style={[styles.infoContainer, isDarkMode ? styles.darkInfoContainer : styles.lightInfoContainer]}
                    imageStyle={styles.backgroundImage}
                >
                <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                    Adres:
                </Text>
                <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                    {kebabDetails?.location || 'Brak adresu'}
                </Text>

                <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                    Rok otwarcia:
                </Text>
                <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                    {kebabDetails?.yearOpened}
                </Text>

                {kebabDetails?.yearClosed ? (
                    <>
                        <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                            Rok zamknięcia:
                        </Text>
                        <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                            {kebabDetails?.yearClosed}
                        </Text>
                    </>
                ) : (
                    <>
                        <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                            Status:
                        </Text>
                        <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                            {kebabDetails?.status === 'open' ? 'Otwarty' : 'Nieznany'}
                        </Text>
                    </>
                )}

                    <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                        Ocena:
                    </Text>
                    <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                        {kebabDetails?.rating?.toFixed(1)} ⭐
                    </Text>

                    {kebabDetails?.description ? (
                        <>
                            <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                                Opis:
                            </Text>
                            <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                                {kebabDetails.description}
                            </Text>
                        </>
                    ) : null}

                    <View style={styles.openingHoursContainer}>
                        <TouchableOpacity
                            style={styles.openingHoursHeader}
                            onPress={() => setIsExpanded(!isExpanded)}
                        >
                            <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                                Godziny otwarcia:
                            </Text>
                            <AntDesign
                                name={isExpanded ? 'up' : 'down'}
                                size={16}
                                color={isDarkMode ? '#fff' : '#000'}
                            />
                        </TouchableOpacity>

                        {isExpanded ? (
                            openingHours ? (
                                Object.entries(openingHours).map(([day, times]) => (
                                    <Text key={day} style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                                        {`${daysTranslation[day] || day}: ${times.open} - ${times.close}`}
                                    </Text>
                                ))
                            ) : (
                                <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                                    Brak danych o godzinach otwarcia.
                                </Text>
                            )
                        ) : (
                            (() => {
                                const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                                const todayTimes = openingHours?.[today];
                                const todayTranslated = daysTranslation[today] || today;
                                return (
                                    <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                                        {`${todayTranslated}: ${todayTimes?.open || 'Brak'} - ${todayTimes?.close || 'Brak'}`}
                                    </Text>
                                );
                            })()
                        )}
                    </View>
                <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                    Rodzaje mięs:
                </Text>
                <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                    {kebabDetails?.meats.length > 0 ? kebabDetails.meats.join(', ') : 'Brak danych'}
                </Text>

                <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                    Sosy:
                </Text>
                <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                    {kebabDetails?.sauces.length > 0 ? kebabDetails.sauces.join(', ') : 'Brak danych'}
                </Text>

                <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                    Kraftowość:
                </Text>
                <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                    {kebabDetails?.craft ? 'Tak' : 'Nie'}
                </Text>

                <Text style={[styles.details, styles.detailTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                    Metody zamówienia:
                </Text>
                <Text style={[styles.details, styles.detailValue, isDarkMode ? styles.darkText : styles.lightText]}>
                    {kebabDetails?.orderMethods.length > 0 ? kebabDetails.orderMethods.join(', ') : 'Brak danych'}
                </Text>
                </ImageBackground>


            <Text style={[styles.commentsHeader, isDarkMode ? styles.darkText : styles.lightText]}>
                Comments
            </Text>

            <FlatList
                data={comments}
                keyExtractor={(item) => item.id.toString()}
                nestedScrollEnabled={true}
                renderItem={({item}) => (
                    <View
                        style={[
                            styles.commentItem,
                            isDarkMode ? styles.darkComment : styles.lightComment,
                        ]}
                    >
                        <Text style={[styles.commentUser, isDarkMode ? styles.darkText : styles.lightText]}>
                            {item.user}
                        </Text>
                        <Text style={[styles.commentContent, isDarkMode ? styles.darkText : styles.lightText]}>
                            {item.text}
                        </Text>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                        There are no comments yet.
                    </Text>
                )}
                style={styles.commentsList}
            />

            <View style={styles.addCommentContainer}>
                <TextInput
                    style={[
                        styles.input,
                        isDarkMode ? styles.darkInput : styles.lightInput,
                    ]}
                    placeholder="Add a comment..."
                    placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity
                    style={[
                        styles.addButton,
                        {backgroundColor: colorScheme === 'dark' ? '#f39c12' : '#4CAF50'},
                    ]}
                    onPress={handleAddComment}
                >
                    <Text>Add</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    );
}
