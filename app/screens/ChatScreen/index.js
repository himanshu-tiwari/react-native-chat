import React, { useState, useContext, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView } from 'react-native';
const ChatScreen = props => {
    const [messages, setMessages] = useState([]);

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