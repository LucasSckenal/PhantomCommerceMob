// MUDANÇA: "use client" removido
import React, { createContext, useContext, useState, useCallback } from 'react';
import { db } from '../lib/firebase'; 
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const ProductContext = createContext<any>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [game, setGame] = useState(null);
    const [relatedGames, setRelatedGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // NENHUMA MUDANÇA DE LÓGICA AQUI
    const getGame = async (id: string) => {
        const gameRef = doc(db, 'games', id);
        const gameSnap = await getDoc(gameRef);

        if (!gameSnap.exists()) {
            throw new Error("Jogo não encontrado");
        }
        const gameData = gameSnap.data();
        return {
            id: gameSnap.id,
            ...gameData,
            originalPrice: gameData.oldPrice || gameData.price,
            discountedPrice: gameData.price,
            tags: gameData.categories || [],
            platforms: gameData.platforms || [],
            gallery: gameData.galleryImageUrls || [],
        };
    };

    // NENHUMA MUDANÇA DE LÓGICA AQUI
    const getRelatedGames = async (gameNames: string[] = []) => {
        if (!gameNames || gameNames.length === 0) return [];
        const gamesRef = collection(db, 'games');
        // Limite de 'in' é 30 no Firestore 10,
        // mas aumentou para 30 em queries mais novas.
        const q = query(gamesRef, where('title', 'in', gameNames.slice(0, 30)));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            originalPrice: doc.data().oldPrice || doc.data().price,
            discountedPrice: doc.data().price,
            tags: doc.data().categories || [],
            platforms: doc.data().platforms || [],
            gallery: doc.data().galleryImageUrls || [],
        }));
    };

    // NENHUMA MUDANÇA DE LÓGICA AQUI
    const fetchProductData = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        setGame(null);
        setRelatedGames([]);
        try {
            const mainGame = await getGame(id);
            setGame(mainGame as any);

            const namesList = (mainGame as any).relatedGameNames || (mainGame as any).relatedGameIds || [];

            if (namesList.length > 0) {
                const related = await getRelatedGames(namesList);
                setRelatedGames(related as any);
            }

        } catch (err: any) {
            console.error("Erro ao buscar dados do produto:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = { game, relatedGames, loading, error, fetchProductData };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProduct() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProduct deve ser usado dentro de um ProductProvider');
    }
    return context;
}
