import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    lightContainer: {
        backgroundColor: '#ffffff',
    },
    darkContainer: {
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    lightText: {
        color: '#000',
    },
    darkText: {
        color: '#fff',
    },
    input: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
    },
    lightInput: {
        backgroundColor: '#f1f1f1',
        borderColor: '#ccc',
        borderWidth: 1,
        color: '#000',
    },
    darkInput: {
        backgroundColor: '#333',
        borderColor: '#555',
        borderWidth: 1,
        color: '#fff',
    },
    button: {
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    link: {
        marginTop: 20,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default styles;
