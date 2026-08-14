import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Message from '../components/Message';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.userId, res.data.name);
      setMessage(`Welcome back, ${res.data.name}!`);
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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
      <Message type={messageType}>{message}</Message>
    </div>
  );
}

export default Login;