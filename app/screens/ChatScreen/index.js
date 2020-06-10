import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { FireContext } from '../../FireContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import NetInfo from "@react-native-community/netinfo";

const ChatScreen = props => {
    const [messages, setMessages] = useState([]);
    const { get, send } = useContext(FireContext);

    useEffect(() => {
        get(setMessages);
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
        <KeyboardAvoidingView style={styles.flex} enabled>{
            chat
        }</KeyboardAvoidingView>
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