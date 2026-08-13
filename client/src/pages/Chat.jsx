import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';

function Chat() {
  const { matchId } = useParams();
  const { userId, name } = useAuth();
  const socketRef = useSocket();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/messages/${matchId}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchHistory();
  }, [matchId]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.emit('join-room', matchId);

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [matchId, socketRef]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    socketRef.current.emit('send-message', {
      matchId,
      senderId: userId,
      senderName: name,
      text
    });
    setText('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div className="card" style={{ height: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              alignSelf: msg.senderId === userId ? 'flex-end' : 'flex-start',
              backgroundColor: msg.senderId === userId ? 'var(--navy)' : 'var(--surface-hover)',
              padding: '8px 12px',
              borderRadius: '8px',
              maxWidth: '70%'
            }}
          >
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{msg.senderName}</p>
            <p style={{ margin: 0, color: 'var(--text)' }}>{msg.text}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSend} style={{ flexDirection: 'row', gap: '10px', marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginBottom: 0 }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;