import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const endPoint = 'http://localhost:5000';

  // updating state on life cycle
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(endPoint);

    setRoom(room);
    setName(name);

    socket.emit('join', { name, room }, () => {});

    return () => {
      socket.emit('disconnect');

      socket.off();
    };
  }, [endPoint, location.search]);

  //   updating message on join
  useEffect(() => {
    socket.on('message', message => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  return (
    <div className='outerContainer'>
      <div className='container'>
        <input
          type='text'
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyPress={e => e.key === 'Enter'? sendMessage()}
        />
      </div>
    </div>
  );
};

export default Chat;
