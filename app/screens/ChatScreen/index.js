import React, { useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, KeyboardAvoidingView, Keyboard } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { FireContext } from '../../FireContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import NetInfo from "@react-native-community/netinfo";
import AppRecorder from './AppRecorder';

const ChatScreen = props => {
    const [messages, setMessages] = useState([]);
    const { get, send } = useContext(FireContext);

    const [messages, setMessages] = useState([]);
    const [displayExtraInputs, setDisplayExtraInputs] = useState(false);

    const _keyboardDidShow = useCallback(() => setDisplayExtraInputs(true), []);
    const _keyboardDidHide = useCallback(() => setDisplayExtraInputs(false), []);

    useEffect(() => {
        get(setMessages);

        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const handleSend = useCallback(
        message => {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    send(message);
                } else {
                    showMessage({
                        type: "danger",
                        message: "You don't have a stable internet connection! Stay connected to have the optimal experience!"
                    });
                }
            });
        },
        [],
    );


    return <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView style={styles.flex} keyboardVerticalOffset={10} enabled>
            <GiftedChat messages={messages} onSend={handleSend} user={props.route?.params} />

            {
                displayExtraInputs && <AppRecorder />
            }
        </KeyboardAvoidingView>
    </SafeAreaView>;
};

export default ChatScreen;

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    flex: {
        flex: 1
    }
});