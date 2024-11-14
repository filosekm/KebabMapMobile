import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, useColorScheme } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const { userEmail, logout } = useContext(AuthContext);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';
    const [username, setUsername] = useState('');
    const [profileImage, setProfileImage] = useState<string | null>(null);

    useEffect(() => {
        if (userEmail) {
            setUsername(userEmail.split('@')[0]);
        }
    }, [userEmail]);

    const handleLogout = () => {
        logout();
        router.push('/(auth)/Login');
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Brak dostępu', 'Potrzebny jest dostęp do galerii, aby wybrać zdjęcie.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <View style={[styles.placeholderImage, isDarkMode ? styles.darkPlaceholder : styles.lightPlaceholder]}>
                        <Text style={styles.placeholderText}>Dodaj zdjęcie</Text>
                    </View>
                )}
            </TouchableOpacity>
            <Text style={[styles.username, isDarkMode ? styles.darkText : styles.lightText]}>{username}</Text>
            <TouchableOpacity onPress={handleLogout} style={[styles.button, { backgroundColor: isDarkMode ? "#f39c12" : "#4CAF50" }]}>
                <Text style={styles.buttonText}>Wyloguj</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightPlaceholder: {
        backgroundColor: '#ecf0f1',
    },
    darkPlaceholder: {
        backgroundColor: '#34495e',
    },
    placeholderText: {
        color: '#7f8c8d',
        fontSize: 14,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    lightBackground: {
        backgroundColor: '#ffffff',
    },
    darkBackground: {
        backgroundColor: '#121212',
    },
    lightText: {
        color: '#34495e',
    },
    darkText: {
        color: '#ecf0f1',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        width: '60%',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
