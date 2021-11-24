import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { Button, Layout } from 'antd';
import MemberList from './MemberList';
import './member.scss';
import { Context } from '../../index';

const { Content, Footer } = Layout;

const MemberPage = () => {
	const { memberStore } = useContext(Context);
	const navigate = useNavigate();
	return (
		<Layout className='layout member'>
			<Content className='layout__content'>
				<MemberList />
				<div className='member__action-wrapper'>
					<Button disabled={memberStore.members.length < 4} type='primary' onClick={() => navigate('/cube')}>
						Продолжить
					</Button>
				</div>
			</Content>
			<Footer style={{ textAlign: 'center' }}>
				Created by{' '}
				<a href='https://t.me/zehael' target='_blank' rel='noreferrer'>
					zehael
				</a>{' '}
				©2021
			</Footer>
		</Layout>
	);
};

export default observer(MemberPage);
