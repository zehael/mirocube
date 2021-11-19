import React from 'react';
import { Layout } from 'antd';
import MemberList from './MemberList';

const { Content, Footer } = Layout;

const MemberPage = () => (
	<Layout className='layout'>
		<Content className='layout__content'>
			<MemberList />
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

export default MemberPage;
