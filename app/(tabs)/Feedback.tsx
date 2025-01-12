import React, {useContext, useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, useColorScheme, View} from 'react-native';
import {AuthContext} from '@/context/AuthContext';
import BackButton from '@/components/BackButton';
import styles from '../styles/FeedbackStyles';

export default function Feedback() {
    const {userEmail, userToken} = useContext(AuthContext);
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendFeedback = async () => {
        if (!userToken) {
            Alert.alert('Error', 'Aby wysłać opinię, musisz się zalogować.');
            return;
        }

        if (!feedback.trim()) {
            Alert.alert('Error', 'Pole tekstowe nie może być puste.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('${API_ENDPOINT}/kebab_api/send_feedback.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({
                    user: userEmail,
                    feedback: feedback.trim(),
                }),
            });

            if (response.ok) {
                Alert.alert('Success', 'Feedback sent successfully!');
                setFeedback('');
            } else {
                Alert.alert('Error', 'Failed to send feedback. Please try again.');
            }
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
                <BackButton/>
                <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
                    Feedback
                </Text>
            </View>
            <Text style={[styles.details, isDarkMode ? styles.darkText : styles.lightText]}>
                Podziel się z nami swoimi przemyśleniami o aplikacji lub zgłoś problem.
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
                    !isDarkMode && {backgroundColor: '#4CAF50'},
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

