"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth, db } from "@/libs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Tipo para el usuario completo (Firebase + Firestore)
interface UserData {
  uid: string;
  email: string | null;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  career?: string;
  totalPoints?: number;
  avatarUrl?: string;
  role?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Usuario autenticado - obtener datos de Firestore
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            } as UserData);
          } else {
            setUserData({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
            });
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });
        }
      } else {
        // No hay usuario autenticado
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    // Limpiar localStorage si lo usabas
    localStorage.removeItem('user');
  };

  const value = {
    user,
    userData,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}