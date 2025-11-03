// MUDANÇA: "use client" removido
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../lib/firebase';

// MUDANÇA: Importando useIonRouter
import { useIonRouter } from '@ionic/react';

// 1. Criar o Contexto
// (Tipagem básica adicionada para TS)
const AuthContext = createContext<any>(undefined);

// 2. Criar o Provedor
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  
  // MUDANÇA: Usando useIonRouter
  const ionRouter = useIonRouter();

  // Função para salvar/atualizar usuário no Firestore (sem mudanças)
  const saveUserToFirestore = async (user: any, additionalData = {}) => {
    // ... (seu código original, sem mudanças)
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnapshot = await getDoc(userRef);

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.name || '',
        photoURL: user.photoURL || additionalData.photoURL || '',
        emailVerified: user.emailVerified,
        createdAt: userSnapshot.exists() 
          ? userSnapshot.data().createdAt 
          : serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        ...additionalData
      };

      await setDoc(userRef, userData, { merge: true });
      return userData;
    } catch (error) {
      console.error('Erro ao salvar usuário no Firestore:', error);
      throw error;
    }
  };

  // Função para fazer upload de avatar (sem mudanças)
  const uploadAvatar = async (file: any, userId: string) => {
    // ... (seu código original, sem mudanças)
    try {
      const storage = getStorage();
      const fileExtension = file.name.split('.').pop();
      const avatarRef = ref(storage, `avatars/${userId}/profile.${fileExtension}`);
      
      const snapshot = await uploadBytes(avatarRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Erro ao fazer upload do avatar:', error);
      throw error;
    }
  };

  // Efeito para ouvir o estado de autenticação (sem mudanças)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // ... (seu código original, sem mudanças)
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };
        setCurrentUser(userData as any);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            await saveUserToFirestore(user);
            setUserProfile(userData);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUserProfile(userData);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Função de Registro (sem mudanças)
  const signup = async (email: string, password: string, userData: any = {}) => {
    // ... (seu código original, sem mudanças)
    // ... (apenas adicionei tipagem básica)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      let photoURL = '';
      if (userData.avatarFile) {
        try {
          photoURL = await uploadAvatar(userData.avatarFile, user.uid);
          delete userData.avatarFile; 
        } catch (avatarError) {
          console.warn('Erro no upload do avatar:', avatarError);
        }
      }
      const profileData = {
        displayName: userData.name || '',
        photoURL: photoURL || userData.photoURL || '',
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
      setCurrentUser(prev => ({
        ...(prev as any),
        ...profileData
      }));
      return userCredential;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  // Função de Login (sem mudanças)
  const login = async (email: string, password: string) => {
    // ... (seu código original, sem mudanças)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateDoc(doc(db, 'users', userCredential.user.uid), {
          lastLoginAt: serverTimestamp()
        });
      }
      return userCredential;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // Função de Login com Google (sem mudanças)
  const loginWithGoogle = async () => {
    // ... (seu código original, sem mudanças)
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      await saveUserToFirestore(user, {
        provider: 'google'
      });
      return userCredential;
    } catch (error) {
      console.error('Erro no login com Google:', error);
      throw error;
    }
  };

  // Função de Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      
      // MUDANÇA: Usando ionRouter para navegar
      // 'root' e 'replace' limpam o histórico de navegação,
      // o que é ideal para um logout.
      ionRouter.push('/auth/login', 'root', 'replace');
      
    } catch (error) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  // Função para atualizar perfil (sem mudanças)
  const updateUserProfile = async (profileData: any) => {
    // ... (seu código original, sem mudanças)
    if (!currentUser) throw new Error('Usuário não autenticado');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Usuário não encontrado no auth');

      let updatedProfileData = { ...profileData };
      if (profileData.avatarFile) {
        try {
          const photoURL = await uploadAvatar(profileData.avatarFile, (currentUser as any).uid);
          updatedProfileData.photoURL = photoURL;
          delete updatedProfileData.avatarFile;
        } catch (avatarError) {
          console.warn('Erro ao atualizar avatar:', avatarError);
          delete updatedProfileData.avatarFile;
        }
      }
      if (updatedProfileData.displayName || updatedProfileData.photoURL) {
        await updateProfile(user, {
          displayName: updatedProfileData.displayName,
          photoURL: updatedProfileData.photoURL
        });
      }
      await updateDoc(doc(db, 'users', (currentUser as any).uid), {
        ...updatedProfileData,
        updatedAt: serverTimestamp()
      });
      const newUserData = {
        ...currentUser,
        displayName: updatedProfileData.displayName || (currentUser as any).displayName,
        photoURL: updatedProfileData.photoURL || (currentUser as any).photoURL,
      };
      setCurrentUser(newUserData as any);
      setUserProfile(prev => ({
        ...prev,
        ...updatedProfileData
      }));
      return newUserData;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  // Função para redefinir senha (sem mudanças)
  const resetPassword = async (email: string) => {
    // ... (seu código original, sem mudanças)
    throw new Error('Funcionalidade ainda não implementada');
  };

  // Função para buscar dados atualizados do usuário (sem mudanças)
  const refreshUserProfile = async () => {
    // ... (seu código original, sem mudanças)
    if (!currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', (currentUser as any).uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
        return userDoc.data();
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
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
    isEmailVerified: (currentUser as any)?.emailVerified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Hook customizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
