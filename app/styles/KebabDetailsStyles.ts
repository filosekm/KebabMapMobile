import { StyleSheet } from 'react-native';

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
        marginTop: 18,
    },
    backgroundImage: {
        resizeMode: 'contain',
        opacity: 0.1,
    },
    infoContainer: {
        marginBottom: 20,
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lightInfoContainer: {
        backgroundColor: '#F5F5F5',
    },
    darkInfoContainer: {
        backgroundColor: '#2C2C2C',
    },
    details: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 10,
    },
    lightText: {
        color: '#000',
    },
    darkText: {
        color: '#fff',
    },
    mapContainer: {
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        height: 150,
        width: '100%',
    },
    openingHoursContainer: {
        marginBottom: 15,
        padding: 5,
    },
    detailTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 3,
        color: '#555',
    },
    detailValue: {
        marginLeft: 10,
        fontSize: 14,
        marginBottom: 10,
        color: '#000',
    },
    openingHoursHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 5,
        borderBottomWidth: 1,
        marginBottom: 10,
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
        borderRadius: 8,
        padding: 10,
        marginLeft: 10,
    },
    lightBackground: {
        backgroundColor: '#fff',
    },
    darkBackground: {
        backgroundColor: '#121212',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
    },
    scrollContent: {
        flex: 1,
        marginTop: 10,
    },
    scrollContainer: {
        paddingBottom: 20,
    },
});

export default styles;
