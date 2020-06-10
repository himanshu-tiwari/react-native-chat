import React, { useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import HeaderLeft from './screens/ChatScreen/HeaderLeft';
import ChannelsScreen from './screens/ChannelsScreen';

const Stack = createStackNavigator();

const AppNavigation = () => {
    const renderHeaderLeft = useCallback(props => <HeaderLeft {...props} />, []);

    return <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
        }}>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Channels" component={ChannelsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={{
                headerBackTitleVisible: false,
                headerStyle: {
                    backgroundColor: "#fff",
                    borderBottomWidth: 0
                },
                headerTitleStyle: {
                    display: "none"
                },
                headerLeft: renderHeaderLeft,
            }} />
        </Stack.Navigator>
    </NavigationContainer>;
};

export default AppNavigation;
