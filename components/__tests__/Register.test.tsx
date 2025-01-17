import React from 'react';
import { render } from '@testing-library/react-native';
import RegisterScreen from '@/app/(auth)/Register.tsx';
import { AuthContext } from '@/context/AuthContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('@/components/BackButton', () => 'MockedBackButton');

describe('RegisterScreen Component', () => {
    test('renders correctly', () => {
        const { getAllByText, getByText } = render(
            <AuthContext.Provider value={{ login: jest.fn() }}>
                <RegisterScreen />
            </AuthContext.Provider>
        );

        const registerButtons = getAllByText('Register');
        expect(registerButtons.length).toBeGreaterThan(0);

        expect(getByText('Already have an account? Log in')).toBeTruthy();
    });
});
