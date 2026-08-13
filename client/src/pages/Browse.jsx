import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import MapView from '../components/MapView';

function Browse() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [usingLocation, setUsingLocation] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { userId } = useAuth();

  const fetchAllSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkills(res.data);
    } catch (err) {
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbySkills = () => {
    if (!navigator.geolocation) {
      fetchAllSkills();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await api.get('/skills/nearby', {
            params: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              radius: 10
            }
          });
          setSkills(res.data);
          setUsingLocation(true);
        } catch (err) {
          setError('Failed to load nearby skills');
        } finally {
          setLoading(false);
        }
      },
      () => {
        fetchAllSkills();
      }
    );
  };

  useEffect(() => {
    fetchNearbySkills();
  }, []);

  const handleRequest = async (skillId) => {
    if (!userId) {
      setMessage('Please log in first to request a skill.');
      return;
    }
    try {
      await api.post('/matches', { skillId, requesterId: userId });
      setMessage('Request sent!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <p>Loading skills...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Browse Skills</h2>
      <p>{usingLocation ? 'Showing skills near you (within 10km)' : 'Showing all skills'}</p>
      {message && <p>{message}</p>}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <MapView skills={skills} selectedId={selectedId} />
      </div>

      {skills.length === 0 && <p>No skills found.</p>}

      {skills.map((skill) => (
        <div
          key={skill._id}
          className="card"
          onClick={() => setSelectedId(skill._id)}
          style={{
            cursor: 'pointer',
            borderColor: selectedId === skill._id ? 'var(--navy-light)' : undefined
          }}
        >
          <h3>{skill.title}</h3>
          <p><strong>Category:</strong> {skill.category}</p>
          <p>{skill.description}</p>
          <p><strong>Rate:</strong> {skill.hourlyCreditRate} credits/hour</p>
          <p><strong>Posted by:</strong> {skill.userId?.name || 'Unknown'}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRequest(skill._id);
            }}
          >
            Request
          </button>
        </div>
      ))}
    </div>
  );
}

export default Browse;