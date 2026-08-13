import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { userId } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/dashboard/${userId}`);
        setStats(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchStats();
  }, [userId]);

  if (!userId) return <p>Please log in to see your dashboard.</p>;
  if (loading) return <p>Loading dashboard...</p>;
  if (!stats) return <p>Failed to load dashboard.</p>;

  const matchData = Object.entries(stats.matchesByStatus).map(([status, count]) => ({
    status,
    count
  }));

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <h3>{stats.skillsPosted}</h3>
          <p>Skills Posted</p>
        </div>
        <div className="card" style={{ flex: 1, textAlign: 'center' }}>
          <h3>{stats.creditBalance}</h3>
          <p>Credit Balance</p>
        </div>
      </div>

      <div className="card">
        <h3>Skills by Category</h3>
        {stats.skillsByCategory.length === 0 ? (
          <p>No skills posted yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.skillsByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
              <XAxis dataKey="category" stroke="#9a9aa8" />
              <YAxis allowDecimals={false} stroke="#9a9aa8" />
              <Tooltip contentStyle={{ backgroundColor: '#16161d', border: '1px solid #2a2a35' }} />
              <Bar dataKey="count" fill="#24446b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <h3>Matches by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={matchData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
            <XAxis dataKey="status" stroke="#9a9aa8" />
            <YAxis allowDecimals={false} stroke="#9a9aa8" />
            <Tooltip contentStyle={{ backgroundColor: '#16161d', border: '1px solid #2a2a35' }} />
            <Bar dataKey="count" fill="#7a1f2b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Dashboard;