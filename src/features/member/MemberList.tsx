import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { IMember } from '../../types/IMember';
import getRandomColor from '../../utils/colorGenerator';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
	key: string;
	name: string;
	age: string;
	address: string;
}

interface EditableRowProps {
	index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
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
	dataIndex: keyof Item;
	record: Item;
	handleSave: (record: Item) => void;
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
						message: `${title} is required.`,
					},
				]}
			>
				<Input ref={inputRef} onPressEnter={save} onBlur={save} />
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
	const [count, setCount] = useState<number>(2);
	const [dataMembers, setDataMembers] = useState<IMember[]>([
		{ id: 1, name: 'Ратибор', color: 'rgba(116, 185, 255,1.0)' },
		{ id: 2, name: 'Лина', color: 'rgba(108, 92, 231,9.0)' },
		{ id: 3, name: 'Кирилл', color: 'rgba(253, 121, 168,8.0)' },
		{ id: 4, name: 'Антон', color: 'rgba(26, 188, 156,9.0)' },
		{ id: 5, name: 'Андрей', color: 'rgba(46, 204, 113,7.0)' },
		{ id: 6, name: 'Иван', color: 'rgba(41, 128, 185,9.0)' },
		{ id: 7, name: 'Дарья', color: 'rgba(155, 89, 182,1.0)' },
	]);
	const columns = [
		{
			title: 'Имя',
			dataIndex: 'name',
			width: '70%',
			editable: true,
		},
		{
			title: 'Действия',
			dataIndex: 'operation',
			align: 'right',
			render: (_, record: { id: React.Key }) =>
				dataMembers.length >= 1 ? (
					<Popconfirm title='Sure to delete?' onConfirm={() => handleDelete(record.id)}>
						<a>Delete</a>
					</Popconfirm>
				) : null,
		},
	];

	const handleDelete = (key: number | string | React.Key) => {
		console.log('delete Key', key);
		setDataMembers([...dataMembers.filter(member => member.id !== key)]);
	};

	const handleAdd = () => {
		const newData: IMember = {
			id: count,
			name: `Участник ${count + 1}`,
			color: getRandomColor(),
		};
		setDataMembers([...dataMembers, newData]);
		setCount(count + 1);
	};

	const handleSave = (row: IMember) => {
		const newData = [...dataMembers];
		const index = newData.findIndex(item => row.id === item.id);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});
		setDataMembers(newData);
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
			<Button onClick={handleAdd} type='primary' style={{ marginBottom: 16 }}>
				Добавить участника
			</Button>
			<Table
				rowKey='id'
				components={components}
				rowClassName={() => 'editable-row'}
				bordered
				pagination={false}
				dataSource={dataMembers}
				columns={tableColumns as ColumnTypes}
			/>
		</div>
	);
};

export default MemberList;
