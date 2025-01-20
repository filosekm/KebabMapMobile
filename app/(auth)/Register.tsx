import React, { useContext, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import BackButton from '@/components/BackButton';
import styles from '../styles/LoginStyles';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const router = useRouter();


    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert('Validation Error', 'Email and password cannot be empty.');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Validation Error', 'Please enter a valid email address.');
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert('Validation Error', 'Password must be at least 8 characters long.');
            return;
        }

        try {
            const response = await fetch('https://kebabapipanel-tg6o.onrender.com/api/register_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                login(data.token, email);
                router.push('/(tabs)/Profile');
            } else {
                Alert.alert('Registration Error', data.message || 'Failed to register. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred during registration. Please try again later.');
            console.error('Registration error:', error);
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
            <BackButton />
            <View style={[
                styles.centeredContainer,
                colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer
            ]}>
                <Text style={[
                    styles.title,
                    colorScheme === 'dark' ? styles.darkText : styles.lightText
                ]}>
                    Register
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

                <TouchableOpacity testID="register-button"
                    style={[
                        styles.button,
                        { backgroundColor: colorScheme === 'dark' ? '#f39c12' : '#4CAF50' }
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
