import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/LocationPicker';

function SkillListing() {
  const { userId } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyCreditRate, setHourlyCreditRate] = useState(1);
  const [message, setMessage] = useState('');
  const [position, setPosition] = useState(null); // [lat, lng]
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition([17.3850, 78.4867]); // fallback default
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setLocationLoading(false);
      },
      () => {
        setPosition([17.3850, 78.4867]);
        setLocationLoading(false);
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      setMessage('Please wait for the map to load.');
      return;
    }
    try {
      const res = await api.post('/skills', {
        userId,
        title,
        category,
        description,
        hourlyCreditRate,
        coordinates: [position[1], position[0]] // backend expects [lng, lat]
      });
      setMessage('Skill posted successfully!');
      console.log(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (!userId) {
    return <p>Please log in first to post a skill.</p>;
  }

  return (
    <div className="form-card">
      <h2>Post a Skill</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Skill title (e.g. Guitar Lessons)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category (e.g. Music)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Credits per hour"
          value={hourlyCreditRate}
          onChange={(e) => setHourlyCreditRate(e.target.value)}
        />

        <p style={{ marginTop: '4px' }}>Click on the map to set the exact location:</p>
        {locationLoading ? (
          <p>Getting your location...</p>
        ) : (
          <div style={{ marginBottom: '14px', borderRadius: '8px', overflow: 'hidden' }}>
            <LocationPicker initialPosition={position} onChange={setPosition} />
          </div>
        )}

        <button type="submit">Post Skill</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SkillListing;