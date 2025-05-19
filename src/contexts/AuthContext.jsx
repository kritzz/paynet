import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../firebase";

// Create context
const AuthContext = createContext();

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updateUserProfile(user, data) {
    return updateProfile(user, data);
  }

  function updateUserPassword(user, newPassword) {
    return updatePassword(user, newPassword);
  }

  function reauthenticateUser(user, credential) {
    return reauthenticateWithCredential(user, credential);
  }

  // Add Google authentication
  function googleLogin() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  // Set up auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    updatePassword: updateUserPassword,
    reauthenticateWithCredential: reauthenticateUser,
    EmailAuthProvider,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
