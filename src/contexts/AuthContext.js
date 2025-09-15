import React, { createContext, useContext, useState, useEffect } from 'react';
// --- ADD THESE IMPORTS ---
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  setPersistence, 
  browserSessionPersistence 
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email, pass) => {
    // This function will set the temporary session before logging in
    return setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, pass);
      });
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};