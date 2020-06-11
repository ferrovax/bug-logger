import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import LogItem from './LogItem';
import AddLogItem from './AddLogItem';
import AddLogModal from './AddLogModal';
import Login from './Login';
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
		<Container>
		<Login />
			<AddLogModal addItem={addItem} />
			{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
			<Table striped bordered variant='dark'>
				<thead>
					<tr>
						<th></th>
						<th>OPEN</th>
						<th>IN PROGRESS</th>
						<th>CLOSED</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>1</td>
						<td>entry #1</td>
						<td>entry #1</td>
						<td>entry #1</td>
					</tr>
					<tr>
						<td>2</td>
						<td>entry #2</td>
						<td>entry #2</td>
						<td>entry #2</td>
					</tr>
					<tr>
						<td>3</td>
						<td>entry #3</td>
						<td>entry #3</td>
						<td>entry #3</td>
					</tr>
					{ logs.map(log => <LogItem key={log._id} log={log} deleteItem={deleteItem} />) }
				</tbody>
			</Table>
		</Container>
	);
}

export default App;
