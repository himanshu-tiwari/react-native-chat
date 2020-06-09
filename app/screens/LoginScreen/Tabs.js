import React, { useCallback, useState, useContext } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
    const [email, setEmail] = useState("himanshu@delightree.com");
    const [password, setPassword] = useState("Abcd@1234");

    return <View style={styles.contentContainer}>
        <Text style={styles.header}>{ props.type }</Text>
        
        <TextInput
            style={[styles.input, emailFocused && styles.focused]}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="himanshu@delightree.com"
        />

        <TextInput
            style={[styles.input, passwordFocused && styles.focused]}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="********"
            secureTextEntry={true}
        />

        <View style={styles.submitContainer}>
            <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
                <Image source={require('../../assets/icons/arrow.png')} style={styles.arrow} />
            </TouchableOpacity>
        </View>
    </View>;
};

export default Tabs;

const styles = StyleSheet.create({
    contentContainer: {
        marginHorizontal: 32
    },
    header: {
        fontWeight: "800",
        fontSize: 38,
        color: "#514e5a",
        marginTop: 32
    },
    input: {
        marginTop: 32,
        height: 50,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#bab7c3",
        borderRadius: 30,
        paddingHorizontal: 16,
        color: "#514e5a",
        fontWeight: "600"
    },
    focused: {
        borderColor: "#514e5a",
        borderWidth: 1.25
    },
    submitContainer: {
        alignItems: "flex-end",
        marginTop: 34
    },
    submit: {
        width: 70,
        height: 70,
        borderRadius: 45,
        backgroundColor: "#9075e3",
        alignItems: "center",
        justifyContent: "center"
    },
    arrow: {
        width: 24,
        height: 24
    }
});