import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import KebabDetails from '@/app/screens/KebabDetails';
import { AuthContext } from '@/context/AuthContext';

jest.mock('react-native-maps', () => ({
    __esModule: true,
    default: jest.fn(() => null),
    Marker: jest.fn(() => null),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
    useLocalSearchParams: jest.fn(() => ({ markerId: 'mockMarkerId' })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

global.fetch = jest.fn((url) => {
    if (url.includes('favorites')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 'mockMarkerId' }]),
        });
    }
    if (url.includes('opening_hours')) {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ name: 'Mock Kebab', hours: '{}' }]),
        });
    }
    return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            id: '1',
            title: 'Mock Kebab',
            location: 'Mock Location',
            latitude: 51.1,
            longitude: 16.1,
            opening_hours: '{}',
        }),
    });
});

describe('KebabDetails Component', () => {
    test('renders without crashing', async () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ userEmail: 'test@example.com', userToken: 'mock-token' }}>
                <KebabDetails />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(getByText('Mock Kebab')).toBeTruthy();
        });
    });
});
