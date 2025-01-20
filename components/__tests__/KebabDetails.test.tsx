import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import KebabDetails from '@/app/screens/KebabDetails';
import { AuthContext } from '@/context/AuthContext';
import { Alert } from 'react-native';

jest.mock('@/components/BackButton', () => 'MockedBackButton');
jest.mock('@expo/vector-icons', () => ({ AntDesign: jest.fn(() => null) }));
jest.mock('expo-font', () => ({ loadAsync: jest.fn() }));
jest.mock('react-native-maps', () => ({ __esModule: true, default: jest.fn(() => null), Marker: jest.fn(() => null) }));
jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() })),
    useLocalSearchParams: jest.fn(() => ({ markerId: 'mockMarkerId' })),
}));

const mockFetchResponse = (data: any, ok = true) =>
    Promise.resolve({
        ok,
        status: ok ? 200 : 400,
        json: async () => data,
    });

const mockAuthContext = {
    userEmail: 'test@example.com',
    userToken: 'mock-token',
    login: jest.fn(),
    logout: jest.fn(),
};

describe('KebabDetails Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

        global.fetch = jest.fn((url: string) => {
            if (url.includes('/api/kebabs/mockMarkerId')) {
                return mockFetchResponse({
                    id: 'mockMarkerId',
                    name: 'Mock Kebab',
                    location_details: 'Mock Location',
                    latitude: 51.1,
                    longitude: 16.1,
                    google_rating: 4.5,
                    meats: 'Chicken, Beef',
                    sauces: 'Garlic, Spicy',
                    opening_hours: '{"monday": {"open": "10:00", "close": "22:00"}}',
                    status: 'open',
                    craft_rating: true,
                    order_methods: 'Online, Pickup',
                    is_favorite: false,
                });
            }

            if (url.includes('/api/kebabs/mockMarkerId/comments')) {
                return mockFetchResponse([
                    { id: '1', user: 'John Doe', text: 'Great kebab!' },
                    { id: '2', user: 'Alice', text: 'Amazing taste!' },
                ]);
            }

            if (url.includes('/api/favorites')) {
                return mockFetchResponse([{ id: 'mockMarkerId', is_favorite: false }]);
            }

            return Promise.reject(new Error('Unexpected API endpoint'));
        }) as jest.Mock;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('toggles favorite status', async () => {
        const { getByTestId } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <KebabDetails />
            </AuthContext.Provider>
        );

        const favoriteButton = await waitFor(() => getByTestId('favorite-button'));

        global.fetch = jest.fn(() =>
            mockFetchResponse({ message: 'Added to favorites' })
        ) as jest.Mock;

        await act(async () => {
            fireEvent.press(favoriteButton);
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Added to favorites!');
        });

        global.fetch = jest.fn(() =>
            mockFetchResponse({ message: 'Removed from favorites' })
        ) as jest.Mock;

        await act(async () => {
            fireEvent.press(favoriteButton);
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Success', 'Removed from favorites!');
        });
    });

    test('handles empty comment submission', async () => {
        const { getByText } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <KebabDetails />
            </AuthContext.Provider>
        );

        const addButton = await waitFor(() => getByText('Add'));

        await act(async () => {
            fireEvent.press(addButton);
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Comment cannot be empty.');
        });
    });
});

