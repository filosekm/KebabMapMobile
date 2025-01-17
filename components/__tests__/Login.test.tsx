import React from 'react';
import { render } from '@testing-library/react-native';
import LoginScreen from '@/app/(auth)/Login.tsx';
import { AuthContext } from '@/context/AuthContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('@/components/BackButton', () => 'MockedBackButton');

describe('LoginScreen Component', () => {
    test('renders correctly', () => {
        const { getAllByText, getByText } = render(
            <AuthContext.Provider value={{ login: jest.fn() }}>
                <LoginScreen />
            </AuthContext.Provider>
        );

        const loginButtons = getAllByText('Zaloguj się');
        expect(loginButtons.length).toBeGreaterThan(0);

        expect(getByText('Nie masz konta? Zarejestruj się')).toBeTruthy();
    });
});
