import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '@/app/(auth)/Login';
import { AuthContext } from '@/context/AuthContext';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

jest.mock('@/components/BackButton', () => 'MockedBackButton');
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('LoginScreen Component', () => {
    const mockLogin = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        jest.spyOn(Alert, 'alert').mockImplementation(() => {}); // Mock Alert.alert
    });

    test('renders correctly', () => {
        const { getByPlaceholderText, getByText, getAllByText } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <LoginScreen />
            </AuthContext.Provider>
        );

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Hasło')).toBeTruthy();
        expect(getAllByText('Zaloguj się').length).toBeGreaterThan(0);
        expect(getByText('Nie masz konta? Zarejestruj się')).toBeTruthy();
    });

    test('handles successful login', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: 'mock-token' }),
            })
        );

        const { getByPlaceholderText, getByTestId } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <LoginScreen />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Hasło'), 'validPassword123');
        fireEvent.press(getByTestId('login-button'));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('mock-token', 'test@example.com');
            expect(mockPush).toHaveBeenCalledWith('/(tabs)/Profile');
        });
    });

    test('displays error for invalid credentials', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Invalid credentials.' }),
            })
        );

        const { getByPlaceholderText, getByTestId } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <LoginScreen />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Hasło'), 'wrongPassword');
        fireEvent.press(getByTestId('login-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Login Error', 'Invalid credentials.');
        });
    });

    test('displays error for unexpected error during login', async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error('Unexpected error')));

        const { getByPlaceholderText, getByTestId } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <LoginScreen />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Hasło'), 'validPassword123');
        fireEvent.press(getByTestId('login-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'An unexpected error occurred during login.'
            );
        });
    });
});
