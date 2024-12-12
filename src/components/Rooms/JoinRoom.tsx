import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoomDetails, joinRoom } from '../../api/rooms'; // Assume these functions are in the API utility
import { useAuth } from '../../contexts/AuthContext';

const JoinRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const { username } = useAuth(); // Get the username from AuthContext
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    if (!roomId) return;

    setLoading(true);

    try {
      // Check if the user is already a member of the room
      console.log(username)
      const roomDetails = await getRoomDetails(roomId); // Calls `/api/rooms/{roomId}`
      const isMember = roomDetails.members.some(
        (member: { name: string }) => member.name === username
      );

      if (isMember) {
        // Redirect to chat room if already a member
        navigate(`/chat-room/${roomId}`);
      } else {
        // Call the joinRoom function to add the user to the room
        await joinRoom(roomId); // This should handle joining logic
        navigate(`/chat-room/${roomId}`); // Redirect after joining
      }
    } catch (error) {
      console.error('Error while joining the room:', error);
      alert('Failed to join the room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Join a Room</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleJoinRoom} disabled={loading}>
        {loading ? 'Joining...' : 'Join Room'}
      </button>
    </div>
  );
};

export default JoinRoom;
