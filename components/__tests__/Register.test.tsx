import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '@/app/(auth)/Register';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

jest.mock('@/components/BackButton', () => 'MockedBackButton');

jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('RegisterScreen Component', () => {
    const mockLogin = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    test('renders correctly', () => {
        const { getByPlaceholderText, getByTestId } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
        expect(getByTestId('register-button')).toBeTruthy();
    });

    test('displays validation errors for empty fields', () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        fireEvent.press(getByTestId('register-button'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Validation Error',
            'Email and password cannot be empty.'
        );
    });

    test('displays validation error for invalid email', () => {
        const { getByPlaceholderText, getByTestId } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'invalidemail');
        fireEvent.changeText(getByPlaceholderText('Password'), 'validPassword123');
        fireEvent.press(getByTestId('register-button'));

        expect(Alert.alert).toHaveBeenCalledWith(
            'Validation Error',
            'Please enter a valid email address.'
        );
    });

    test('handles successful registration', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: 'mock-token' }),
            })
        );

        const { getByPlaceholderText, getByTestId } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'validPassword123');
        fireEvent.press(getByTestId('register-button'));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('mock-token', 'test@example.com');
            expect(mockPush).toHaveBeenCalledWith('/(tabs)/Profile');
        });
    });

    test('displays error for failed registration', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ message: 'Registration failed.' }),
            })
        );

        const { getByPlaceholderText, getByTestId } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
        fireEvent.changeText(getByPlaceholderText('Password'), 'validPassword123');
        fireEvent.press(getByTestId('register-button'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Registration Error',
                'Registration failed.'
            );
        });
    });

    test('navigates to login screen when "Already have an account? Log in" is pressed', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ login: mockLogin }}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        fireEvent.press(getByText('Already have an account? Log in'));

        expect(mockPush).toHaveBeenCalledWith('/(auth)/Login');
    });
});
