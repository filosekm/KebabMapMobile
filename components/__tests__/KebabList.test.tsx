import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import KebabList from '@/app/(tabs)/KebabList';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

jest.mock('@/app/styles/KebabListStyles', () => jest.fn(() => ({})));

describe('KebabList Component', () => {
    const mockData = [
        { id: '1', title: 'Kebab 1', location: 'Location 1', status: 'open', craftRating: true, inChain: false },
        { id: '2', title: 'Kebab 2', location: 'Location 2', status: 'closed', craftRating: false, inChain: true },
        { id: '3', title: 'Kebab 3', location: 'Location 3', status: 'planned', craftRating: true, inChain: true },
    ];

    beforeEach(() => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component correctly', async () => {
        const { getByText } = render(<KebabList />);

        await waitFor(() => {
            expect(getByText('Lista Legnickich Kebabów')).toBeTruthy();
            expect(getByText('Łączna liczba kebabów: 3')).toBeTruthy();
        });
    });

    test('handles filtering by status', async () => {
        const { getByText } = render(<KebabList />);

        await waitFor(() => {
            expect(getByText('Kebab 1')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByText('Otwarte'));
        });

        await waitFor(() => {
            expect(getByText('Kebab 1')).toBeTruthy();
            expect(getByText('Location 1')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByText('Zamknięte'));
        });

        await waitFor(() => {
            expect(getByText('Kebab 2')).toBeTruthy();
            expect(getByText('Location 2')).toBeTruthy();
        });
    });

    test('handles empty data', async () => {
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
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        global.fetch = jest.fn(() =>
            Promise.reject(new Error('HTTP error! Status: 500'))
        ) as jest.Mock;

        const { getByText } = render(<KebabList />);

        await waitFor(() => {
            expect(getByText('HTTP error! Status: 500')).toBeTruthy();
        });

        consoleSpy.mockRestore();
    });

    test('handles sorting', async () => {
        const { getByText } = render(<KebabList />);

        await waitFor(() => {
            expect(getByText('Kebab 1')).toBeTruthy();
        });

        act(() => {
            fireEvent.press(getByText('Sortuj ▼'));
        });

        await waitFor(() => {
            expect(getByText('Kebab 3')).toBeTruthy(); // Assuming descending order
        });

        act(() => {
            fireEvent.press(getByText('Sortuj ▲'));
        });

        await waitFor(() => {
            expect(getByText('Kebab 1')).toBeTruthy(); // Back to ascending
        });
    });
});
