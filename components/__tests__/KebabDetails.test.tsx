import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import KebabDetails from '@/app/screens/KebabDetails';
import { AuthContext } from '@/context/AuthContext';
import { Alert } from 'react-native';

jest.mock('react-native-maps', () => ({
    __esModule: true,
    default: jest.fn(() => null),
    Marker: jest.fn(() => null),
}));

jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
    useLocalSearchParams: jest.fn(() => ({ markerId: 'mockMarkerId' })),
}));

jest.spyOn(Alert, 'alert');

beforeEach(() => {
    global.fetch = jest.fn((url) => {
        const urlString = String(url);
        if (urlString.includes('/api/kebabs/mockMarkerId/comments')) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { id: '1', user: 'Test User', text: 'Great kebab!' },
                        { id: '2', user: 'Another User', text: 'Amazing taste!' },
                    ]),
            });
        }
        if (urlString.includes('/api/kebabs/mockMarkerId')) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        id: 'mockMarkerId',
                        title: 'Mock Kebab',
                        location: 'Mock Location',
                        latitude: 51.1,
                        longitude: 16.1,
                        google_rating: 4.5,
                        meats: 'Chicken,Beef',
                        sauces: 'Garlic,Spicy',
                        description: 'A delicious mock kebab.',
                        opening_hours: '{"monday": {"open": "10:00", "close": "22:00"}}',
                    }),
            });
        }
        if (urlString.includes('/api/kebab-hours')) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        { name: 'Mock Kebab', hours: '{"monday": {"open": "10:00", "close": "22:00"}}' },
                    ]),
            });
        }
        return Promise.reject(new Error('Unexpected API endpoint'));
    });

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('KebabDetails Component', () => {
    test('renders without crashing and displays kebab details', async () => {
        const { getByText, debug } = render(
            <AuthContext.Provider value={{ userEmail: 'test@example.com', userToken: 'mock-token' }}>
                <KebabDetails />
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(getByText('Mock Kebab')).toBeTruthy();
            expect(getByText('Mock Location')).toBeTruthy();
        });

        // Ensure opening hours are displayed correctly
        await waitFor(() => {
            expect(getByText('Poniedziałek: 10:00 - 22:00')).toBeTruthy();
        });

        // Verify other kebab details
        expect(getByText('Chicken, Beef')).toBeTruthy();
        expect(getByText('Garlic, Spicy')).toBeTruthy();
        expect(getByText('4.5 ⭐')).toBeTruthy();
        expect(getByText('A delicious mock kebab.')).toBeTruthy();
    });

    test('displays comments or no comments message', async () => {
        const { findByText } = render(
            <AuthContext.Provider value={{ userEmail: 'test@example.com', userToken: 'mock-token' }}>
                <KebabDetails />
            </AuthContext.Provider>
        );

        const userComment = await findByText('Test User');
        const commentText = await findByText('Great kebab!');

        expect(userComment).toBeTruthy();
        expect(commentText).toBeTruthy();
    });

    test('toggles favorite status', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={{ userEmail: 'test@example.com', userToken: 'mock-token' }}>
                <KebabDetails />
            </AuthContext.Provider>
        );

        const favoriteButton = await waitFor(() => getByTestId('favorite-button'));

        fireEvent.press(favoriteButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Added to favorites!');
        });

        fireEvent.press(favoriteButton);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Removed from favorites!');
        });
    });
});
