import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import MemberStore from './store/MemberStore';

interface RootState {
	memberStore: MemberStore;
}

const memberStore = new MemberStore();

// eslint-disable-next-line import/prefer-default-export
export const Context = createContext<RootState>({
	memberStore,
});

ReactDOM.render(
	// eslint-disable-next-line react/jsx-no-constructed-context-values
	<Context.Provider value={{ memberStore }}>
		<App />
	</Context.Provider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
