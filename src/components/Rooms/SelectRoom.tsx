import { useNavigate } from 'react-router-dom';

const SelectRoom = () => {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    navigate('/create-room'); // Navigate to the create-room page
  };

  const handleJoinRoom = () => {
    navigate('/join-room'); // Navigate to the join-room page
  };

  return (
    <div>
      <h2>Choose an Action</h2>
      <button onClick={handleCreateRoom}>Create a New Room</button>
      <button onClick={handleJoinRoom}>Join an Existing Room</button>
    </div>
  );
};

export default SelectRoom;
