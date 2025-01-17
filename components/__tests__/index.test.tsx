import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/index';
import { useRouter } from 'expo-router';

jest.mock('@/components/MapComponent', () => ({
    __esModule: true,
    default: ({ markers, onMarkerPress }: { markers: any[]; onMarkerPress: any }) => {
        const React = require('react');
        const { View, TouchableOpacity, Text } = require('react-native');
        return (
            <View testID="map-container">
                {markers.map((marker) => (
                    <TouchableOpacity
                        key={marker.id}
                        testID={`marker-${marker.id}`}
                        onPress={() => onMarkerPress(marker)}
                    >
                        <Text>{marker.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    },
}));


jest.mock('expo-router', () => ({
    useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('HomeScreen Component', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    });

    test('renders correctly with title and map', () => {
        const { getByText } = render(<HomeScreen />);
        expect(getByText('Kebab Map')).toBeTruthy();
    });

    test('fetches and displays markers', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce([
                { id: '1', latitude: 51.21, longitude: 16.16, title: 'Kebab Place 1', description: 'Tasty kebab' },
                { id: '2', latitude: 51.22, longitude: 16.17, title: 'Kebab Place 2', description: 'Delicious kebab' },
            ]),
        });

        const { getByText } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByText('Kebab Place 1')).toBeTruthy();
            expect(getByText('Kebab Place 2')).toBeTruthy();
        });
    });


    test('handles marker press and navigates to details', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: '1', latitude: 51.21, longitude: 16.16, title: 'Kebab Place 1', description: 'Tasty kebab' },
            ],
        });

        const { getByTestId } = render(<HomeScreen />);

        await waitFor(() => {
            expect(getByTestId('marker-1')).toBeTruthy();
        });

        fireEvent.press(getByTestId('marker-1'));

        expect(mockPush).toHaveBeenCalledWith({
            pathname: '/screens/KebabDetails',
            params: { markerId: '1' },
        });
    });
});
