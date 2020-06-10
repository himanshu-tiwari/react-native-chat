import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppText, { HiddenAppText } from './AppText';
import { isNonEmptyString } from '../helpers/checks';

const OverlayLoader = props => <View style={[styles.overlayLoader, props.style]}>
    <ActivityIndicator size="large" color="#fff" />
    {
        isNonEmptyString(props.type)
            ? <AppText style={[styles.type, props.typeStyle]}>Uploading { props.type }!</AppText>
            : <HiddenAppText />
    }
</View>;

export default OverlayLoader;

const styles = StyleSheet.create({
    overlayLoader: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    type: {
        color: "#fff",
        marginTop: 10,
        fontSize: 18
    }
});