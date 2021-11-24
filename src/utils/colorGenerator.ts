import { IMember } from '../types/IMember';

const colors = [
	'rgba(34, 166, 179,1.0)',
	'rgba(235, 77, 75,1.0)',
	'rgba(116, 185, 255,1.0)',
	'rgba(224, 86, 253,1.0)',
	'rgba(108, 92, 231,9.0)',
	'rgba(240, 147, 43,1.0)',
	'rgba(156, 136, 255,1.0)',
	'rgba(253, 121, 168,8.0)',
	'rgba(26, 188, 156,9.0)',
	'rgba(249, 202, 36,1.0)',
	'rgba(46, 204, 113,7.0)',
	'rgba(255, 99, 72,1.0)',
	'rgba(41, 128, 185,9.0)',
	'rgba(112, 161, 255,1.0)',
	'rgba(155, 89, 182,1.0)',
	'rgba(186, 220, 88,1.0)',
];

const getRandomColor = (members: IMember[]): string => {
	const randomColor = colors[Math.floor(Math.random() * colors.length)];
	const memberWithCurrentColor = members.find(member => member.color === randomColor);
	if (memberWithCurrentColor) {
		return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
	}
	return randomColor;
};

export default getRandomColor;
