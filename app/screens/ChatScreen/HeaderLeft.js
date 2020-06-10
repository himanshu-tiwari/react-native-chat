import React, { useContext, useCallback } from 'react';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FireContext } from '../../FireContext';

const HeaderLeft = props => {
    const { signOut } = useContext(FireContext);

    const backToLogin = useCallback(
        () => {
            signOut(props.onPress);
        },
        [signOut, props.onPress]
    );

    return <TouchableOpacity onPress={props.toLogin ? backToLogin : props.onPress}>
        <Image source={require("../../assets/icons/back.png")} style={styles.icon} />
    </TouchableOpacity>;
};

export default HeaderLeft;

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
        marginHorizontal: 10
    }
});
