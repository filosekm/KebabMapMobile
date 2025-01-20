import React, {useContext, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, useColorScheme, View} from 'react-native';
import {AuthContext} from '@/context/AuthContext';
import {useRouter} from 'expo-router';
import BackButton from "@/components/BackButton";
import styles from '../styles/LoginStyles';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch('https://kebabapipanel-tg6o.onrender.com/api/login_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                await login(data.token, email);
                router.push('/(tabs)/Profile');
            } else {
                Alert.alert('Login Error', data.message || 'Invalid login credentials.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred during login.');
        }
    };



    const navigateToRegister = () => {
        router.push('/(auth)/Register');
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
                    Zaloguj się
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
                    placeholder="Hasło"
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
                    onPress={handleLogin}
                    testID="login-button"
                >
                    <Text style={styles.buttonText}>Zaloguj się</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToRegister}>
                    <Text style={[
                        styles.link,
                        colorScheme === 'dark' ? styles.darkText : styles.lightText
                    ]}>
                        Nie masz konta? Zarejestruj się
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
