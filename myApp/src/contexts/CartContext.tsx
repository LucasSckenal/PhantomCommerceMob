// MUDANÇA: "use client" removido
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  doc, 
  getDoc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

// MUDANÇA (OPCIONAL): Importando o Capacitor Preferences
// Isso substitui o localStorage para um app nativo
// Para instalar: npm install @capacitor/preferences
import { Preferences } from '@capacitor/preferences';

const CartContext = createContext<any>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  const getCartRef = () => {
    if (!currentUser) return null;
    return doc(db, 'users', currentUser.uid, 'private', 'cart');
  };

  // Carregar carrinho
  useEffect(() => {
    const loadCart = async () => {
      if (currentUser) {
        const cartRef = getCartRef();
        if (!cartRef) return;

        const unsubscribe = onSnapshot(cartRef, (docSnap) => {
          if (docSnap.exists()) {
            setCartItems(docSnap.data().items || []);
          } else {
            setDoc(cartRef, { items: [], createdAt: new Date(), updatedAt: new Date() });
            setCartItems([]);
          }
          setIsLoading(false);
        }, (error) => {
          console.error('Erro ao carregar carrinho:', error);
          setIsLoading(false);
        });

        return () => unsubscribe();
      } else {
        // MUDANÇA (OPCIONAL): Lendo do Capacitor Preferences
        const { value } = await Preferences.get({ key: 'guestCart' });
        if (value) {
          setCartItems(JSON.parse(value));
        } else {
          setCartItems([]);
        }
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, [currentUser]);

  // Salvar carrinho no Preferences para usuários não logados
  useEffect(() => {
    if (!currentUser) {
      // MUDANÇA (OPCIONAL): Salvando no Capacitor Preferences
      Preferences.set({
        key: 'guestCart',
        value: JSON.stringify(cartItems)
      });
    }
  }, [cartItems, currentUser]);

  // Sincronizar com Firestore (sem mudanças)
  const syncCartWithFirestore = async (newItems: any[]) => {
    if (!currentUser) return;
    try {
      const cartRef = getCartRef();
      if (!cartRef) return;
      await setDoc(cartRef, { 
        items: newItems,
        updatedAt: new Date(),
        itemCount: newItems.reduce((total, item) => total + (item.quantity || 1), 0),
        totalValue: newItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
      }, { merge: true });
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error);
    }
  };

  // Funções addToCart, removeFromCart, updateQuantity (sem mudanças)
  const addToCart = async (product: any) => {
    const newItems = [...cartItems];
    const existingItemIndex = newItems.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: (newItems[existingItemIndex].quantity || 1) + 1,
        updatedAt: new Date()
      };
    } else {
      newItems.push({ ...product, quantity: 1, addedAt: new Date(), updatedAt: new Date() });
    }
    setCartItems(newItems);
    if (currentUser) {
      await syncCartWithFirestore(newItems);
    }
  };

  const removeFromCart = async (itemId: string) => {
    const newItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(newItems);
    if (currentUser) {
      await syncCartWithFirestore(newItems);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
      return;
    }
    const newItems = cartItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, updatedAt: new Date() }
        : item
    );
    setCartItems(newItems);
    if (currentUser) {
      await syncCartWithFirestore(newItems);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (currentUser) {
      await syncCartWithFirestore([]);
    } else {
      // MUDANÇA (OPCIONAL): Removendo do Capacitor Preferences
      await Preferences.remove({ key: 'guestCart' });
    }
  };

  // Migrar carrinho
  const migrateGuestCartToUser = async () => {
    if (!currentUser) return;

    // MUDANÇA (OPCIONAL): Lendo do Capacitor Preferences
    const { value } = await Preferences.get({ key: 'guestCart' });
    if (value) {
      const guestItems = JSON.parse(value);
      if (guestItems.length > 0) {
        try {
          const cartRef = getCartRef();
          const cartSnap = await getDoc(cartRef);
          let currentFirestoreItems = [];
          
          if (cartSnap.exists()) {
            currentFirestoreItems = cartSnap.data().items || [];
          }
          
          // Lógica de merge (sem mudanças)
          const mergedItems = [...currentFirestoreItems];
          guestItems.forEach((guestItem: any) => {
            const existingIndex = mergedItems.findIndex(item => item.id === guestItem.id);
            if (existingIndex > -1) {
              mergedItems[existingIndex] = {
                ...mergedItems[existingIndex],
                quantity: (mergedItems[existingIndex].quantity || 1) + (guestItem.quantity || 1),
                updatedAt: new Date()
              };
            } else {
              mergedItems.push({ ...guestItem, addedAt: new Date(), updatedAt: new Date() });
            }
          });

          setCartItems(mergedItems);
          await syncCartWithFirestore(mergedItems);
          
          // MUDANÇA (OPCIONAL): Removendo do Capacitor Preferences
          await Preferences.remove({ key: 'guestCart' });
          
          console.log('Carrinho migrado com sucesso para a conta do usuário');
        } catch (error) {
          console.error('Erro ao migrar carrinho:', error);
        }
      }
    }
  };

  // useEffect para migração (sem mudanças)
  useEffect(() => {
    if (currentUser) {
      migrateGuestCartToUser();
    }
  }, [currentUser]);

  // Funções restantes (handleCartClick, closeCart, getCartTotal, etc.) (sem mudanças)
  const handleCartClick = () => setIsCartOpen(prev => !prev);
  const closeCart = () => setIsCartOpen(false);
  const getCartTotal = () => cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  const getCartItemsCount = () => cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  const saveCart = async () => { if (currentUser) { await syncCartWithFirestore(cartItems); } };
  
  const value = {
    isCartOpen,
    cartItems,
    isLoading,
    handleCartClick,
    closeCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    getCartTotal,
    getCartItemsCount,
    saveCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
