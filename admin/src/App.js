import './App.css';
import { useEffect, useState, createContext } from 'react';
import Layout from './views/layouts/Layout';
import Login from './views/Login';
import { BrowserRouter } from 'react-router-dom';
import { If } from './utils/controls';
import util from './utils/util';
import auth from './services/auth';
import config from './rdx';

export const IsSuperAdminContext = createContext();

function App() {
	const [isLoggedin, setIsLoggedin, createContext] = useState(util.isLogged());
	const [isSuperAdmin, setIsSuperAdmin] = useState(config.isSupeadmin);


	useEffect(() => {
		auth.validateToken().then(res => {
			setIsLoggedin(true);
			config.userType = res.type;
			config.serviceType = res.serviceType;
			if (res.type === 'superAdmin') {
				config.isSupeadmin = true;
				setIsSuperAdmin(true);
			}
		}).catch(err => {
			setIsLoggedin(false);
			window.localStorage.clear();
		})
	}, [])


	return (
		<>
			<BrowserRouter basename="/cargo/admin">
				<If cond={isLoggedin}>
					<IsSuperAdminContext.Provider value={isSuperAdmin}>
						<Layout />
					</IsSuperAdminContext.Provider>
				</If>
				<If cond={!isLoggedin}>
					<Login />
				</If>
			</BrowserRouter>
		</>
	);
}

export default App;
