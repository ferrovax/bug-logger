import React from 'react';
import Moment from 'react-moment';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';

const Ticket = ({ log }) => {
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

  return (
    <Card border={setVariant()} style={{ width: '18rem' }} bg='dark' text='light'>
      <Card.Body>
        <Card.Title>{log.user}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted"><Moment format='MMMM Do YYYY, h:mm:ss a'>{ new Date(log.created) }</Moment></Card.Subtitle>
        <Card.Text>
          {log.text}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Ticket;
