import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Feedback from '@/app/(tabs)/Feedback';
import { AuthContext } from '@/context/AuthContext';
import { Alert } from 'react-native';

jest.mock('@/components/BackButton', () => 'MockedBackButton');

jest.spyOn(Alert, 'alert');

const mockUserToken = 'mock-token';

describe('Feedback Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    test('renders correctly with all fields and button', () => {
        const { getByPlaceholderText, getByText } = render(
            <AuthContext.Provider value={{ userToken: mockUserToken }}>
                <Feedback />
            </AuthContext.Provider>
        );

        expect(getByPlaceholderText('Your Name')).toBeTruthy();
        expect(getByPlaceholderText('Your Email')).toBeTruthy();
        expect(getByPlaceholderText('Write your feedback here...')).toBeTruthy();
        expect(getByText('Send Feedback')).toBeTruthy();
    });

    test('displays an error if fields are empty', () => {
        const { getByText } = render(
            <AuthContext.Provider value={{ userToken: mockUserToken }}>
                <Feedback />
            </AuthContext.Provider>
        );

        act(() => {
            fireEvent.press(getByText('Send Feedback'));
        });

        expect(Alert.alert).toHaveBeenCalledWith('Error', 'All fields are required.');
    });

    test('sends feedback successfully', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                text: () => Promise.resolve(JSON.stringify({ message: 'Feedback sent successfully!' })),
            })
        );

        const { getByPlaceholderText, getByText } = render(
            <AuthContext.Provider value={{ userToken: mockUserToken }}>
                <Feedback />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Your Name'), 'John Doe');
        fireEvent.changeText(getByPlaceholderText('Your Email'), 'john.doe@example.com');
        fireEvent.changeText(getByPlaceholderText('Write your feedback here...'), 'Great app!');

        fireEvent.press(getByText('Send Feedback'));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('http://192.168.0.210:8000/api/feedback', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${mockUserToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'john.doe@example.com',
                    message: 'Great app!',
                    name: 'John Doe',
                }),
            });
        });

        expect(Alert.alert).toHaveBeenCalledWith('Success', 'Feedback sent successfully!');
    });
    test('displays an error if feedback submission fails', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('{"detail":"Failed to send feedback."}'),
            })
        );

        const { getByPlaceholderText, getByText } = render(
            <AuthContext.Provider value={{ userToken: mockUserToken }}>
                <Feedback />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Your Name'), 'John Doe');
        fireEvent.changeText(getByPlaceholderText('Your Email'), 'john.doe@example.com');
        fireEvent.changeText(getByPlaceholderText('Write your feedback here...'), 'Great app!');

        act(() => {
            fireEvent.press(getByText('Send Feedback'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Failed to send feedback.');
        });
    });

    test('displays an error for non-JSON response from server', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                text: () => Promise.resolve('Unexpected error occurred'),
            })
        );

        const { getByPlaceholderText, getByText } = render(
            <AuthContext.Provider value={{ userToken: mockUserToken }}>
                <Feedback />
            </AuthContext.Provider>
        );

        fireEvent.changeText(getByPlaceholderText('Your Name'), 'John Doe');
        fireEvent.changeText(getByPlaceholderText('Your Email'), 'john.doe@example.com');
        fireEvent.changeText(getByPlaceholderText('Write your feedback here...'), 'Great app!');

        act(() => {
            fireEvent.press(getByText('Send Feedback'));
        });

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith('Error', 'Unexpected response from the server.');
        });
    });
});
