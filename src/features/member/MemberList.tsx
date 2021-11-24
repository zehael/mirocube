import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Avatar } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { observer } from 'mobx-react-lite';
import { UserAddOutlined } from '@ant-design/icons';
import { IMember } from '../../types/IMember';
import getRandomColor from '../../utils/colorGenerator';
import { Context } from '../../index';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
	index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

interface EditableCellProps {
	title: React.ReactNode;
	editable: boolean;
	children: React.ReactNode;
	dataIndex: keyof IMember;
	record: IMember;
	// eslint-disable-next-line no-unused-vars
	handleSave: (record: IMember) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef<Input>(null);
	const form = useContext(EditableContext)!;

	useEffect(() => {
		if (editing) {
			inputRef.current!.focus();
		}
	}, [editing]);

	const toggleEdit = () => {
		setEditing(!editing);
		form.setFieldsValue({ [dataIndex]: record[dataIndex] });
	};

	const save = async () => {
		try {
			const values = await form.validateFields();

			toggleEdit();
			handleSave({ ...record, ...values });
		} catch (errInfo) {
			console.log('Save failed:', errInfo);
		}
	};

	let childNode = children;

	if (editable) {
		childNode = editing ? (
			<Form.Item
				style={{ margin: 0 }}
				name={dataIndex}
				rules={[
					{
						required: true,
						message: `${title} обязательно для заполнения.`,
					},
				]}
			>
				<Input className='table-input' ref={inputRef} onPressEnter={save} onBlur={save} />
			</Form.Item>
		) : (
			// eslint-disable-next-line jsx-a11y/no-static-element-interactions
			<div className='editable-cell-value-wrap' style={{ paddingRight: 24 }} onClick={toggleEdit}>
				{children}
			</div>
		);
	}

	return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const MemberList = () => {
	const { memberStore } = useContext(Context);
	const [count, setCount] = useState<number>(0);
	const columns = [
		{
			title: 'Имя',
			dataIndex: 'name',
			width: '70%',
			editable: true,
		},
		{
			title: 'Color',
			dataIndex: 'color',
			width: 100,
			align: 'center',
			render: text => <Avatar style={{ backgroundColor: text }} size={48} shape='circle' />,
		},
		{
			title: 'Действия',
			dataIndex: 'operation',
			align: 'right',
			render: (_, record: { id: React.Key }) =>
				memberStore.members.length >= 1 ? (
					<Popconfirm title='Sure to delete?' onConfirm={() => handleDelete(record.id)}>
						<Button type='link'>Delete</Button>
					</Popconfirm>
				) : null,
		},
	];

	useEffect(() => {
		setCount(memberStore.members.length);
	}, [memberStore.members]);

	const handleAdd = () => {
		const newData: IMember = {
			id: Date.now(),
			name: `Участник ${count + 1}`,
			color: getRandomColor(memberStore.members),
		};
		memberStore.setMembers([newData, ...memberStore.members]);
	};

	const handleSave = (row: IMember) => {
		const newData = [...memberStore.members];
		const index = newData.findIndex(item => row.id === item.id);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});
		memberStore.setMembers(newData);
	};

	const handleDelete = (key: number | string | React.Key) => {
		memberStore.setMembers([...memberStore.members.filter(member => member.id !== key)]);
	};

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	const tableColumns = columns.map(col => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: IMember) => ({
				record,
				editable: col.editable,
				dataIndex: col.dataIndex,
				title: col.title,
				handleSave,
			}),
		};
	});

	return (
		<div>
			<Button
				disabled={memberStore.members.length > 300}
				onClick={handleAdd}
				style={{ marginBottom: 16 }}
				icon={<UserAddOutlined />}
			>
				Добавить участника
			</Button>
			<Table
				id='table'
				rowKey='id'
				components={components}
				rowClassName={() => 'editable-row'}
				bordered
				pagination={false}
				dataSource={memberStore.members}
				columns={tableColumns as ColumnTypes}
			/>
		</div>
	);
};

export default observer(MemberList);
