import React, { useContext, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
import styles from '../styles/FeedbackStyles';

export default function Feedback() {
    const { userToken } = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSendFeedback = async () => {
        if (!userToken) {
            Alert.alert('Error', 'You must be logged in to send feedback.');
            return;
        }

        if (!name.trim() || !email.trim() || !feedback.trim()) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name: name.trim(),
                email: email.trim(),
                message: feedback.trim(),
            };

            const response = await fetch('http://192.168.0.210:8000/api/suggestions-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify(payload),
            });

            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson ? await response.json() : null;

            if (!response.ok) {
                console.error('Error response:', data || 'No response body');
                Alert.alert('Error', data?.message || 'Unexpected server error. Please try again later.');
                return;
            }

            Alert.alert('Success', data?.message || 'Feedback sent successfully!');
            setName('');
            setEmail('');
            setFeedback('');
        } catch (error) {
            console.error('Error sending feedback:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };




    return (
        <View style={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
            <View style={styles.header}>
                <BackButton />
                <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                    Feedback
                </Text>
            </View>
            <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                Share your thoughts about the app or report a problem.
            </Text>
            <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholder="Your Name"
                placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholder="Your Email"
                placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
                placeholder="Write your feedback here..."
                placeholderTextColor={isDarkMode ? '#aaa' : '#555'}
                value={feedback}
                onChangeText={setFeedback}
                multiline
            />
            <TouchableOpacity
                style={[
                    styles.addButton,
                    loading ? styles.disabledButton : {},
                    isDarkMode && { backgroundColor: '#f39c12' },
                    !isDarkMode && { backgroundColor: '#4CAF50' },
                ]}
                onPress={handleSendFeedback}
                disabled={loading}
            >
                <Text style={styles.addButtonText}>
                    {loading ? 'Sending...' : 'Send Feedback'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
