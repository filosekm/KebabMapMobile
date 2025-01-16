import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingTop: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 18,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 20,
    },
    mapContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        height: 200,
        width: '100%',
    },
    infoContainer: {
        marginBottom: 20,
    },
    details: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 5,
        color: '#000',
    },
    darkText: {
        color: '#fff',
    },
    lightText: {
        color: '#000',
    },
    commentsList: {
        flexGrow: 0,
        marginTop: 10,
    },
    commentItem: {
        padding: 8,
        borderRadius: 8,
        marginVertical: 5,
    },
    lightComment: {
        backgroundColor: '#f1f1f1',
    },
    darkComment: {
        backgroundColor: '#333',
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentContent: {
        marginTop: 5,
        fontSize: 12,
    },
    commentsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    addCommentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    input: {
        flex: 1,
        borderRadius: 8,
        padding: 10,
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
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 10,
        marginLeft: 10,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    darkBackground: {
        backgroundColor: '#121212',
    },
    lightBackground: {
        backgroundColor: '#ffffff',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#000',
    },
});

export default styles;
