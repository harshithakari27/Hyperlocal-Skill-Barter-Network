import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [name, setName] = useState(localStorage.getItem('name'));

  const login = (token, userId, name) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);
    setUserId(userId);
    setName(name);
  };

  const logout = () => {
    localStorage.clear();
    setUserId(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ userId, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}