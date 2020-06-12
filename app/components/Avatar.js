import React from 'react';
import { Image, ActivityIndicator, StyleSheet } from 'react-native';
import { isNonEmptyString } from '../helpers/checks';

const Avatar = props => isNonEmptyString(props.url)
    ? <Image source={{ uri: props.url }} style={[styles.avatar, props.style]} />
    : <ActivityIndicator style={[styles.avatar, props.style]} size={props.size} />;

export default Avatar;

const styles = StyleSheet.create({
    avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "lightgrey"
	}
});