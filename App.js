import React from 'react';
import { FireContextProvider } from './app/FireContext';
import AppNavigation from './app/AppNavigation';

const App = () => {
	return <FireContextProvider>
		<AppNavigation />
	</FireContextProvider>;
};
	
export default App;