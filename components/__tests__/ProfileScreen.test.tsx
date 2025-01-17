import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/Profile.tsx';
import { AuthContext } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('@/components/BackButton', () => 'MockedBackButton');

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({
        push: mockPush,
    })),
}));

describe('ProfileScreen Component', () => {
    const mockLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ userEmail: 'test@example.com', logout: mockLogout }}>
                <ProfileScreen />
            </AuthContext.Provider>
        );

        expect(getByText('test')).toBeTruthy();

        expect(getByText('Wyloguj')).toBeTruthy();
    });

    test('handles logout correctly', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ userEmail: 'test@example.com', logout: mockLogout }}>
                <ProfileScreen />
            </AuthContext.Provider>
        );

        fireEvent.press(getByText('Wyloguj'));

        expect(mockLogout).toHaveBeenCalled();

        expect(mockPush).toHaveBeenCalledWith('/(auth)/Login');
    });
});
