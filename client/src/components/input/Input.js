import React from 'react';
import './input.css';

const Input = ({ message, sendMessage, setMessage }) => (
  <form className='form'>
    <input
      type='text'
      placeholder='Type a message...'
      className='input'
      value={message}
      onChange={e => setMessage(e.target.value)}
      onKeyPress={e => (e.key === 'Enter' ? sendMessage(e) : null)}
    />
    <button className='sendButton' onClick={e => sendMessage(e)}>
      Send
    </button>
  </form>
);
export default Input;
