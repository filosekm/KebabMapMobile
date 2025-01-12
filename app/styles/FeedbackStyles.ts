import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 15,
    },
    details: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderRadius: 8,
        padding: 10,
        textAlignVertical: 'top',
        minHeight: 150,
    },
    lightInput: {
        backgroundColor: '#f9f9f9',
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
    addButton: {
        backgroundColor: '#f39c12',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#aaa',
    },
    darkBackground: {
        backgroundColor: '#1e1e1e',
    },
    lightBackground: {
        backgroundColor: '#ffffff',
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
    },
});

export default styles;
