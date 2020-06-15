import React from 'react';
import { FireContextProvider } from './app/contexts/FireContext';
import FlashMessage from 'react-native-flash-message';
import AppNavigation from './app/AppNavigation';
import { NotificationContextProvider } from './app/contexts/NotificationContext';

const App = () => {
	return <NotificationContextProvider>
		<FireContextProvider>
			<AppNavigation />

			<FlashMessage position="top" />
		</FireContextProvider>
	</NotificationContextProvider>;
};
	
export default App;