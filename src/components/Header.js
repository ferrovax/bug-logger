import React from 'react';
import { Col, Button, Navbar, InputGroup, Form } from 'react-bootstrap';
import AddLogModal from './AddLogModal';

const Header = ({ addItem }) => {
  return (
    <Navbar className='justify-content-between'>
      <Col>
        <AddLogModal addItem={addItem} />
      </Col>
      <Col>
        <InputGroup className='ml-lg-3'>
          <Form.Control
            style={{ backgroundColor: '#343a40', borderColor: '#17a2b8' }}
            type='text'
            size='sm'
            placeholder='Filter tickets...'
          />
          <InputGroup.Append>
            <Button
              className='font-weight-bold'
              variant='outline-info'
              size='sm'
            >
              Search
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Col>
    </Navbar>
  );
}

export default Header;
