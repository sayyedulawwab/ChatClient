import React, { useState } from 'react';
import { createRoom } from '../../api/rooms';

const CreateRoom = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const room = await createRoom(name, password);
      setError(null);
      alert(`Room created! Room ID: ${room.id}`);
    } catch (error: any) {
      console.error('Room creation failed:', error);
      setError(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Room</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Room Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password (optional)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Create Room</button>
    </form>
  );
};

export default CreateRoom;