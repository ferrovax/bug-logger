import React, { useState } from 'react';
import Moment from 'react-moment';
import { Alert, Button, Badge, Card, ButtonGroup, DropdownButton, Dropdown, Modal, Form } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';
import { ipcRenderer } from 'electron';

const Ticket = ({ log, index, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [text, setText] = useState(log.text);
  const [priority, setPriority] = useState(log.priority);

  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'secondary'
  });

  const setVariant = () => {
    switch (log.priority) {
      case 'major':
        return 'danger';
      case 'moderate':
        return 'warning';
      default:
        return 'info';
    }
  }

  const showAlert = (message, time = 3000) => {
    setAlert({
      show: true,
      message,
      variant: setVariant()
    });

    setTimeout(() => {
      setAlert({
        show: false,
        message: '',
        variant: 'secondary'
      })
    }, time);
  }

  const handleEdit = () => {
    if (user === log.user) {
      setShowModal(true);
    } else {
      showAlert(`Must be signed in as ${log.user}`);
    }
  }

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleDone = () => {
    ipcRenderer.send('logs:edit', { text, priority, id: log._id });
    handleClose();
  }

  const dropdownSelect = (eventKey, event) => {
    switch(eventKey) {
      case '0':
        handleTag(user);
        break;
      case '1':
        handleTag('testing');
        break;
      case '2':
        if (user === log.user) {
          ipcRenderer.send('logs:delete', log._id);
        } else {
          showAlert(`Must be signed in as ${log.user}`);
        }
    }
  }

  const handleTag = tag => {
    if (!log.tags.includes(tag)) {
      ipcRenderer.send('tags:add', tag, log._id);
    } else {
      ipcRenderer.send('tags:delete', tag, log._id);
    }
  }

  return (
    <>
    <Draggable draggableId={log._id} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Card
            border={setVariant()}
            bg='dark'
            text='light'
          >
            <Card.Body>
              <Card.Text>
                {log.text}
                <br />
                {log.tags.map((tag, index) => (
                  <span key={index}><Badge pill variant={setVariant()}>{tag}</Badge>{' '}</span>
                ))}
              </Card.Text>

              <Card.Subtitle className="text-muted">
                <span className='mr-2'>{log.user}</span>

                <Moment format='MM/DD/YYYY, h:mm a'>
                  { new Date(log.created) }
                </Moment>

                <ButtonGroup className='ml-md-5 pull-right'>
                  <Button size='sm' variant={`outline-${setVariant()}`} onClick={handleEdit}>
                    Edit
                  </Button>
                  <DropdownButton
                    variant={`outline-${setVariant()}`}
                    title=''
                    as={ButtonGroup}
                    size='sm'
                  >
                    <Dropdown.Item eventKey='0' onSelect={dropdownSelect}>On it!</Dropdown.Item>
                    <Dropdown.Item eventKey='1' onSelect={dropdownSelect}>Testing</Dropdown.Item>
                    <Dropdown.Item eventKey='2' onSelect={dropdownSelect}>Delete</Dropdown.Item>
                  </DropdownButton>
                </ButtonGroup>
              </Card.Subtitle>
              {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
            </Card.Body>
          </Card>
        </div>
      )}
    </Draggable>
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control as='textarea' rows='3' value={text} onChange={e => setText(e.target.value)}>
            {text}
            </Form.Control>
            <Form.Text></Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Control as='select' value={priority} onChange={e => setPriority(e.target.value)}>
              <option value={priority}>{priority}</option>
              <option value={priority === 'minor' ? 'moderate' : 'minor'}>{priority === 'minor' ? 'moderate' : 'minor'}</option>
              <option value={priority === 'major' ? 'moderate' : 'major'}>{priority === 'major' ? 'moderate' : 'major'}</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='outline-info' onClick={handleDone} block>
          Done
        </Button>
        <Button variant='outline-secondary' onClick={handleClose} block>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

export default Ticket;
