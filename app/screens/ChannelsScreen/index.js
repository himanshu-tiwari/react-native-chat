import React, { useContext, useState, useEffect, useCallback } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, InteractionManager, View, Image } from 'react-native';
import AppText from '../../components/AppText';
import { FireContext } from '../../FireContext';
import { isNonEmptyArray } from '../../helpers/checks';
import AppBtn from '../../components/AppBtn';
import Avatar from '../../components/Avatar';
import Members from './Members';
import CreateChannelModal from './CreateChannelModal';

const ChannelsScreen = props => {
    const { get } = useContext(FireContext);

    const [channels, setChannels] = useState([]);
    const [users, setUsers] = useState([]);
    const [creationModalVisible, setCreationModalVisible] = useState(false);

    console.log({ channels, params: props.route?.params, users });

    useEffect(() => {
        let expensiveCall;

        expensiveCall = InteractionManager.runAfterInteractions(() => {
            get("channels", setChannels, props.route?.params?._id);
            get("users", setUsers);
        });

        return () => {
            if (typeof(expensiveCall?.cancel) === "function") {
                expensiveCall.cancel();
            }
        }
    }, [props.route?.params?._id]);

    const goToChat = useCallback(
        channelId => props.navigation?.navigate("Chat", {
            channelId,
            user: props.route?.params
        }),
        [],
    );

    const channelMap = useCallback(
        channel => <AppBtn
            key={channel?._id}
            onPress={() => goToChat(channel?._id)}
            style={styles.channel}
        >   
            <Avatar url={channel.avatar} style={styles.avatar} />

            <View style={styles.channelText}>
                <AppText style={styles.channelTitle}>{ channel?.title }</AppText>
                
                <Members memberIds={channel?.members} />
            </View>
        </AppBtn>,
        [],
    );

    const openModal = useCallback(() => { setCreationModalVisible(true); }, []);

    const closeModal = useCallback(() => setCreationModalVisible(false), []);

    return <SafeAreaView style={styles.safeAreaView}>
        <ScrollView style={styles.channelsContainer}>{
            isNonEmptyArray(channels) ? channels.map(channelMap) : <AppText>No channel!</AppText>
        }</ScrollView>

        <AppBtn style={styles.create} onPress={openModal}>
            <Image source={require("../../assets/icons/plus.png")} style={styles.add} />
        </AppBtn>

        <CreateChannelModal visible={creationModalVisible} close={closeModal} users={users} />
    </SafeAreaView>;
};

export default ChannelsScreen;

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1
    },
    channelsContainer: {
        flex: 1,
        padding: 20
    },
    channel: {
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        elevation: 5,
        paddingVertical: 10,
        flexDirection: "row"
    },
    avatar: {
        marginRight: 10
    },
    channelText: {
        flex: 1,
        paddingVertical: 5
    },
    channelTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5
    },
    create: {
        position: "absolute",
        right: 25,
        bottom: 70,
        backgroundColor: "#9075e3",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5
    },
    add: {
        width: 25,
        height: 25,
    }
});
