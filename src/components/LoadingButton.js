import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const LoadingButton = ({ variant, text, login  }) => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // THIS IS WRONG
      login().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);


  const handleClick = () => setLoading(true);

  return (
    <Button variant={variant} onClick={isLoading ? null : handleClick} disabled={isLoading} block>
      {isLoading ? <Spinner animation='border' variant='light' /> : text}
    </Button>
  );
}

export default LoadingButton;
