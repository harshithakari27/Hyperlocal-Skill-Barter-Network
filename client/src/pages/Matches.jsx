import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Matches() {
  const { userId } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const res = await api.get(`/matches/user/${userId}`);
      setMatches(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchMatches();
  }, [userId]);

  const handleUpdateStatus = async (matchId, status) => {
    try {
      await api.patch(`/matches/${matchId}`, { status });
      fetchMatches();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = async (matchId) => {
    try {
      await api.patch(`/matches/${matchId}/complete`);
      fetchMatches();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (!userId) return <p>Please log in to see your matches.</p>;
  if (loading) return <p>Loading matches...</p>;

  return (
    <div>
      <h2>My Matches</h2>
      {matches.length === 0 && <p>No matches yet.</p>}
      {matches.map((match) => {
        const isOfferer = match.offererId._id === userId;
        return (
          <div key={match._id} className="card">
            <p><strong>Skill:</strong> {match.skillId?.title}</p>
            <p><strong>Requester:</strong> {match.requesterId?.name}</p>
            <p><strong>Offerer:</strong> {match.offererId?.name}</p>
            <p><strong>Status:</strong> {match.status}</p>

            {isOfferer && match.status === 'pending' && (
              <>
                <button onClick={() => handleUpdateStatus(match._id, 'accepted')}>Accept</button>{' '}
                <button onClick={() => handleUpdateStatus(match._id, 'rejected')}>Reject</button>
              </>
            )}

            {match.status === 'accepted' && (
              <>
                <Link to={`/chat/${match._id}`}><button type="button">Open Chat</button></Link>{' '}
                <button onClick={() => handleComplete(match._id)}>Mark Complete</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Matches;