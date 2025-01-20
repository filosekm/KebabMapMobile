import React from 'react';
import { TouchableOpacity, StyleSheet, Text, useColorScheme } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BackButtonProps {
    color?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ color }) => {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
        <TouchableOpacity style={styles.container} onPress={() => router.back()}>
            <AntDesign
                name="arrowleft"
                size={24}
                color={color || (isDarkMode ? '#fff' : '#000')}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 20,
    },
});

export default BackButton;
