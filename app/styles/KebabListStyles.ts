import { StyleSheet } from 'react-native';

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
            marginVertical: 16,
            padding: 12,
            backgroundColor: colorScheme === 'dark' ? '#2e2e2e' : '#e8f5e9',
            borderRadius: 8,
        },
        filterTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
            marginBottom: 6,
        },
        filterGroup: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginVertical: 6,
        },
        filterButton: {
            paddingHorizontal: 10,
            paddingVertical: 6,
            margin: 3,
            borderRadius: 6,
            backgroundColor: colorScheme === 'dark' ? '#f39c12' : '#A5D6A7',
            color: colorScheme === 'dark' ? '#1e1e1e' : '#FFFFFF',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: 12,
        },
        activeFilter: {
            backgroundColor: colorScheme === 'dark' ? '#D35400' : '#388E3C',
            color: '#FFFFFF',
        },
        applyButton: {
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: colorScheme === 'dark' ? '#dd2c00' : '#4CAF50',
            color: '#FFFFFF',
            borderRadius: 8,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 14,
        },
        item: {
            flexDirection: 'row', // Aligns logo and content horizontally
            alignItems: 'flex-start', // Ensures items are aligned at the top
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: colorScheme === 'dark' ? '#444' : '#CCC',
            backgroundColor: colorScheme === 'dark' ? '#2e2e2e' : '#f9f9f9',
            borderRadius: 8,
            marginBottom: 10,
        },
        logo: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: colorScheme === 'dark' ? '#444' : '#DDD',
            marginRight: 10, // Spacing between logo and text
        },
        textContainer: {
            flex: 1, // Ensures the text takes up remaining space
        },
        name: {
            fontSize: 16,
            fontWeight: 'bold',
            color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
            marginBottom: 4, // Spacing between name and additional info
        },
        address: {
            fontSize: 14,
            color: colorScheme === 'dark' ? '#CCCCCC' : '#666666',
        },
        additionalInfo: {
            fontSize: 12,
            color: colorScheme === 'dark' ? '#AAAAAA' : '#999999',
            marginTop: 4,
        },
        pagination: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
        },
        pageButton: {
            color: colorScheme === 'dark' ? '#f39c12' : '#388E3C',
        },
        numberButton: {
            color: '#555',
        },
        errorText: {
            color: 'red',
            textAlign: 'center',
        },
        emptyMessage: {
            fontSize: 14,
            fontWeight: '500',
            color: colorScheme === 'dark' ? '#CCCCCC' : '#666666',
            textAlign: 'center',
            marginVertical: 14,
        },
    });

export default getStyles;