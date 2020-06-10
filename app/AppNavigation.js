import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import HeaderLeft from './screens/ChatScreen/HeaderLeft';
import ChannelsScreen from './screens/ChannelsScreen';

const Stack = createStackNavigator();

const AppNavigation = () => {
    const channelsHeaderLeft = useCallback(props => <HeaderLeft {...props} toLogin={true} />, []);
    const chatHeaderLeft = useCallback(props => <HeaderLeft {...props} />, []);

    return <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Channels" component={ChannelsScreen} options={{
                headerBackTitleVisible: false,
                headerStyle: {
                    backgroundColor: "#fff",
                    borderBottomWidth: 0
                },
                headerTitleStyle: {
                    display: "none"
                },
                headerLeft: channelsHeaderLeft,
            }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{
                headerBackTitleVisible: false,
                headerStyle: {
                    backgroundColor: "#fff",
                    borderBottomWidth: 0
                },
                headerTitleStyle: {
                    display: "none"
                },
                headerLeft: chatHeaderLeft,
            }} />
        </Stack.Navigator>
    </NavigationContainer>;
};

export default AppNavigation;
