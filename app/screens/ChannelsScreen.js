import React, { useContext, useState, useEffect, useCallback } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, InteractionManager } from 'react-native';
import AppText from '../components/AppText';
import { FireContext } from '../FireContext';
import { isNonEmptyArray } from '../helpers/checks';
import AppBtn from '../components/AppBtn';

const ChannelsScreen = props => {
    const { get } = useContext(FireContext);

    const [channels, setChannels] = useState([]);

    useEffect(() => {
        let expensiveCall;

        expensiveCall = InteractionManager.runAfterInteractions(() => {
            get("channels", setChannels);
        });

        return () => {
            if (typeof(expensiveCall?.cancel) === "function") {
                expensiveCall.cancel();
            }
        }
    }, []);

    const channelFilter = useCallback(
        channel => channel?.members?.includes(props.route?.params?._id),
        [],
    );

    const channelMap = useCallback(
        channel => {
            console.log({ channel: channel })
            return <AppBtn onPress={() => {}}>
                <AppText key={channel?._id}>{ channel?.title }</AppText>
            </AppBtn>;
        },
        [],
    );

    return <SafeAreaView>
        <ScrollView>{
            isNonEmptyArray(channels)
                ? channels.filter(channelFilter).map(channelMap)
                : <AppText>No channel!</AppText>
        }</ScrollView>
    </SafeAreaView>;
};

export default ChannelsScreen;

const styles = StyleSheet.create({

});
