import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import LogItem from './LogItem';
import AddLogItem from './AddLogItem';
import AddLogModal from './AddLogModal';
import Login from './Login';
import Ticket from './Ticket';
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
			console.log(logs);
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
	//<Login />
	return (
		<div style={{ backgroundColor: 'white' }}>
		<Container fluid>
			<Login />
			{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
			<AddLogModal addItem={addItem} />
			<Row>
				<Col>
					OPEN
					{logs.map(log => <Ticket key={log._id} log={log} />)}
				</Col>
				<Col>IN PROGRESS</Col>
				<Col>CLOSED</Col>
			</Row>
		</Container>
		</div>
	);
}
//{ logs.map(log => <LogItem key={log._id} log={log} deleteItem={deleteItem} />) }
export default App;
