import React, { useContext, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Texture } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { IMember } from '../../types/IMember';
import { Context } from '../../index';

const Cube = () => {
	const navigate = useNavigate();
	const { memberStore } = useContext(Context);
	const mount = useRef<HTMLDivElement>(null);
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setClearColor(0x121212, 0);
	renderer.setSize(window.innerWidth, window.innerHeight);
	const controls = new OrbitControls(camera, renderer.domElement);
	const geometry = new THREE.BoxGeometry();
	let cube = new THREE.Mesh(geometry, []);
	let lastMaterialIndex: number = 0;
	let lastXCord: number = 0;
	let rotationSpeed: number = 0.01;
	const [randomMember, setRandomMember] = useState<IMember | null>(null);

	useEffect(() => {
		if (memberStore.members.length === 0) {
			navigate('/');
		} else {
			initScene();
		}
	}, []);

	const initScene = async () => {
		if (mount.current === null) return;
		const firstMembers = [...memberStore.members].slice(0, 6);
		console.log('first materials for members', firstMembers);
		const materials = await createTexturesMeshMaterials(firstMembers);
		lastMaterialIndex = 6;
		cube = new THREE.Mesh(geometry, materials);
		scene.add(cube);
		camera.position.z = 3;
		controls.update();
		mount.current.appendChild(renderer.domElement);
		animate();
	};

	const animate = () => {
		requestAnimationFrame(animate);
		cube.rotation.x += rotationSpeed;
		cube.rotation.y += rotationSpeed;
		controls.update();
		checkRotation();
		renderer.render(scene, camera);
	};

	const checkRotation = () => {
		const { x } = cube.rotation;
		const materialIsEnumerated = lastMaterialIndex >= memberStore.members.length;
		if (x >= lastXCord + 2 && !materialIsEnumerated) {
			console.log('need updated material', lastMaterialIndex);
			lastMaterialIndex += 1;
			lastXCord = x;
			updateMaterials();
		}
	};

	const rollDice = async () => {
		const firstMembers = [...memberStore.members].slice(0, 6);
		const materials = await createTexturesMeshMaterials(firstMembers);
		cube.material = materials;
		lastMaterialIndex = 6;
		rotationSpeed = 0.1;
		setTimeout(selectRandomMember, 3000);
	};

	const selectRandomMember = async () => {
		const newRandomMember = memberStore.members[Math.floor(Math.random() * memberStore.members.length)];
		const texture = await createTextureWithText(newRandomMember);
		const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
		cube.material[4] = material;
		cube.rotation.x = 0;
		cube.rotation.y = 0;
		rotationSpeed = 0;
		setRandomMember(newRandomMember);
	};

	async function updateMaterials(): Promise<void> {
		const members = [...memberStore.members].slice(lastMaterialIndex - 6, lastMaterialIndex);
		console.log('create materials for members', members);
		const materials = await createTexturesMeshMaterials(members);
		cube.material = materials;
		controls.update();
		// renderer.render(scene, camera);
	}

	async function createTexturesMeshMaterials(members: IMember[]): Promise<THREE.MeshBasicMaterial[]> {
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
			if (materials.length === 6) {
				break;
			}
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
				canvasContext.fillStyle = member.color;
				canvasContext.fillRect(0, 0, 300, 300);
				canvasContext.font = 'bolder 46px Roboto';
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

	return (
		<div>
			<div className='cube__action'>
				<Button disabled={randomMember !== null} size='large' type='primary' onClick={rollDice}>
					Выбрать случайный
				</Button>
			</div>
			{randomMember !== null && (
				<div className='cube__selected'>
					Победитель <strong>{randomMember.name}</strong>
				</div>
			)}
			<div ref={mount} />;
		</div>
	);
};

export default observer(Cube);
