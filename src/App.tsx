import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MemberPage from './features/member/MemberPage';
import CubePage from './features/cube/CubePage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<MemberPage />} />
				<Route path='/cube' element={<CubePage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
