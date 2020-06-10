import React, { useState, useContext, useEffect, useCallback } from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { FireContext } from '../../FireContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import NetInfo from "@react-native-community/netinfo";
import AppRecorder from './AppRecorder';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid'
import OverlayLoader from '../../components/OverlayLoader';
import AppAudioPlayer from './AppAudioPlayer';
import { isNonEmptyString } from '../../helpers/checks';

const ChatScreen = props => {
    const { get, send } = useContext(FireContext);

    const [messages, setMessages] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        get("messages", setMessages, props.route?.params?.channelId);
    }, [props.route?.params?.channelId]);

    const handleSend = useCallback(
        messages => {
            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    send({
                        text: messages[0].text,
                        user: messages[0].user,
                        channelId: props.route?.params?.channelId,
                        ...(isNonEmptyString(messages[0].audio) ? { audio: messages[0].audio } : {})
                    }, "messages");
                } else {
                    showMessage({
                        type: "danger",
                        message: "You don't have a stable internet connection! Stay connected to have the optimal experience!"
                    });
                }
            });
        },
        [props.route?.params?.channelId],
    );

    const renderActions = useCallback(
        () => <AppRecorder
            send={handleSend}
            user={props.route?.params?.user}
            messageIdGenerator={uuidv4}
            setUploading={setUploading}
        />,
        [handleSend, props.route?.params?.user],
    );

    const renderMessageAudio = useCallback(props => <AppAudioPlayer {...props} />, []);

    return <SafeAreaView style={styles.safeAreaView}>
        <KeyboardAvoidingView style={styles.flex} enabled>
            <GiftedChat
                messages={messages}
                onSend={handleSend}
                user={props.route?.params?.user}
                renderActions={renderActions}
                messageIdGenerator={uuidv4}
                renderMessageAudio={renderMessageAudio}
                messagesContainerStyle={{ paddingBottom: 10 }}
            />
        </KeyboardAvoidingView>

        { uploading && <OverlayLoader type="audio" /> }
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