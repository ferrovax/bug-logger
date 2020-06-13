import React from 'react';
import Moment from 'react-moment';
import { Button, Badge, Card } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';

const Ticket = ({ log, index }) => {
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
              <Card.Title>{log.user}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                <Moment format='MMMM Do YYYY, h:mm:ss a'>
                  { new Date(log.created) }
                </Moment>
              </Card.Subtitle>
              <Card.Text>
                {log.text}
              </Card.Text>
            </Card.Body>
          </Card>
          </div>
      )}
    </Draggable>
  );
}

export default Ticket;
