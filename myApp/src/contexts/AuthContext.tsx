import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../lib/firebase";

interface AuthContextType {
  currentUser: any;
  userProfile: any;
  loading: boolean;
  signup: (email: string, password: string, userData?: any) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (profileData: any) => Promise<any>;
  refreshUserProfile: () => Promise<any>;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);

  const saveUserToFirestore = async (user: any, additionalData = {}) => {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.name || "",
        photoURL: user.photoURL || additionalData.photoURL || "",
        emailVerified: user.emailVerified,
        createdAt: userSnapshot.exists()
          ? userSnapshot.data().createdAt
          : serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        ...additionalData,
      };

      await setDoc(userRef, userData, { merge: true });
      return userData;
    } catch (error) {
      console.error("Erro ao salvar usuário no Firestore:", error);
      throw error;
    }
  };

  const uploadAvatar = async (file: any, userId: string) => {
    try {
      const storage = getStorage();
      const fileExtension = file.name.split(".").pop();
      const avatarRef = ref(
        storage,
        `avatars/${userId}/profile.${fileExtension}`
      );

      const snapshot = await uploadBytes(avatarRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Erro ao fazer upload do avatar:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("AuthStateChanged:", user); // Debug
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };
        setCurrentUser(userData);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            await saveUserToFirestore(user);
            setUserProfile(userData);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setUserProfile(userData);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false); // SEMPRE definir loading como false
    });
    return () => unsubscribe();
  }, []);

  const signup = async (
    email: string,
    password: string,
    userData: any = {}
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      let photoURL = "";
      if (userData.avatarFile) {
        try {
          photoURL = await uploadAvatar(userData.avatarFile, user.uid);
          delete userData.avatarFile;
        } catch (avatarError) {
          console.warn("Erro no upload do avatar:", avatarError);
        }
      }
      const profileData = {
        displayName: userData.name || "",
        photoURL: photoURL || userData.photoURL || "",
      };
      if (profileData.displayName || profileData.photoURL) {
        await updateProfile(user, profileData);
      }
      const firestoreData = {
        ...userData,
        ...profileData,
      };
      delete firestoreData.avatarFile;
      await saveUserToFirestore(user, firestoreData);
      setCurrentUser((prev) => ({
        ...prev,
        ...profileData,
      }));
      return userCredential;
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        await updateDoc(doc(db, "users", userCredential.user.uid), {
          lastLoginAt: serverTimestamp(),
        });
      }
      return userCredential;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await saveUserToFirestore(user, {
        provider: "google",
      });
      return userCredential;
    } catch (error) {
      console.error("Erro no login com Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  };

  const updateUserProfile = async (profileData: any) => {
    if (!currentUser) throw new Error("Usuário não autenticado");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não encontrado no auth");

      let updatedProfileData = { ...profileData };
      if (profileData.avatarFile) {
        try {
          const photoURL = await uploadAvatar(
            profileData.avatarFile,
            currentUser.uid
          );
          updatedProfileData.photoURL = photoURL;
          delete updatedProfileData.avatarFile;
        } catch (avatarError) {
          console.warn("Erro ao atualizar avatar:", avatarError);
          delete updatedProfileData.avatarFile;
        }
      }
      if (updatedProfileData.displayName || updatedProfileData.photoURL) {
        await updateProfile(user, {
          displayName: updatedProfileData.displayName,
          photoURL: updatedProfileData.photoURL,
        });
      }
      await updateDoc(doc(db, "users", currentUser.uid), {
        ...updatedProfileData,
        updatedAt: serverTimestamp(),
      });
      const newUserData = {
        ...currentUser,
        displayName: updatedProfileData.displayName || currentUser.displayName,
        photoURL: updatedProfileData.photoURL || currentUser.photoURL,
      };
      setCurrentUser(newUserData);
      setUserProfile((prev) => ({
        ...prev,
        ...updatedProfileData,
      }));
      return newUserData;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    throw new Error("Funcionalidade ainda não implementada");
  };

  const refreshUserProfile = async () => {
    if (!currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        return userDoc.data();
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil do usuário:", error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    loginWithGoogle,
    resetPassword,
    updateUserProfile,
    refreshUserProfile,
    isAuthenticated: !!currentUser,
    isEmailVerified: currentUser?.emailVerified || false,
  };

  // CORREÇÃO: Sempre renderizar children, mesmo durante loading
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
