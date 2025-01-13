import { ThemedText } from '@/components/ThemedText';
import { Image, ActivityIndicator, FlatList, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import BackButton from "@/components/BackButton";
import getStyles from '../styles/KebabListStyles';

type KebabData = {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    status: string;
    logo?: string | null;
    craftRating: boolean;
    inChain: boolean;
};

export default function KebabList() {
    const [data, setData] = useState<KebabData[]>([]);
    const [displayData, setDisplayData] = useState<KebabData[]>([]);
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [craftRatingFilter, setCraftRatingFilter] = useState<boolean | null>(null);
    const [inChainFilter, setInChainFilter] = useState<boolean | null>(null);
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

            // Build query parameters dynamically
            const queryParams = new URLSearchParams();
            if (statusFilter) queryParams.append('status', statusFilter);
            if (craftRatingFilter !== null) queryParams.append('craft_rating', String(craftRatingFilter));
            if (inChainFilter !== null) queryParams.append('in_chain', String(inChainFilter));

            const response = await fetch(`http://192.168.0.210:8000/api/kebabs?${queryParams.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const rawData = await response.json();
            const mappedData: KebabData[] = rawData.map((item: any) => ({
                id: item.id,
                name: item.name || 'Brak nazwy',
                address: item.location_details || 'Brak adresu',
                latitude: item.latitude,
                longitude: item.longitude,
                status: item.status || 'unknown',
                logo: item.logo || null,
                craftRating: item.craft_rating || false,
                inChain: item.in_chain || false,
            }));
            setData(mappedData);
            setError(null);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error instanceof Error ? error : new Error('Unexpected error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [statusFilter, craftRatingFilter, inChainFilter]);

    useEffect(() => {
        const sortedData = [...data].sort((a, b) => {
            const nameA = a.name || '';
            const nameB = b.name || '';
            return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });

        setDisplayData(sortedData);
    }, [data, sortAsc]);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <BackButton />
                <ThemedText style={styles.title} type="title">Lista Legnickich Kebabów</ThemedText>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#00ff00" />
            ) : error ? (
                <Text style={styles.errorText}>{error.message}</Text>
            ) : (
                <>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterTitle}>Filtruj według:</Text>

                        {/* Status Filters */}
                        <View style={styles.filterGroup}>
                            <TouchableOpacity onPress={() => setStatusFilter(null)}>
                                <Text style={[styles.filterButton, !statusFilter && styles.activeFilter]}>Wszystkie</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStatusFilter('open')}>
                                <Text style={[styles.filterButton, statusFilter === 'open' && styles.activeFilter]}>Otwarte</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStatusFilter('closed')}>
                                <Text style={[styles.filterButton, statusFilter === 'closed' && styles.activeFilter]}>Zamknięte</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStatusFilter('planned')}>
                                <Text style={[styles.filterButton, statusFilter === 'planned' && styles.activeFilter]}>Planowane</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Craft Rating Filters */}
                        <View style={styles.filterGroup}>
                            <TouchableOpacity onPress={() => setCraftRatingFilter(null)}>
                                <Text style={[styles.filterButton, craftRatingFilter === null && styles.activeFilter]}>Wszystkie</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setCraftRatingFilter(true)}>
                                <Text style={[styles.filterButton, craftRatingFilter === true && styles.activeFilter]}>Craft</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setCraftRatingFilter(false)}>
                                <Text style={[styles.filterButton, craftRatingFilter === false && styles.activeFilter]}>Non-Craft</Text>
                            </TouchableOpacity>
                        </View>

                        {/* In Chain Filters */}
                        <View style={styles.filterGroup}>
                            <TouchableOpacity onPress={() => setInChainFilter(null)}>
                                <Text style={[styles.filterButton, inChainFilter === null && styles.activeFilter]}>Wszystkie</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setInChainFilter(true)}>
                                <Text style={[styles.filterButton, inChainFilter === true && styles.activeFilter]}>W Sieci</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setInChainFilter(false)}>
                                <Text style={[styles.filterButton, inChainFilter === false && styles.activeFilter]}>Niezależne</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.controls}>
                        <TouchableOpacity onPress={() => setSortAsc(!sortAsc)}>
                            <Text style={styles.sortButton}>Sortuj {sortAsc ? '▼' : '▲'}</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={displayData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.item}
                                onPress={() => router.push(`/screens/KebabDetails?markerId=${item.id}`)}
                            >
                                {/* Logo */}
                                {item.logo ? (
                                    <Image source={{ uri: item.logo }} style={styles.logo} />
                                ) : (
                                    <View style={styles.logo} /> // Placeholder if no logo
                                )}

                                {/* Text Information */}
                                <View style={styles.textContainer}>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.address}>{item.address}</Text>
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
