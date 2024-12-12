import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { logout, isAuthenticated } = useAuth(); // Safely use the Auth context here

  return (
    <nav>
      {!isAuthenticated ? (
        <>
          <a href="/login">Login</a> | <a href="/register">Register</a>
        </>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  );
};

export default Navigation;
