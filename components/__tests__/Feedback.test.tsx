import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Feedback from '@/app/(tabs)/Feedback';
import { AuthContext } from '@/context/AuthContext';
import { Alert } from 'react-native';


jest.mock('@/components/BackButton', () => 'MockedBackButton');

const mockAuthContext = {
    userToken: 'mock-token',
    userEmail: 'user@example.com',
    login: jest.fn(),
    logout: jest.fn(),
};

describe('Feedback Component', () => {
    beforeEach(() => {
        jest.spyOn(Alert, 'alert').mockClear().mockImplementation(() => {});

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: async () => ({ message: 'Pomyślnie wysłano' }),
            })
        ) as jest.Mock;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('shows error when fields are empty', async () => {
        const { getByText } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <Feedback />
            </AuthContext.Provider>
        );

        fireEvent.press(getByText('Wyślij Feedback'));

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Wszystkie pola są wymagane.');
        });
    });



    test('displays error for invalid email response', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: async () => ({ email: ['Nieprawidłowy adres email'] }),
            })
        ) as jest.Mock;

        const { getByPlaceholderText, getByText } = render(
            <AuthContext.Provider value={mockAuthContext}>
                <Feedback />
            </AuthContext.Provider>
        );

        await act(async () => {
            fireEvent.changeText(getByPlaceholderText('Twoje imię'), 'John Doe');
            fireEvent.changeText(getByPlaceholderText('Adres Email'), 'invalid-email');
            fireEvent.changeText(getByPlaceholderText('Wiadomość'), 'Great app!');
            fireEvent.press(getByText('Wyślij Feedback'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith("Error", "Wszystkie pola są wymagane.");
        });
    });
});
