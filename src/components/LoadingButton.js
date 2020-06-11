import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { ipcRenderer } from 'electron';

const LoadingButton = ({ variant, text, auth }) => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (isLoading) {
      ipcRenderer.on('login:result', (e, login) => {
        if (mounted) {
          setLoading(false);
        }
      });
    }
    return () => mounted = false;
  }, [isLoading]);

  const handleClick = () => {
    setLoading(true);
    auth();
  };

  return (
    <Button variant={variant} onClick={isLoading ? null : handleClick} disabled={isLoading} block>
      {isLoading ? <Spinner animation='border' variant='light' /> : text}
    </Button>
  );
}

export default LoadingButton;
