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

	useEffect(() => {
		ipcRenderer.send('logs:load');

		ipcRenderer.on('logs:get', (e, logs) => {
			setLogs(JSON.parse(logs));
			//console.log(logs);
		});

		ipcRenderer.on('username', (e, u) => {
			setUser(u);
		});

		ipcRenderer.on('logs:clear', () => {
			setLogs([]);
			showAlert('Logs Cleared');
		});
	}, [])

	function addItem(item) {
		if (item.text === '') {
			showAlert('Please enter a description', 'danger');
			return false;
		}

		ipcRenderer.send('logs:add', item);
		showAlert('Log Added');
	}

	function deleteItem(id) {
		ipcRenderer.send('logs:delete', id);
		showAlert('Log Removed');
	}

	const onDragEnd = result => {
		const { destination, source, draggableId } = result;

		if (
			!destination ||
			(destination.index === source.index && destination.droppableId === source.droppableId)
		) {
			return; //null destination or destination === source, exit function
		}

		// rearrange the Logs
		// if the kolumnm is different need to update log category in main then sendLogs back
		// and handle indexing
		// if the kolumn is the same, still need to handle indexing
		// seems like indexing could be extracted as a helper

		if (destination.droppableId !== source.droppableId) {
			ipcRenderer.send('logs:move_log', draggableId, destination.droppableId);
		} else {
			//// TODO
			return; // replace me
		}
	}

	return (
			<div style={{ backgroundColor: 'black' }}>
			<Login />

			{/* still need user feedback for adding ticket */}
			{/* could be as simple as BACKLOG order being most to least recent */}

			<DragDropContext onDragEnd={onDragEnd}>

			<Card bg='dark'>
				<Card.Header>
					<Header addItem={addItem} />
				</Card.Header>
				<Card.Body style={{ height: 800 }}>
					<Row>
						<Kolumn title='BACKLOG' logs={logs} user={user} />
						<Kolumn title='IN PROGRESS' logs={logs} user={user} />
						<Kolumn title='RESOLVED' logs={logs} user={user} />
					</Row>
				</Card.Body>
			</Card>

			</DragDropContext>
		</div>
	);
}

export default App;
