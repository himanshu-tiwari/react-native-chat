import React, { useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { FireContext } from '../../FireContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import NetInfo from "@react-native-community/netinfo";
import AppRecorder from './AppRecorder';
import { v4 as uuidv4 } from 'uuid'

const ChatScreen = props => {
    const { get, send } = useContext(FireContext);

    const [messages, setMessages] = useState([]);

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

    const renderActions = useCallback(
        () => <AppRecorder
            send={handleSend}
            user={props.route?.params}
            messageIdGenerator={uuidv4}
            setUploading={setUploading}
        />,
        [handleSend, props.route?.params],
    );

    return <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView style={styles.flex} keyboardVerticalOffset={10} enabled>
            <GiftedChat
                messages={messages}
                onSend={handleSend}
                user={props.route?.params}
                renderActions={renderActions}
                messageIdGenerator={uuidv4}
            />
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