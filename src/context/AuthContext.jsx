import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function (Mocked with LocalStorage)
  const signup = async (email, password, name) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('cb_users') || '[]');
        if (users.find(u => u.email === email)) {
          return reject(new Error('User already exists'));
        }
        
        const newUser = { id: Date.now().toString(), email, name };
        users.push({ ...newUser, password }); // In a real app, NEVER store plaintext passwords
        localStorage.setItem('cb_users', JSON.stringify(users));
        
        localStorage.setItem('cb_currentUser', JSON.stringify(newUser));
        setCurrentUser(newUser);
        resolve(newUser);
      }, 500); // simulate network delay
    });
  };

  // Log in function (Mocked with LocalStorage)
  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('cb_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          localStorage.setItem('cb_currentUser', JSON.stringify(userWithoutPassword));
          setCurrentUser(userWithoutPassword);
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  };

  // Log out function
  const logout = () => {
    localStorage.removeItem('cb_currentUser');
    setCurrentUser(null);
  };

  useEffect(() => {
    // Check if user is already logged in on initial load
    const storedUser = localStorage.getItem('cb_currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
