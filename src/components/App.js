import React, { useState, useEffect } from 'react';
import { Row, Card } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import Login from './Login';
import Ticket from './Ticket';
import Kolumn from './Kolumn';
import Header from './Header';
import { ipcRenderer } from 'electron';

const App = () => {
	const [logs, setLogs] = useState([]);
	const [user, setUser] = useState(null);

	const [columns, setColumns] = useState({
		backlog: [],
		in_progress: [],
		resolved: []
	});

	useEffect(() => {
		ipcRenderer.send('logs:load');

		ipcRenderer.on('logs:get', (e, _logs) => {
			setLogs(JSON.parse(_logs));
		});

		ipcRenderer.on('username', (e, u) => {
			setUser(u);
		});

		ipcRenderer.on('logs:clear', () => {
			setLogs([]);
		});
	}, []);

	useEffect(() => {
		setColumns({
			backlog: logs.filter(log => log.category === 'BACKLOG'),
			in_progress: logs.filter(log => log.category === 'IN PROGRESS'),
			resolved: logs.filter(log => log.category === 'RESOLVED')
		});
	}, [logs]);

	const getCard = source => {
		switch (source.droppableId) {
			case 'BACKLOG':
				return columns.backlog.splice(source.index, 1)[0];
			case 'IN PROGRESS':
				return columns.in_progress.splice(source.index, 1)[0];
			case 'RESOLVED':
				return columns.resolved.splice(source.index, 1)[0];
		}
	}

	const onDragEnd = result => {
		const { destination, source, draggableId } = result;

		if (
			!destination ||
			(destination.index === source.index && destination.droppableId === source.droppableId)
		) {
			return; //null destination or destination === source, exit function
		}

		const card = getCard(source);

		switch (destination.droppableId) {
			case 'BACKLOG':
				columns.backlog.splice(destination.index, 0, card);
				break;
			case 'IN PROGRESS':
				columns.in_progress.splice(destination.index, 0, card);
				break;
			case 'RESOLVED':
				columns.resolved.splice(destination.index, 0, card);
		}

		if (destination.droppableId !== source.droppableId) {
			ipcRenderer.send('logs:move_log', draggableId, destination.droppableId);
		}
	}

	return (
			<div style={{ backgroundColor: 'black' }}>
			<Login />

			<DragDropContext onDragEnd={onDragEnd}>

			<Card bg='dark'>
				<Card.Header>
					<Header columns={columns} setColumns={setColumns} />
				</Card.Header>
				<Card.Body style={{ height: 800 }}>
					<Row>
						<Kolumn title='BACKLOG' column={columns.backlog} user={user} />
						<Kolumn title='IN PROGRESS' column={columns.in_progress} user={user} />
						<Kolumn title='RESOLVED' column={columns.resolved} user={user} />
					</Row>
				</Card.Body>
			</Card>

			</DragDropContext>
		</div>
	);
}

export default App;
