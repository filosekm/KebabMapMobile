import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Feedback from '@/app/(tabs)/Feedback.tsx';
import { AuthContext } from '@/context/AuthContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('@/components/BackButton', () => 'MockedBackButton');

describe('Feedback Component', () => {
    const mockUserToken = 'mock-token';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders correctly', () => {
        const { getByText, getByPlaceholderText } = render(
            <AuthContext.Provider value={{ userToken: mockUserToken }}>
                <Feedback />
            </AuthContext.Provider>
        );

        expect(getByPlaceholderText('Write your feedback here...')).toBeTruthy();

        expect(getByText('Send Feedback')).toBeTruthy();
    });

    test('sends feedback successfully', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Feedback sent successfully!' }),
            })
        );

        const { getByPlaceholderText, getByText } = render(
            <AuthContext.Provider value={{ userToken: mockUserToken }}>
                <Feedback />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Write your feedback here...'), 'Great app!');

        fireEvent.press(getByText('Send Feedback'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://192.168.0.210:8000/api/suggestions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${mockUserToken}`,
                },
                body: JSON.stringify({
                    user: undefined,
                    feedback: 'Great app!',
                }),
            });
        });
    });
});