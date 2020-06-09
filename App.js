import React from 'react';
import { FireContextProvider } from './app/FireContext';
import FlashMessage from 'react-native-flash-message';
import AppNavigation from './app/AppNavigation';

const App = () => {
	return <FireContextProvider>
		<AppNavigation />

		<FlashMessage position="top" />
	</FireContextProvider>;
};
	
export default App;