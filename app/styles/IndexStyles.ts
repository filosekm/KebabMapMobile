import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    title: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
    },
    mapContainer: {
        flex: 1,
    },
    webFallback: {
        flex: 1,
        backgroundColor: '#2e2e2e',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default styles;
