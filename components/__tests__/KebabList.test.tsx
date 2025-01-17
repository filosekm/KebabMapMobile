import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import KebabList from '@/app/(tabs)/KebabList.tsx';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

jest.mock('@/app/styles/KebabListStyles', () => jest.fn(() => ({})));

describe('KebabList Component', () => {
    const mockPage1Data = [
        {
            id: '1',
            title: 'Kebab 1',
            location: 'Location 1',
            latitude: 51.1,
            longitude: 16.1,
            status: 'open',
            craftRating: true,
            inChain: false,
        },
    ];

    const mockPage2Data = [
        {
            id: '2',
            title: 'Kebab 2',
            location: 'Location 2',
            latitude: 51.2,
            longitude: 16.2,
            status: 'closed',
            craftRating: false,
            inChain: true,
        },
    ];

    beforeEach(() => {
        global.fetch = jest.fn((url) => {
            const isPage2 = url.includes('page=2');
            const mockData = isPage2 ? mockPage2Data : mockPage1Data;

            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            });
        }) as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component correctly', async () => {
        const { getByText, queryByText } = render(<KebabList />);

        expect(getByText('Lista Legnickich Kebabów')).toBeTruthy();
        expect(queryByText('Łączna liczba kebabów:')).toBeNull();

        await waitFor(() => {
            expect(getByText('Łączna liczba kebabów: 1')).toBeTruthy();
            expect(getByText('Kebab 1')).toBeTruthy();
            expect(getByText('Location 1')).toBeTruthy();
            expect(getByText('Otwarty')).toBeTruthy();
        });
    });

    test('handles filtering by status', async () => {
        const { getByText, getAllByText } = render(<KebabList />);

        await waitFor(() => {
            expect(getByText('Kebab 1')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByText('Otwarte'));
        });

        await waitFor(() => {
            expect(getAllByText('Kebab 1').length).toBe(1);
            expect(getByText('Otwarty')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByText('Zamknięte'));
        });

        await waitFor(() => {
            expect(getByText('Brak kebabów do wyświetlenia.')).toBeTruthy();
        });
    });

    test('handles sorting by title', async () => {
        const { getByText } = render(<KebabList />);

        await waitFor(() => {
            expect(getByText('Kebab 1')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByText('Sortuj ▼'));
        });

        await waitFor(() => {
            expect(getByText('Kebab 1')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByText('Sortuj ▲'));
        });

        await waitFor(() => {
            expect(getByText('Kebab 1')).toBeTruthy();
        });
    });

    test('handles empty data gracefully', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([]),
            })
        ) as jest.Mock;

        const { getByText } = render(<KebabList />);

        await waitFor(() => {
            expect(getByText('Brak kebabów do wyświetlenia.')).toBeTruthy();
        });
    });

    test('handles fetch error gracefully', async () => {
        global.fetch = jest.fn(() =>
            Promise.reject(new Error('Network error'))
        ) as jest.Mock;

        const { getByText } = render(<KebabList />);

        await waitFor(() => {
            expect(getByText('Network error')).toBeTruthy();
        });
    });
});