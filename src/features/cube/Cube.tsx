import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Texture } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IMember } from '../../types/IMember';

const members: IMember[] = [
	{ id: 1, name: 'Ратибор', color: 'rgba(116, 185, 255,1.0)' },
	{ id: 2, name: 'Лина', color: 'rgba(108, 92, 231,9.0)' },
	{ id: 3, name: 'Кирилл', color: 'rgba(253, 121, 168,8.0)' },
	{ id: 4, name: 'Антон', color: 'rgba(26, 188, 156,9.0)' },
	{ id: 5, name: 'Андрей', color: 'rgba(46, 204, 113,7.0)' },
	{ id: 6, name: 'Иван', color: 'rgba(41, 128, 185,9.0)' },
	{ id: 7, name: 'Дарья', color: 'rgba(155, 89, 182,1.0)' },
];

const Cube = () => {
	const mount = useRef<HTMLDivElement>(null);
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor(0x121212, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	const geometry = new THREE.BoxGeometry();

	useEffect(() => {
		initScene();
	}, []);

	const initScene = async () => {
		if (mount.current === null) return;
		const materials = await fillMaterials();
		const cube = new THREE.Mesh(geometry, materials);
		scene.add(cube);
		camera.position.z = 3;
		controls.update();

		mount.current.appendChild(renderer.domElement);

		const animate = () => {
			requestAnimationFrame(animate);

			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			controls.update();

			renderer.render(scene, camera);
		};
		animate();
	};

	async function fillMaterials(): Promise<THREE.MeshBasicMaterial[]> {
		const materials: THREE.MeshBasicMaterial[] = [];
		// eslint-disable-next-line no-restricted-syntax
		for (const member of members) {
			// eslint-disable-next-line no-await-in-loop
			const canvasTexture = await createTextureWithText(member);
			let texture: Texture = new Texture();
			if (canvasTexture) {
				texture = canvasTexture;
			}
			const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
			materials.push(material);
		}

		return materials;
	}

	async function createTextureWithText(member: IMember): Promise<Texture> {
		const canvas = document.createElement('canvas');
		const canvasContext: CanvasRenderingContext2D | null = canvas.getContext('2d');
		canvas.width = 300;
		canvas.height = 300;

		return new Promise(resolve => {
			if (canvasContext !== null) {
				canvasContext.rect(0, 0, 300, 300);
				canvasContext.fillStyle = member.color;
				canvasContext.fill();
				canvasContext.font = 'bolder 50px Roboto';
				canvasContext.fillStyle = 'white';
				canvasContext.strokeStyle = 'red';
				canvasContext.textAlign = 'center';
				canvasContext.textBaseline = 'middle';
				canvasDrawText(member.name, canvas, canvasContext);
			}
			const texture = new THREE.CanvasTexture(canvas);
			texture.needsUpdate = true;
			resolve(texture);
		});
	}

	function canvasDrawText(
		text: string,
		canvas: HTMLCanvasElement,
		canvasContext: CanvasRenderingContext2D,
		x: number | undefined = undefined,
		y: number | undefined = undefined
	) {
		if (canvasContext === null) {
			console.log('canvas is  null');
			return;
		}
		let posX: number | null = null;
		let posY: number | null = null;
		if (x === undefined || x === null) {
			posX = canvas.width / 2;
		} else {
			posX = x;
		}

		if (y === undefined || y === null) {
			posY = canvas.height / 2;
		} else {
			posY = y;
		}
		canvasContext.fillText(text, posX, posY);
	}

	return <div ref={mount} />;
};

export default Cube;
