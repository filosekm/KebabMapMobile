import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '@/app/(tabs)/Profile';
import { AuthContext } from '@/context/AuthContext';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

jest.mock('expo-image-picker', () => ({
    launchImageLibraryAsync: jest.fn(),
    requestMediaLibraryPermissionsAsync: jest.fn(),
    MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('@/components/BackButton', () => 'MockedBackButton');
jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

describe('ProfileScreen Component', () => {
    const mockLogout = jest.fn();
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    });

    test('renders correctly with light mode', () => {
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

    test('displays an alert if gallery permissions are denied', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
            status: 'denied',
        });

        const { getByText } = render(
            <AuthContext.Provider value={{ userEmail: 'test@example.com', logout: mockLogout }}>
                <ProfileScreen />
            </AuthContext.Provider>
        );

        fireEvent.press(getByText('Dodaj zdjęcie'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Brak dostępu',
                'Potrzebny jest dostęp do galerii, aby wybrać zdjęcie.'
            );
        });
    });

    test('sets profile image after successful image selection', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
            status: 'granted',
        });
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
            canceled: false,
            assets: [{ uri: 'mock-image-uri' }],
        });

        const { getByText, getByTestId } = render(
            <AuthContext.Provider value={{ userEmail: 'test@example.com', logout: mockLogout }}>
                <ProfileScreen />
            </AuthContext.Provider>
        );

        fireEvent.press(getByText('Dodaj zdjęcie'));

        await waitFor(() => {
            const image = getByTestId('profile-image');
            expect(image.props.source.uri).toBe('mock-image-uri');
        });
    });

    test('does not set profile image if selection is canceled', async () => {
        (ImagePicker.requestMediaLibraryPermissionsAsync as jest.Mock).mockResolvedValueOnce({
            status: 'granted',
        });
        (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
            canceled: true,
        });

        const { getByText } = render(
            <AuthContext.Provider value={{ userEmail: 'test@example.com', logout: mockLogout }}>
                <ProfileScreen />
            </AuthContext.Provider>
        );

        fireEvent.press(getByText('Dodaj zdjęcie'));

        await waitFor(() => {
            expect(Alert.alert).not.toHaveBeenCalled();
        });
    });

});
