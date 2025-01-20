import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import MapComponent from '../MapComponent';

jest.mock('react-native-maps', () => {
    const React = require('react');
    const { View, Text } = require('react-native');

    const MockMapView = ({ children }) => <View testID="mapView">{children}</View>;
    const MockMarker = ({ children }) => <View testID="marker">{children}</View>;
    const MockCallout = ({ children }) => <View testID="callout">{children}</View>;

    return {
        __esModule: true,
        default: MockMapView,
        Marker: MockMarker,
        Callout: MockCallout,
    };
});

describe('MapComponent', () => {
    const mockMarkers = [
        {
            id: '1',
            latitude: 51.21,
            longitude: 16.16,
            title: 'Kebab Place',
            description: 'Delicious kebab here!',
        },
        {
            id: '2',
            latitude: 51.211,
            longitude: 16.161,
            title: 'Another Kebab',
            description: 'Another great kebab place!',
        },
    ];

    const mockOnMarkerPress = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders all markers', () => {
        const { getByText } = render(
            <MapComponent markers={mockMarkers} onMarkerPress={mockOnMarkerPress} />
        );

        expect(getByText('Kebab Place')).toBeTruthy();
        expect(getByText('Another Kebab')).toBeTruthy();
    });

    test('opens modal on marker press and shows loading message', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ description: 'Loaded kebab details' }),
        });

        const { getByText } = render(
            <MapComponent markers={mockMarkers} onMarkerPress={mockOnMarkerPress} />
        );

        fireEvent.press(getByText('Kebab Place'));

        expect(getByText('Loading...')).toBeTruthy();

        await waitFor(() => {
            expect(getByText('Loaded kebab details')).toBeTruthy();
        });
    });

    test('calls onMarkerPress and closes modal when "Go to Details" is pressed', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ description: 'Detailed kebab info' }),
        });

        const { getByText } = render(
            <MapComponent markers={mockMarkers} onMarkerPress={mockOnMarkerPress} />
        );

        fireEvent.press(getByText('Kebab Place'));

        await waitFor(() => {
            expect(getByText('Detailed kebab info')).toBeTruthy();
        });

        fireEvent.press(getByText('Go to Details'));

        expect(mockOnMarkerPress).toHaveBeenCalledWith(mockMarkers[0]);

        expect(() => getByText('Detailed kebab info')).toThrow();
    });

    test('closes modal when "Close" button is pressed', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ description: 'Test kebab details' }),
        });

        const { getByText } = render(
            <MapComponent markers={mockMarkers} onMarkerPress={mockOnMarkerPress} />
        );

        fireEvent.press(getByText('Kebab Place'));

        await waitFor(() => {
            expect(getByText('Test kebab details')).toBeTruthy();
        });

        fireEvent.press(getByText('Close'));

        expect(() => getByText('Test kebab details')).toThrow();
    });

    test('handles fetch failure gracefully and logs error', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));

        const { getByText } = render(
            <MapComponent markers={mockMarkers} onMarkerPress={mockOnMarkerPress} />
        );

        fireEvent.press(getByText('Kebab Place'));

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                'Błąd podczas pobierania szczegółów kebaba:',
                expect.any(Error)
            );
        });
    });
});
