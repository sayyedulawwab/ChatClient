import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, getRoomDetails, joinRoom } from '../../api/rooms';
import { useAuth } from '../../contexts/AuthContext';

const CreateRoom = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { username } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Step 1: Create the room
      const room = await createRoom(name, password);
      setError(null); // Clear previous errors

      // Step 2: Get room details
      const roomDetails = await getRoomDetails(room.id); // Calls `/api/rooms/{roomId}`
      
      // Step 3: Check if user is already a member
      const isMember = roomDetails.members.some(
        (member: { name: string }) => member.name === username
      );

      // Step 4: Redirect to chat room or join the room
      if (isMember) {
        navigate(`/chat-room/${room.id}`); // Redirect to chat room if already a member
      } else {
        await joinRoom(room.id); // Call joinRoom to add the user to the room
        navigate(`/chat-room/${room.id}`); // Redirect after joining
      }
    } catch (error) {
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