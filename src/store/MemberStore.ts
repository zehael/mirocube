import { makeAutoObservable } from 'mobx';
import { IMember } from '../types/IMember';

export default class MemberStore {
	members = [] as IMember[];

	editing: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setMembers(payload: IMember[]) {
		console.log('try set members', payload);
		this.members = payload;
	}

	setEditing(payload: boolean) {
		this.editing = payload;
	}
}
