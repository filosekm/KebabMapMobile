import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, useColorScheme } from 'react-native';
import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // gdy API będzie gotowe

// przykładowe dane zeby cos sie wyswietlało
const mockData = [
    { id: '1', name: 'Mock Kebab A', status: 'open' },
    { id: '2', name: 'Mock Kebab B', status: 'closed' },
    { id: '3', name: 'Mock Kebab C', status: 'planned' },
    { id: '4', name: 'Mock Kebab D', status: 'open' },
    { id: '5', name: 'Mock Kebab E', status: 'closed' },
];

export default function KebabList() {
    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [sortAsc, setSortAsc] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const colorScheme = useColorScheme();
    const ITEMS_PER_PAGE = 5;

    const fetchData = async () => {
        setLoading(true);
        try {
            /* GDY BEDZIE API
            const response = await axios.get(`https://api.example.com/kebabs`, {
                params: {
                    page: page,
                    perPage: ITEMS_PER_PAGE,
                    status: filterStatus !== 'all' ? filterStatus : undefined,
                },
            });
            setData(response.data);
            setError(null);
            */
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setData(mockData);
            setError(null);
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filteredData = [...data];
        if (filterStatus !== 'all') {
            filteredData = filteredData.filter(item => item.status === filterStatus);
        }
        const sortedData = filteredData.sort((a, b) => {
            return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        });
        setDisplayData(sortedData);
    }, [data, sortAsc, filterStatus]);

    useEffect(() => {
        fetchData();
    }, [page]);

    const sortData = () => {
        setSortAsc(!sortAsc);
    };

    const filterData = (status) => {
        setFilterStatus(status);
    };

    // liczba kebabów
    const totalKebabs = data.length;
    const openKebabs = data.filter(kebab => kebab.status === 'open').length;
    const closedKebabs = data.filter(kebab => kebab.status === 'closed').length;
    const plannedKebabs = data.filter(kebab => kebab.status === 'planned').length;
    const styles = getStyles(colorScheme);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ThemedText style={styles.title} type="title">Lista Legnickich Kebabów</ThemedText>
                <View style={styles.counterContainer}>
                    <Text style={styles.counterText}>
                        W Legnicy mamy łącznie <Text style={styles.counterHighlight}>{totalKebabs}</Text> kebabów, w tym:
                    </Text>
                    <Text style={styles.counterText}>
                        <Text style={styles.counterHighlight}>{openKebabs}</Text> Otwartych
                    </Text>
                    <Text style={styles.counterText}>
                        <Text style={styles.counterHighlight}>{plannedKebabs}</Text> Planowanych
                    </Text>
                    <Text style={styles.counterText}>
                        <Text style={styles.counterHighlight}>{closedKebabs}</Text> Zamkniętych
                    </Text>
                </View>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#00ff00" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <>
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={sortData}>
                            <Text style={styles.sortButton}>Sortuj {sortAsc ? '▲' : '▼'}</Text>
                        </TouchableOpacity>
                        <View style={styles.filterContainer}>
                            <Text onPress={() => filterData('all')} style={styles.filterButton}>Wszystkie</Text>
                            <Text onPress={() => filterData('open')} style={styles.filterButton}>Otwarte</Text>
                            <Text onPress={() => filterData('closed')} style={styles.filterButton}>Zamknięte</Text>
                            <Text onPress={() => filterData('planned')} style={styles.filterButton}>Planowane</Text>
                        </View>
                    </View>
                    <FlatList
                        data={displayData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.item} onPress={() => console.log('Navigate to details of', item.name)}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.status}>{item.status}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <View style={styles.pagination}>
                        <TouchableOpacity onPress={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                            <Text style={styles.pageButton}>Poprzednia</Text>
                        </TouchableOpacity>
                        <Text style={styles.numberButton}>Strona {page}</Text>
                        <TouchableOpacity onPress={() => setPage(page + 1)}>
                            <Text style={styles.pageButton}>Następna</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const getStyles = (colorScheme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#FFFFFF',
        padding: 16,
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
        color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
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
        color: colorScheme === 'dark' ? '#E47833' : '#E47833',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colorScheme === 'dark' ? '#444' : '#CCC',
    },
    name: {
        fontSize: 16,
        color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    },
    status: {
        fontSize: 14,
        color: 'gray',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    pageButton: {
        color: colorScheme === 'dark' ? '#717171' : '#717171',
    },
    numberButton: {
        color: colorScheme === 'dark' ? '#3f3f3f' : '#3f3f3f',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});
