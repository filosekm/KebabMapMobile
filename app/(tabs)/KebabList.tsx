
import { ThemedText } from '@/components/ThemedText';
import {StyleSheet, View} from "react-native";
import React from "react";

export default function KebabList() {

    return (
        <View style={styles.container}>
    <View style={styles.headerContainer}>
    <ThemedText style={styles.title} type="title">Kebab List!</ThemedText>
    </View>
    </View>
);}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e1e1e',
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
});
