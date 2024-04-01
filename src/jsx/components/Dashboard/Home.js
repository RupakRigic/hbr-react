import React, { useEffect } from 'react';

//Import Components

import MainPagetitle from '../../layouts/MainPagetitle';
import Statistics from '../../pages/Statistics/Statistics';
const Home = () => {

	useEffect(() => {

	}, []);

	return (
		<>
			<MainPagetitle mainTitle="Dashboard" pageTitle="Dashboard" parentTitle="Home" />
			<Statistics />
		</>
	)
}
export default Home;