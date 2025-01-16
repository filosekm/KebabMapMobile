import React, { useContext, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { AuthContext } from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
import styles from '../styles/FeedbackStyles';

export default function Feedback() {
    const { userEmail, userToken } = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendFeedback = async () => {
        if (!userToken) {
            Alert.alert('Error', 'You must be logged in to send feedback.');
            return;
        }

        if (!feedback.trim()) {
            Alert.alert('Error', 'Feedback cannot be empty.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://192.168.0.210:8000/api/suggestions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    user: userEmail,
                    feedback: feedback.trim(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                Alert.alert('Error', errorData.detail || 'Failed to send feedback. Please try again.');
                return;
            }

            const data = await response.json();
            Alert.alert('Success', data.message || 'Feedback sent successfully!');
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
