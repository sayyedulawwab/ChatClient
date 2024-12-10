import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinRoom } from '../../api/rooms';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await joinRoom(roomId);
      setError(null);
      alert('Successfully joined the room!');
      navigate(`/chat-room/${roomId}`);
    } catch (error: any) {
      console.error('Joining room failed:', error);
      if (error.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        navigate('/login'); // Redirect to login
      } else {
        setError(error.response?.data?.message || 'Something went wrong');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Join Room</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        required
      />
      <button type="submit">Join Room</button>
    </form>
  );
};

export default JoinRoom;