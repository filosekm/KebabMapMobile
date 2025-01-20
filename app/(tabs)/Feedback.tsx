import React, { useContext, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
import styles from '../styles/FeedbackStyles';

export default function Feedback() {
    const { userToken } = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const kebabId = 1;

    const handleSendFeedback = async () => {
        if (!userToken) {
            Alert.alert('Error', 'Musisz się zalogować, żeby wysłać feedback');
            return;
        }

        if (!title.trim() || !description.trim() || !email.trim()) {
            Alert.alert('Error', 'Wszystkie pola są wymagane.');
            return;
        }

        setLoading(true);

        const payload = {
            kebab_id: kebabId,
            name: title.trim(),
            email: email.trim(),
            message: description.trim(),
        };

        console.log('Wysyłanie danych:', payload);

        try {
            const response = await fetch('https://kebabapipanel-tg6o.onrender.com/api/suggestions-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify(payload),
            });

            const contentType = response.headers.get('content-type');
            let data;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                throw new Error('Otrzymano nieprawidłową odpowiedź od serwera.');
            }

            if (!response.ok) {
                if (data?.email) {
                    Alert.alert('Nieprawidłowy adres email', data.email[0]);
                } else {
                    Alert.alert('Error', 'Wystąpił nieznany błąd.');
                }
                return;
            }

            Alert.alert('Success', data?.message || 'Pomyślnie wysłano');
            setTitle('');
            setDescription('');
            setEmail('');
        } catch (error) {
            console.error('Błąd wysyłania feedbacku:', error);
            Alert.alert('Error', 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
            <View style={styles.header}>
                <BackButton />
                <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                    Feedback
                </Text>
            </View>
            <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                Podziel się swoimi przemyśleniami o aplikacji lub zgłoś problem.
            </Text>

            <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholder="Twoje imię"
                placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholder="Adres Email"
                placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholder="Wiadomość"
                placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <TouchableOpacity
                style={[
                    styles.addButton,
                    loading ? styles.disabledButton : {},
                    isDarkMode && { backgroundColor: '#f39c12' },
                    !isDarkMode && { backgroundColor: '#4CAF50' },
                ]}
                onPress={handleSendFeedback}
                disabled={loading}
            >
                <Text style={styles.addButtonText}>
                    {loading ? 'Wysyłanie...' : 'Wyślij Feedback'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
