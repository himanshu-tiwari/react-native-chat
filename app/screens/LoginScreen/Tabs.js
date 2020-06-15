import React, { useCallback, useState, useContext } from 'react';
import { StyleSheet, View, Image, TextInput } from 'react-native';
import { FireContext } from '../../contexts/FireContext';
import AppBtn from '../../components/AppBtn';
import AppText from '../../components/AppText';

const Tabs = props => {
    const { signIn, signUp } = useContext(FireContext);

    const [email, setEmail] = useState("himanshu@delightree.com");
    const [password, setPassword] = useState("Abcd@1234");

    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const handleEmailChange = useCallback(email => setEmail(email), []);
    const handlePasswordChange = useCallback(password => setPassword(password), []);

    const handleEmailFocus = useCallback(() => setEmailFocused(true), []);
    const handleEmailBlur = useCallback(() => setEmailFocused(false), []);

    const handlePasswordFocus = useCallback(() => setPasswordFocused(true), []);
    const handlePasswordBlur = useCallback(() => setPasswordFocused(false), []);

    const goToChannels = useCallback(data => props.navigation?.navigate("Channels", {
        _id: data?.user?.uid,
        email: data?.user?.email,
        name: data?.user?.email?.split("@")[0]
    }), []);
    
    const handleSubmit = useCallback(
        () => {
            if (props.type === "Login") {
                signIn({ email, password }, goToChannels);
            } else {
                signUp({ email, password }, goToChannels);
            }
        },
        [props.type, email, password, signIn, signUp],
    )

    return <View style={styles.contentContainer}>
        <AppText style={styles.header}>{ props.type }</AppText>
        
        <TextInput
            style={[styles.input, emailFocused && styles.focused]}
            value={email}
            onChangeText={handleEmailChange}
            placeholder="himanshu@delightree.com"
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
        />

        <TextInput
            style={[styles.input, passwordFocused && styles.focused]}
            value={password}
            onChangeText={handlePasswordChange}
            placeholder="********"
            passwordRules="required: upper; required: lower; required: digit; max-consecutive: 2; minlength: 8;"
            secureTextEntry={true}
            onFocus={handlePasswordFocus}
            onBlur={handlePasswordBlur}
        />

        <View style={styles.submitContainer}>
            <AppBtn style={styles.submit} onPress={handleSubmit}>
                <Image source={require('../../assets/icons/arrow.png')} style={styles.arrow} />
            </AppBtn>
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
