import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import LoadingButton from './LoadingButton';
import { ipcRenderer } from 'electron';

import Button from 'react-bootstrap/Button';

const Login = () => {
  const [show, setShow] = useState(true);
  const [alert, setAlert] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    ipcRenderer.send('login:try', username, password);
    ipcRenderer.on('login:result', (e, login) => {
      if (login) {
        setShow(false);
      } else {
        setAlert(true);
      }
    });
  }

  return (
    <Modal
      show={show}
      animation={false}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          <strong>Welcome Back</strong>
          <br />
          <h6>Connect to database</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label> </Form.Label>
            <Form.Control
              placeholder='Username'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Control
              type='password'
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Alert show={alert} variant='danger' onClose={() => setAlert(false)} dismissible>
          Connection unsuccessful
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <LoadingButton variant='info' text='Log in' auth={onSubmit} />
      </Modal.Footer>
    </Modal>
  );
}

export default Login;
