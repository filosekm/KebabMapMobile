
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, useColorScheme } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

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
            const response = await fetch('http://192.168.0.210/kebab_api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
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
        <View style={[styles.container, colorScheme === 'dark' ? styles.darkContainer : styles.lightContainer]}>
            <Text style={[styles.title, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                Rejestracja
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
                style={[styles.registerButton, { backgroundColor: colorScheme === 'dark' ? '#f39c12' : '#4CAF50' }]}
                onPress={handleRegister}
            >
                <Text style={styles.registerButtonText}>Zarejestruj się</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToLogin}>
                <Text style={[styles.loginLink, colorScheme === 'dark' ? styles.darkText : styles.lightText]}>
                    Masz już konto? Zaloguj się
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
    registerButton: {
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loginLink: {
        marginTop: 20,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});
