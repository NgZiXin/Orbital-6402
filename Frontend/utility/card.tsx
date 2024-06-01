import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Card(props: any) {
    return (
        <View style={styles.card}>
            { props.children }
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 7,
        elevation: 3,
        backgroundColor: "#fff",
        // width: right offset, height: down offset
        shadowOffset: { width: 1, height: 1},
        shadowColor: "#333",
        shadowOpacity: 0.3,
        shadowRadius: 2,
        marginHorizontal: 4,
        marginVertical: 6,
    },
})