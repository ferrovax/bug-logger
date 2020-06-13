import React, { useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Droppable } from 'react-beautiful-dnd'
import Ticket from './Ticket';

const Content = ({ title, logs }) => {
  return (
      <Card bg='dark' text='light'>

        <Card.Header>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle>
            {/* # cards in this kolumn */}
          </Card.Subtitle>
        </Card.Header>

        <Card.Body style={{ maxHeight: 600, overflowY: 'scroll' }}>
          {logs.map((log, index) => (
            <div key={log._id}>
              <Ticket log={log} index={index} />
              <br />
            </div>
          ))}
        </Card.Body>

      </Card>
  );
}

const Kolumn = ({ title, logs }) => {
  // Filter for logs that belong in this Kolumn
  const _logs = logs.filter(log => log.category === title);
  const [numCards, setNumCards] = useState(_logs.length);

  return (
    <Col>
      <Droppable droppableId={title}>
        {provided => (
          <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          >
            <Content title={title} logs={_logs} />
            {provided.placeholder}
          </div>
          )}
      </Droppable>

    </Col>
  );
}

export default Kolumn;
