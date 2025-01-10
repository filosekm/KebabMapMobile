import {ThemedText} from '@/components/ThemedText';
import {ActivityIndicator, FlatList, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import BackButton from "@/components/BackButton";
import getStyles from '../styles/KebabListStyles';

export default function KebabList() {
    type KebabData = {
        id: string;
        name: string; // Updated to reflect the mapped structure
        address: string; // Updated to reflect the mapped structure
        latitude: number;
        longitude: number;
        status: string;
    };

    const [data, setData] = useState<KebabData[]>([]);
    const [displayData, setDisplayData] = useState<KebabData[]>([]);
    const [sortAsc, setSortAsc] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();
    const colorScheme = useColorScheme();
    const ITEMS_PER_PAGE = 5;

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch('${API_ENDPOINT}/kebab_api/get_kebab_list.php');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const rawData: Array<{
                id: string;
                title: string;
                location: string;
                latitude: number;
                longitude: number;
                status: string;
            }> = await response.json();

            const mappedData: KebabData[] = rawData.map((item) => ({
                id: item.id,
                name: item.title, // Mapping title to name
                address: item.location, // Mapping location to address
                latitude: item.latitude,
                longitude: item.longitude,
                status: item.status,
            }));
            setData(mappedData);
            setError(null);
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
            setError(error instanceof Error ? error : new Error('Unexpected error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filteredData = [...data];
        if (filterStatus !== 'all') {
            filteredData = filteredData.filter((item) => item.status === filterStatus);
        }
        const sortedData = filteredData.sort((a, b) => {
            const nameA = a.name || '';
            const nameB = b.name || '';
            return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
        setDisplayData(sortedData);
    }, [data, sortAsc, filterStatus]);

    useEffect(() => {
        fetchData();
    }, []);

    const sortData = () => {
        setSortAsc(!sortAsc);
    };

    const filterData = (status: string) => {
        setFilterStatus(status);
    };

    const totalKebabs = data.length;
    const openKebabs = data.filter((kebab) => kebab.status === 'open').length;
    const closedKebabs = data.filter((kebab) => kebab.status === 'closed').length;
    const plannedKebabs = data.filter((kebab) => kebab.status === 'planned').length;
    const styles = getStyles(colorScheme ?? 'light');

    return (
        <View style={[styles.container]}>
            <View style={styles.headerRow}>
                <BackButton/>
                <ThemedText style={styles.title} type="title">Lista Legnickich Kebabów</ThemedText>
            </View>

            <View style={styles.headerContainer}>
                <View style={styles.counterContainer}>
                    <Text style={styles.counterText}>
                        W Legnicy mamy łącznie <Text style={styles.counterHighlight}>{totalKebabs}</Text> kebabów, w
                        tym:
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
                <ActivityIndicator size="large" color="#00ff00"/>
            ) : error ? (
                <Text style={styles.errorText}>{error.message}</Text>
            ) : (
                <>
                    <View style={styles.controls}>
                        <TouchableOpacity onPress={sortData}>
                            <Text style={styles.sortButton}>Sortuj {sortAsc ? '▼' : '▲'}</Text>
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
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => router.push(`/screens/KebabDetails?markerId=${item.id}`)} // Nawigacja
                            >
                                <View style={styles.textContainer}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.address}>{item.address}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    <View style={styles.pagination}>
                        <TouchableOpacity onPress={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                            <Text style={styles.pageButton}>Poprzednia</Text>
                        </TouchableOpacity>
                        <Text style={styles.numberButton}>Strona {page}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                const totalPages = Math.ceil(displayData.length / ITEMS_PER_PAGE);
                                if (page < totalPages) {
                                    setPage(page + 1);
                                }
                            }}
                            disabled={page >= Math.ceil(displayData.length / ITEMS_PER_PAGE)}
                        >
                            <Text style={styles.pageButton}>Następna</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}
