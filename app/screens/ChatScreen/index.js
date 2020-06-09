import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { FireContext } from '../../FireContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChatScreen = props => {
    const [messages, setMessages] = useState([]);
    const { get, send } = useContext(FireContext);

    useEffect(() => {
        get(setMessages);
    }, []);

    const chat = <GiftedChat messages={messages} onSend={send} user={props.route?.params} />;


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