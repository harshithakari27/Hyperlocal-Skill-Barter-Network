import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Signup from './pages/Signup';
import Login from './pages/Login';
import SkillListing from './pages/SkillListing';
import Browse from './pages/Browse';
import Matches from './pages/Matches';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';

function Nav() {
  const { name, logout } = useAuth();
  return (
    <nav>
      <div className="nav-brand">SkillBarter</div>
      <div className="nav-links">
        <Link to="/browse">Browse</Link>
        <Link to="/post-skill">Post Skill</Link>
        <Link to="/matches">My Matches</Link>
        <Link to="/dashboard">Dashboard</Link>
        {!name && <Link to="/signup">Sign Up</Link>}
        {!name && <Link to="/login">Login</Link>}
      </div>
      {name && (
        <div className="nav-user">
          <span>Hi, {name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <div className="container">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/post-skill" element={<SkillListing />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat/:matchId" element={<Chat />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;