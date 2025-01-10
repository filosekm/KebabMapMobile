import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    Infocontainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: 50,

    },
    imageContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lightPlaceholder: {
        backgroundColor: '#ecf0f1',
    },
    darkPlaceholder: {
        backgroundColor: '#34495e',
    },
    placeholderText: {
        color: '#7f8c8d',
        fontSize: 14,
    },
    username: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    lightBackground: {
        backgroundColor: '#ffffff',
    },
    darkBackground: {
        backgroundColor: '#1e1e1e',
    },
    lightText: {
        color: '#34495e',
    },
    darkText: {
        color: '#ecf0f1',
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        width: '60%',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default styles;
