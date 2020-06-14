import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Droppable } from 'react-beautiful-dnd'
import Ticket from './Ticket';

const Kolumn = ({ title, logs, user }) => {
  // Filter for logs that belong in this Kolumn
  const _logs = logs.filter(log => log.category === title);
  const [numCards, setNumCards] = useState('');

  useEffect(() => {
    setNumCards(_logs.length);
  }, [_logs]);

  return (
    <Col>
      <Droppable droppableId={title}>
        {provided => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <Content title={title} filteredLogs={_logs} num={numCards} user={user} />
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Col>
  );
}

const Content = ({ title, filteredLogs, num, user }) => {
  const subtitle = `${num} card${num === 1 ? '' : 's'}`;

  return (
      <Card bg='dark' text='light'>

        <Card.Header>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle className='text-muted'>{subtitle}</Card.Subtitle>
        </Card.Header>

        <Card.Body style={{ maxHeight: 450, overflowY: 'scroll' }}>
          {filteredLogs.map((log, index) => (
            <div key={log._id}>
              <Ticket log={log} index={index} user={user} />
              <br />
            </div>
          ))}
        </Card.Body>

      </Card>
  );
}

export default Kolumn;
