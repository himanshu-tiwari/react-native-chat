import React, { useState, memo, useCallback } from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import Tabs from './Tabs';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const windowWidth = Dimensions.get("window").width;

const initialLayout = { width: windowWidth };

const renderTabBar = props => <TabBar {...props} style={{ backgroundColor: "#9075e3" }} />

const LoginScreen = props => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'login', title: 'Login' },
        { key: 'signup', title: 'Signup' },
    ]);
    
    const renderScene = SceneMap({
        login: useCallback(() => <Tabs type="Login" navigation={props.navigation} />, []),
        signup: useCallback(() => <Tabs type="Signup" navigation={props.navigation} />, []),
    });
    
    return <View style={styles.container}>
        <View style={[styles.circle, {
            width: 1.75*windowWidth,
            height: 1.75*windowWidth,
            borderRadius: 1.75*windowWidth,
            left: -0.75*windowWidth,
            top: -0.25*windowWidth
        }]} />

        <View style={styles.logoContainer}>
            <Image source={require('../../assets/icons/coffee.png')} style={styles.logo} />
        </View>

        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={initialLayout}
            tabBarPosition="bottom"
            renderTabBar={renderTabBar}
        />
    </View>;
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee"
    },
    circle: {
        backgroundColor: "#fff",
        position: "absolute"
    },
    logoContainer: {
        marginTop: 64
    },
    logo: {
        width: 100,
        height: 100,
        alignSelf: "center"
    }
});
