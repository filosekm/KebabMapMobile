import {StyleSheet} from 'react-native';

const getStyles = (colorScheme: string) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#FFFFFF',
            padding: 20,
        },
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
            marginLeft: 10,
            marginTop: 18,
        },
        headerContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
        },
        counterContainer: {
            backgroundColor: colorScheme === 'dark' ? '#2e2e2e' : '#f0f0f0',
            padding: 10,
            borderRadius: 8,
            marginVertical: 10,
            alignItems: 'center',
        },
        counterText: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
            textAlign: 'center',
            marginVertical: 2,
        },
        counterHighlight: {
            color: '#dd2c00',
            fontWeight: 'bold',
        },
        controls: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
        },
        sortButton: {
            fontWeight: 'bold',
            fontSize: 16,
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        },
        filterContainer: {
            flexDirection: 'row',
        },
        filterButton: {
            marginHorizontal: 5,
            fontSize: 14,
            color: '#E47833',
        },
        item: {
            flexDirection: 'row',
            justifyContent: 'center',
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#444' : '#CCC',
        },
        name: {
            fontSize: 16,
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
        },
        address: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#FFFFE0' : '#555',
        },
        pagination: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
        },
        pageButton: {
            color: '#87CEEB',
        },
        numberButton: {
            color: '#555',
        },
        errorText: {
            color: 'red',
            textAlign: 'center',
        },
        textContainer: {
            flex: 1,
        },
    });

export default getStyles;
