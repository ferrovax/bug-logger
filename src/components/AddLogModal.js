import React, { useState } from 'react';
import { Modal, Toast, Form, Button } from 'react-bootstrap';
import { ipcRenderer } from 'electron';

const AddLogModal = () => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('minor');
  const [ticketType, setTicketType] = useState('bug');

  const handlePlus = () => {
    ipcRenderer.send('logs:add', { text, priority, tags: [ticketType] });
    handleClose();
  }

  const handleClose = () => {
    setShow(false);
    setText('');
    setPriority('minor');
    setTicketType('bug');
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <Button className='font-weight-bold' size='sm' variant='outline-info' onClick={handleShow}>
        + TICKET
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label> </Form.Label>
              <Form.Control placeholder='Description' value={text} onChange={e => setText(e.target.value)} />
              <Form.Text className='text-muted'>Enter ticket details</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Control as='select' value={priority} onChange={e => setPriority(e.target.value)}>
                <option value='minor'>minor</option>
                <option value='moderate'>moderate</option>
                <option value='major'>major</option>
              </Form.Control>
              <Form.Text className='text-muted'>Select ticket priority</Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Control as='select' value={ticketType} onChange={e => setTicketType(e.target.value)}>
                <option value='bug'>bug</option>
                <option value='feature'>feature</option>
                </Form.Control>
                <Form.Text className='text-muted'>Bug or feature?</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='outline-info' onClick={handlePlus} size='lg' block>
            +
          </Button>
          <Button variant='outline-secondary' onClick={handleClose} block>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddLogModal;
