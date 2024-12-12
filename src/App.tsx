import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatRoom from './components/Chat/ChatRoom';
import Navigation from './components/Navigation'; // New navigation component
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import CreateRoom from './components/Rooms/CreateRoom';
import JoinRoom from './components/Rooms/JoinRoom';
import SelectRoom from './components/Rooms/SelectRoom';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Navigation Bar with Login, Register, and Logout Buttons */}
        <Navigation />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/select-room"
            element={
              <ProtectedRoute>
                <SelectRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-room"
            element={
              <ProtectedRoute>
                <CreateRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/join-room"
            element={
              <ProtectedRoute>
                <JoinRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat-room/:roomId"
            element={
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
