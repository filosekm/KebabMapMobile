import { ThemedText } from '@/components/ThemedText';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import BackButton from '@/components/BackButton';
import getStyles from '../styles/KebabListStyles';

type KebabData = {
    id: string;
    title: string;
    location: string;
    latitude: number;
    longitude: number;
    status: string;
    logo?: string | null;
    craftRating: boolean;
    inChain: boolean;
};

export default function KebabList() {
    const [data, setData] = useState<KebabData[]>([]);
    const [totalKebabs, setTotalKebabs] = useState<number>(0);
    const [filters, setFilters] = useState({
        status: null as string | null,
        craftRating: null as boolean | null,
        inChain: null as boolean | null,
    });
    const [sortAsc, setSortAsc] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 5;

    const router = useRouter();
    const colorScheme = useColorScheme();
    const styles = getStyles(colorScheme ?? 'light');

    const fetchData = async () => {
        try {
            setLoading(true);

            const response = await fetch('http://192.168.0.210:8000/api/kebabs/legnica');
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            const kebabs = result.kebabs;

            setData(
                kebabs.map((item: any, index: number) => ({
                    id: item.id ? item.id.toString() : index.toString(),
                    title: item.name || 'Brak nazwy',
                    location: `${item.latitude}, ${item.longitude}` || 'Brak adresu',
                    latitude: item.latitude || 0,
                    longitude: item.longitude || 0,
                    status: item.status || 'unknown',
                    logo: item.logo || null,
                    craftRating: Boolean(item.craft_rating),
                    inChain: Boolean(item.in_chain),
                }))
            );

            setTotalKebabs(kebabs.length);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error instanceof Error ? error : new Error('Unexpected error'));
        } finally {
            setLoading(false);
        }
    };



    const filteredData = data
        .filter((item) => {
            const matchesStatus = filters.status ? item.status === filters.status : true;
            const matchesCraftRating = filters.craftRating !== null ? item.craftRating === filters.craftRating : true;
            const matchesInChain = filters.inChain !== null ? item.inChain === filters.inChain : true;
            return matchesStatus && matchesCraftRating && matchesInChain;
        })
        .sort((a, b) => {
            const comparison = sortAsc ? 1 : -1;
            return a.title.localeCompare(b.title) * comparison;
        });


    const paginatedData = filteredData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);



    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeout);
    }, [filters, page, sortAsc]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <BackButton />
                <ThemedText style={styles.title} type="title">Lista Legnickich Kebabów</ThemedText>
            </View>
            <Text style={styles.totalCount}>Łączna liczba kebabów: {totalKebabs}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#00ff00" />
            ) : error ? (
                <Text style={styles.errorText}>{error.message}</Text>
            ) : (
                <>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterTitle}>Filtruj według:</Text>
                        <View style={styles.filterGroup}>
                            {[
                                { label: 'Wszystkie', value: null },
                                { label: 'Otwarte', value: 'open' },
                                { label: 'Zamknięte', value: 'closed' },
                                { label: 'Planowane', value: 'planned' },
                            ].map(({ label, value }) => (
                                <TouchableOpacity
                                    key={label}
                                    onPress={() => setFilters({ ...filters, status: value })}
                                >
                                    <Text style={[
                                        styles.filterButton,
                                        filters.status === value && styles.activeFilter,
                                    ]}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.filterGroup}>
                            {['Wszystkie', 'Craft', 'Non-Craft'].map((label, index) => {
                                const value = index === 0 ? null : index === 1;
                                return (
                                    <TouchableOpacity
                                        key={label}
                                        onPress={() => setFilters({ ...filters, craftRating: value })}
                                    >
                                        <Text style={[
                                            styles.filterButton,
                                            filters.craftRating === value && styles.activeFilter,
                                        ]}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        <View style={styles.filterGroup}>
                            {['Wszystkie', 'W Sieci', 'Niezależne'].map((label, index) => {
                                const value = index === 0 ? null : index === 1;
                                return (
                                    <TouchableOpacity
                                        key={label}
                                        onPress={() => setFilters({ ...filters, inChain: value })}
                                    >
                                        <Text style={[
                                            styles.filterButton,
                                            filters.inChain === value && styles.activeFilter,
                                        ]}>
                                            {label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.controls}>
                        <TouchableOpacity onPress={() => setSortAsc(!sortAsc)}>
                            <Text style={styles.sortButton}>Sortuj {sortAsc ? '▼' : '▲'}</Text>
                        </TouchableOpacity>
                    </View>


                    <FlatList
                        data={paginatedData}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => router.push(`/screens/KebabDetails?markerId=${item.id}`)}
                            >
                                <View style={styles.textContainer}>
                                    <Text style={styles.name}>{item.title}</Text>
                                    <Text style={styles.additionalInfo}>
                                        {item.status === 'open'
                                            ? 'Otwarty'
                                            : item.status === 'closed'
                                                ? 'Zamknięty'
                                                : 'Planowany'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={
                            <Text style={styles.emptyMessage}>Brak kebabów do wyświetlenia.</Text>
                        }
                    />

                    <View style={styles.pagination}>
                        <TouchableOpacity onPress={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>
                            <Text style={styles.pageButton}>Poprzednia</Text>
                        </TouchableOpacity>
                        <Text style={styles.numberButton}>Strona {page}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                const totalPages = Math.ceil(totalKebabs / ITEMS_PER_PAGE);
                                if (page < totalPages) setPage(page + 1);
                            }}
                            disabled={page >= Math.ceil(totalKebabs / ITEMS_PER_PAGE)}
                        >
                            <Text style={styles.pageButton}>Następna</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}
