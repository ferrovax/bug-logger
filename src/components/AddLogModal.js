import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Toast from 'react-bootstrap/Toast';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { ipcRenderer } from 'electron';

const AddLogModal = ({ addItem }) => {
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('minor');
  /*
  const onSubmit = () => {

  }
  */
  const handlePlus = () => {
    addItem({ text, priority });
    handleClose();
  }

  const handleClose = () => {
    setShow(false);
    setText('');
    setPriority('minor');
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant='info' onClick={handleShow}>
        Add bug
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
                <option value='low'>minor</option>
                <option value='moderate'>moderate</option>
                <option value='high'>major</option>
                </Form.Control>
                <Form.Text className='text-muted'>Select ticket priority</Form.Text>
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
