import React, { useState } from 'react';
import { Col, Button, Navbar, InputGroup, Form } from 'react-bootstrap';
import AddLogModal from './AddLogModal';
import { ipcRenderer } from 'electron';

const Header = () => {
  const [terms, setTerms] = useState('');
  const [buttontxt, setButtontxt] = useState('Search');

  const handleButton = () => {
    if (buttontxt === 'Search') {
      handleSearch();
    } else {
      handleReset();
    }
  }

  const handleSearch = () => {
    ipcRenderer.send('logs:search', terms);
    setButtontxt('Reset');
  }

  const handleReset = () => {
    ipcRenderer.send('logs:load');
    setTerms('');
    setButtontxt('Search');
  }

  return (
    <Navbar className='justify-content-between'>
      <Col>
        <AddLogModal />
      </Col>
      <Col>
        <InputGroup className='ml-lg-3'>
          <Form.Control
            style={{ backgroundColor: '#343a40', borderColor: '#17a2b8' }}
            type='text'
            size='sm'
            placeholder='Filter tickets...'
            value={terms}
            onChange={e => setTerms(e.target.value)}
          />
          <InputGroup.Append>
            <Button
              className='font-weight-bold'
              variant='outline-info'
              size='sm'
              onClick={handleButton}
            >
              {buttontxt}
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Navbar>
  );
}

export default Header;
