import React from 'react';
import { StyleSheet, Platform, Text } from 'react-native';

const AppText = props => <Text numberOfLines={props.lines} style={[
    styles.text,
    props.style,
    props.bold && styles.bold
]}>{
    props.children
}</Text>;

export default AppText;

export const HiddenAppText = props => <AppText style={{ display: "none" }}></AppText>;

const styles = StyleSheet.create({
    text: {
        ...Platform.select({
            ios: { fontFamily: 'Arial', }, 
            android: { fontFamily: 'Roboto' }
        }),
        fontSize: 14
    },
    bold: {
        fontWeight: "bold"
    }
});