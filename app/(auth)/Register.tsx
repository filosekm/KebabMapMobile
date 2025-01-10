import React, {useContext, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, useColorScheme, View} from 'react-native';
import {AuthContext} from '@/context/AuthContext';
import {useRouter} from 'expo-router';
import BackButton from "@/components/BackButton";
import styles from '../styles/LoginStyles';
import { API_ENDPOINT } from '@env';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const router = useRouter();

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Błąd walidacji', 'Email i hasło nie mogą być puste.');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Błąd walidacji', 'Wprowadź poprawny adres email.');
            return;
        }

        try {
            const response = await fetch('${API_ENDPOINT}/kebab_api/register.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token, email);
                router.push('/(tabs)/Profile');
            } else {
                Alert.alert('Błąd logowania', data.message || 'Nieprawidłowe dane logowania');
            }
        } catch (error) {
            Alert.alert('Błąd', 'Wystąpił problem z rejestracją. Spróbuj ponownie później.');
        }
    };

    const navigateToLogin = () => {
        router.push('/(auth)/Login');
    };

    return (
        <View style={[
            styles.container,
            colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer
        ]}>
            <BackButton/>
            <View style={[
                styles.centeredContainer,
                colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer
            ]}>
                <Text style={[
                    styles.title,
                    colorScheme === 'dark' ? styles.darkText : styles.lightText
                ]}>
                    Rejestracja
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        colorScheme === 'dark' ? styles.darkInput : styles.lightInput
                    ]}
                    placeholder="Email"
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#555'}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={[
                        styles.input,
                        colorScheme === 'dark' ? styles.darkInput : styles.lightInput
                    ]}
                    placeholder="Password"
                    placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#555'}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[
                        styles.button,
                        {backgroundColor: colorScheme === 'dark' ? '#f39c12' : '#4CAF50'}
                    ]}
                    onPress={handleRegister}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToLogin}>
                    <Text style={[
                        styles.link,
                        colorScheme === 'dark' ? styles.darkText : styles.lightText
                    ]}>
                        Already have an account? Log in
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
