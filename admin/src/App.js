import './App.css';
import { useEffect, useState } from 'react';
import Layout from './views/layouts/Layout';
import Login from './views/Login';
import { BrowserRouter } from 'react-router-dom';
import { If } from './utils/controls';
import util from './utils/util';
import auth from './services/auth';

function App() {
	const [isLoggedin, setIsLoggedin] = useState(util.isLogged());

	useEffect(() => {
		auth.validateToken().then(res=>{
			setIsLoggedin(true)
		}).catch(err=>{
			setIsLoggedin(false);
			window.localStorage.clear();
		})
	}, [])


	return (
		<>
			<BrowserRouter basename="/rupiloan/admin">
				<If cond={isLoggedin}>
					<Layout />
				</If>
				<If cond={!isLoggedin}>
					<Login />
				</If>
			</BrowserRouter>
		</>
	);
}

export default App;
