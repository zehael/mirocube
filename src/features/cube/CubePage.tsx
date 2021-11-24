import React, { useEffect } from 'react';
import Cube from './Cube';
import './cube.scss';

const CubePage = () => {
	useEffect(() => {
		console.log('cube is loaded');
	}, []);
	return (
		<div className='cube'>
			<Cube />
		</div>
	);
};

export default CubePage;
