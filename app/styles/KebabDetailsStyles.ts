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
    detailTitle: {
        fontWeight: 'bold',
        marginBottom: 3,
    },
    detailValue: {
        marginLeft: 10,
        fontSize: 14,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 30,
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
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    scrollContent: {
        marginTop: 1,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    darkInfoContainer: {
        backgroundColor: '#2C2C2C',
    },
    lightInfoContainer: {
        backgroundColor: '#F5F5F5',
    },
    details: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 10,
        color: '#333',
    },
    label: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 3,
        color: '#555',
    },
    value: {
        fontSize: 14,
        marginBottom: 10,
        color: '#000',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
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
