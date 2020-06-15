import React, { createContext, useState } from 'react';
import { one_signal_app_id } from '../config.json';
import OneSignal from 'react-native-onesignal';
import { isNonEmptyString } from '../helpers/checks';
import { showMessage } from 'react-native-flash-message';

export const NotificationContext = createContext();

export const NotificationContextProvider = props => {
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
	const [deviceInfo, setDeviceInfo] = useState(null);

    const configureOneSignal = (id, goToChat) => {
        OneSignal.init(one_signal_app_id, {
            kOSSettingsKeyAutoPrompt : true,
            kOSSettingsKeyInFocusDisplayOption: 2
        });
        // ;// set kOSSettingsKeyAutoPrompt to false prompting manually on iOS

        OneSignal.addEventListener('ids', device => {
            onIds(device, id, goToChat);
        });
    };

    const removeOneSignalEvents = () => {
        OneSignal.removeEventListener('received', onReceived);
        OneSignal.removeEventListener('opened', onOpened);
        OneSignal.removeEventListener('ids', (device) => onIds(device, id));
    };

    const onReceived = (notification) => {
        console.log("Notification received: ", notification);
    }
    
    const onOpened = (openResult, goToChat) => {
        showMessage({
            type: "info",
            message: "Redirecting!"
        });

        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);

        if (
            isNonEmptyString(openResult?.notification?.payload?.additionalData?.channelId) &&
            isNonEmptyString(openResult?.notification?.payload?.additionalData?.messageId)
        ) {
            goToChat(
                openResult.notification.payload.additionalData.channelId,
                openResult.notification.payload.additionalData.messageId
            );
        }
    }
    
    const onIds = (device, id, goToChat) => {
        OneSignal.getPermissionSubscriptionState((status) => {
            console.log(status);
    
            OneSignal.setExternalUserId(id);

            OneSignal.inFocusDisplaying(2);

            OneSignal.addEventListener('received', onReceived);
            OneSignal.addEventListener(
                'opened',
                openResult => onOpened(openResult, goToChat)
            );
        });

        if (isNonEmptyString(device?.pushToken)) {
            setDeviceInfo(device);
        }

        console.log('Device info: ', device);
    }

    return <NotificationContext.Provider value={{
        hasUnreadNotifications,
        setHasUnreadNotifications,
        deviceInfo,
        setDeviceInfo,
        configureOneSignal,
        removeOneSignalEvents,
    }}>
        { props.children }
    </NotificationContext.Provider>
};