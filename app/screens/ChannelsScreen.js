import React, { useContext, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import AppText from '../components/AppText';
import { FireContext } from '../FireContext';

const ChannelsScreen = props => {
    const { get } = useContext(FireContext);

    const [channels, setChannels] = useState([]);

    useEffect(() => {
        get("channels", setChannels);
    }, []);
};

export default ChannelsScreen;

const styles = StyleSheet.create({

});
