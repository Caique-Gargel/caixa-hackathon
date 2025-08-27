import React from 'react';
import {  Text, StyleSheet, View, StatusBar } from 'react-native';

export default function Title({ TitleText }) {
    return (
        <View style={styles.containerTitle}>
            <Text style={styles.title}>{TitleText}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        padding: 20,
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        
    },
    containerTitle: {
        paddingTop: StatusBar.currentHeight,
        alignItems: 'left',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: '#005CA9',
    },
});