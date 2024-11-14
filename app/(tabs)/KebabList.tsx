import { ThemedText } from '@/components/ThemedText';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    const [displayData, setDisplayData] = useState([]); // Dane do wyświetlenia po sortowaniu/filtrowaniu
    const [sortAsc, setSortAsc] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <ThemedText style={styles.title} type="title">Lista Legnickich Kebabów</ThemedText>
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
                        <Text>Strona {page}</Text>
                        <TouchableOpacity onPress={() => setPage(page + 1)}>
                            <Text style={styles.pageButton}>Następna</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
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
        color: '#FFFFFF',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    sortButton: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
    },
    filterContainer: {
        flexDirection: 'row',
    },
    filterButton: {
        marginHorizontal: 5,
        fontSize: 14,
        color: 'blue',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    name: {
        fontSize: 16,
        color: '#FFFFFF',
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
        color: 'blue',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
    },
});
