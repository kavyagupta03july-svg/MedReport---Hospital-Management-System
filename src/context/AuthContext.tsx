import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { auth, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  deleteUser as firebaseDeleteUser,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (role: Role, name: string, email: string, password: string, adminCode?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUser({ id: firebaseUser.uid, ...docSnap.data() } as User);
          } else {
            setUser(null);
          }
        } catch (e) {
          console.error("Error fetching user data:", e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (role: Role, name: string, email: string, password: string, adminCode?: string) => {
    try {
      if (role === 'admin' && adminCode?.trim() !== '778675') {
        return { success: false, error: 'Invalid Admin Security Code. You must enter code 778675 to create an Administrator account.' };
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const newUser: Omit<User, 'id'> = {
        name,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&backgroundColor=b6e3f4`
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser({ id: firebaseUser.uid, ...newUser });
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send reset email' };
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      if (!auth.currentUser) return { success: false, error: 'Not logged in' };
      // Verify password by re-authenticating
      await signInWithEmailAndPassword(auth, auth.currentUser.email!, password);
      
      const uid = auth.currentUser.uid;
      
      // Delete user data from firestore
      await deleteDoc(doc(db, 'users', uid));
      
      // Delete user auth
      await firebaseDeleteUser(auth.currentUser);
      setUser(null);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Deletion failed. Check password.' };
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    try {
      let finalUpdates = { ...updates };
      
      await updateDoc(doc(db, 'users', user.id), finalUpdates);
      setUser(prev => prev ? { ...prev, ...finalUpdates } : null);
    } catch (e) {
      console.error("Error updating profile", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, deleteAccount, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

