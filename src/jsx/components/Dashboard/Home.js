import React, { useEffect } from 'react';

//Import Components

import MainPagetitle from '../../layouts/MainPagetitle';
import Statistics from '../../pages/Statistics/Statistics';
import { useNavigate } from 'react-router-dom';
const Home = () => {
	const navigate = useNavigate();

	useEffect(() => {
		if (localStorage.getItem("usertoken")) {
		  navigate("/dashboard");
		} else {
		  navigate("/");
		  localStorage.clear();
		}
	  }, []);

	return (
		<>
			<MainPagetitle mainTitle="Dashboard" pageTitle="Dashboard" parentTitle="Home" />
			<Statistics />
		</>
	)
}
export default Home;