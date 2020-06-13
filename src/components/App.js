import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Form, Button, Navbar, InputGroup } from 'react-bootstrap';
import { DragDropContext } from 'react-beautiful-dnd';
import AddLogModal from './AddLogModal';
import Login from './Login';
import Ticket from './Ticket';
import Kolumn from './Kolumn';
import { ipcRenderer } from 'electron';

const App = () => {
	const [logs, setLogs] = useState([]);

	const [alert, setAlert] = useState({
		show: false,
		message: '',
		variant: 'success'
	});

	useEffect(() => {
		ipcRenderer.send('logs:load');

		ipcRenderer.on('logs:get', (e, logs) => {
			setLogs(JSON.parse(logs));
			//console.log(logs);
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

	function showAlert(message, variant = 'success', time = 3000) {
		setAlert({
			show: true,
			message,
			variant
		});

		setTimeout(() => {
			setAlert({
				show: false,
				message: '',
				variant: 'success'
			})
		}, time);
	}

	const onDragEnd = result => {
		/*
		destination and source both have .index and .droppableId
		droppableId is the Kolumn title string
		draggableId is the log's _id
		*/
		const { destination, source, draggableId } = result;

		if (
			!destination ||
			(destination.index === source.index && destination.droppableId === source.droppableId)
		) {
			return; // null destination or destination===source, exit function
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

	//<Login />
	//column cards could be separate component
	return (
			<div style={{ backgroundColor: 'black' }}>
			<Login />
			{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
			{/* replace alert with dismissible toasts */}

			<DragDropContext onDragEnd={onDragEnd}>

			<Card bg='dark'>
				<Card.Header>
					<Navbar className='justify-content-between'>
						<AddLogModal addItem={addItem} />
						<InputGroup className='ml-lg-3'>
							<Form.Control style={{ backgroundColor: '#343a40', borderColor: '#17a2b8' }} type='text' size='sm' placeholder='Filter tickets' />
							<InputGroup.Append>
								<Button variant='outline-info' size='sm'>Search</Button>
							</InputGroup.Append>
						</InputGroup>
					</Navbar>
				</Card.Header>
				<Card.Body>
					<Row>
						<Kolumn title='BACKLOG' logs={logs} />
						<Kolumn title='IN PROGRESS' logs={logs} />
						<Kolumn title='RESOLVED' logs={logs} />
					</Row>
				</Card.Body>
			</Card>

			</DragDropContext>
		</div>
	);
}

export default App;
