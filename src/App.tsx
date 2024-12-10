import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatRoom from './components/Chat/ChatRoom';
import CreateRoom from './components/Rooms/CreateRoom';
import JoinRoom from './components/Rooms/JoinRoom';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-room" element={<CreateRoom />} />
          <Route path="/join-room" element={<JoinRoom />} />
          <Route path="/chat-room/:roomId" element={<ChatRoom />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
