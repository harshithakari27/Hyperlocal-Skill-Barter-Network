import { useState } from 'react';
import api from '../services/api';
import Message from '../components/Message';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await api.post('/auth/signup', { name, email, password });
      setMessage('Signup successful! You can now log in.');
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
      </form>
      <Message type={messageType}>{message}</Message>
    </div>
  );
}

export default Signup;