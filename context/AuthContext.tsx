import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    userToken: string | null;
    userEmail: string | null;
    login: (token: string, email: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    userToken: null,
    userEmail: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const loadAuthData = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const email = await AsyncStorage.getItem('userEmail');
            if (token) setUserToken(token);
            if (email) setUserEmail(email);
        };
        loadAuthData();
    }, []);

    const login = async (token: string, email: string | undefined) => {
        try {
            await AsyncStorage.setItem('authToken', token);
            if (email) {
                await AsyncStorage.setItem('userEmail', email);
                setUserEmail(email);
            } else {
                console.warn("No email provided, falling back to 'unknown@example.com'");
                await AsyncStorage.setItem('userEmail', 'unknown@example.com');
                setUserEmail('unknown@example.com');
            }
            setUserToken(token);
        } catch (error) {
            console.error('Error saving auth data to AsyncStorage:', error);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userEmail');
        setUserToken(null);
        setUserEmail(null);
    };

    return (
        <AuthContext.Provider value={{ userToken, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
