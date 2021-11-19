import React, { useEffect } from 'react';
import Cube from './Cube';

const CubePage = () => {
	useEffect(() => {
		console.log('cube is loaded');
	}, []);
	return (
		<div>
			<Cube />
		</div>
	);
};

export default CubePage;
