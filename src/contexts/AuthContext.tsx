import { jwtDecode } from 'jwt-decode'; // Ensure this is correctly imported
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface DecodedToken {
  aud: string;
  exp: number;
  iss: string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
}

interface AuthContextProps {
  token: string | null;
  username: string | null;
  email: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  const decodeToken = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
    setUsername(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
    setEmail(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]);
    setUserId(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]);
  };

  const login = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);
    decodeToken(token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setEmail(null);
    setUserId(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (token) {
      decodeToken(token);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        email,
        userId,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
