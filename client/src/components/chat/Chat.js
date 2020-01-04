import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../infoBar/InfoBar';
import Input from '../input/Input';
import Messages from '../messages/Messages';

import './chat.css';

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

  const sendMessage = e => {
    e.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  };

  return (
    <div className='outerContainer'>
      <div className='container'>
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      {/* All users in the room */}
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
