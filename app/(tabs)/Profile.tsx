import React, {useContext, useEffect, useState} from 'react';
import {Alert, Image, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import {AuthContext} from '@/context/AuthContext';
import {useRouter} from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import BackButton from "@/components/BackButton";
import styles from '../styles/ProfileStyles'

export default function ProfileScreen() {
    const {userEmail, logout} = useContext(AuthContext);
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
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
            <BackButton/>
            <View style={[styles.Infocontainer, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
                <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                    {profileImage ? (
                        <Image source={{uri: profileImage}} style={styles.profileImage}/>
                    ) : (
                        <View
                            style={[styles.placeholderImage, isDarkMode ? styles.darkPlaceholder : styles.lightPlaceholder]}>
                            <Text style={styles.placeholderText}>Dodaj zdjęcie</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={[styles.username, isDarkMode ? styles.darkText : styles.lightText]}>{username}</Text>
                <TouchableOpacity onPress={handleLogout}
                                  style={[styles.button, {backgroundColor: isDarkMode ? "#f39c12" : "#4CAF50"}]}>
                    <Text style={styles.buttonText}>Wyloguj</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

