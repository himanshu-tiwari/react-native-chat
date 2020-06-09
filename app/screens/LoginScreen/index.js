import React, { useState, memo, useCallback } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';

const windowWidth = Dimensions.get("window").width;

const LoginScreen = props => {
    return <View style={styles.container}>
        <View style={[styles.circle, {
            width: 1.75*windowWidth,
            height: 1.75*windowWidth,
            borderRadius: 1.75*windowWidth,
            left: -0.75*windowWidth,
            top: -0.25*windowWidth
        }]} />

        <View style={styles.logoContainer}>
            <Image source={require('../../assets/icons/coffee.png')} style={styles.logo} />
        </View>

    </View>;
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee"
    },
    circle: {
        backgroundColor: "#fff",
        position: "absolute"
    },
    logoContainer: {
        marginTop: 64
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: "center"
    }
});
