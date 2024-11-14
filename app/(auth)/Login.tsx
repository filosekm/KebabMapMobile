import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, useColorScheme } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.0.210/kebab_api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log("Received data from API:", data); // Logowanie odpowiedzi API

            if (response.ok && data.token) {  // Sprawdzanie, czy token istnieje
                await login(data.token);  // Zapisz token w kontekście
                router.push('/(tabs)/Profile');  // Przekieruj do profilu
            } else {
                Alert.alert('Błąd logowania', data.message || 'Nieprawidłowe dane logowania');
            }
        } catch (error) {
            Alert.alert('Błąd', 'Wystąpił problem z logowaniem. Spróbuj ponownie później.');
        }
    };

    const navigateToRegister = () => {
        router.push('/(auth)/Register');
    };

    return (
        <View style={[styles.container, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
            <Text style={[styles.title, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                Zaloguj się
            </Text>

            <TextInput
                style={colorScheme === 'dark' ? styles.darkInput : styles.lightInput}
                placeholder="Email"
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#555'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={colorScheme === 'dark' ? styles.darkInput : styles.lightInput}
                placeholder="Hasło"
                placeholderTextColor={colorScheme === 'dark' ? '#aaa' : '#555'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: colorScheme === 'dark' ? '#f39c12' : '#4CAF50' }]}
                onPress={handleLogin}
            >
                <Text style={styles.loginButtonText}>Zaloguj się</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToRegister}>
                <Text style={[styles.registerLink, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                    Nie masz konta? Zarejestruj się
                </Text>
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
    lightContainer: {
        backgroundColor: '#ffffff',
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    lightText: {
        color: '#000',
    },
    darkText: {
        color: '#fff',
    },
    lightInput: {
        width: '100%',
        backgroundColor: '#f1f1f1',
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        color: '#000',
    },
    darkInput: {
        width: '100%',
        backgroundColor: '#333',
        borderColor: '#555',
        borderWidth: 1,
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        color: '#fff',
    },
    loginButton: {
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    registerLink: {
        marginTop: 20,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
