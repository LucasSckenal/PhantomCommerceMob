// MUDANÇA: "use client" removido
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
// MUDANÇA: Importando useIonRouter
import { useIonRouter } from '@ionic/react';
import { db } from '../lib/firebase';
import { collection, query, getDocs } from "firebase/firestore";

const SearchContext = createContext<any>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  // MUDANÇA: Usando useIonRouter
  const ionRouter = useIonRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [allGames, setAllGames] = useState<any[]>([]);

  // Busca todos os jogos (sem mudanças)
  useEffect(() => {
    const fetchAllGames = async () => {
      setIsSearching(true);
      try {
        const gamesRef = collection(db, 'games');
        const q = query(gamesRef);
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            originalPrice: doc.data().oldPrice || doc.data().price,
            discountedPrice: doc.data().price,
            tags: doc.data().categories || [],
        }));
        setAllGames(results);
      } catch (error) {
        console.error("Erro ao buscar todos os jogos:", error);
      } finally {
        setIsSearching(false);
      }
    };
    fetchAllGames();
  }, []);

  const categories = ['aventura', 'acao', 'rpg', 'estrategia', 'esportes', 'corrida'];
  
  const handleSearchSubmit = (queryText: string) => {
    if (!queryText) return;
    const queryLowerCase = queryText.toLowerCase();
    
    // MUDANÇA: Usando ionRouter para navegar
    if (!isNaN(parseFloat(queryText))) { // Checagem de número melhorada
      ionRouter.push(`/product/${queryText}`);
    } else if (categories.includes(queryLowerCase)) {
      ionRouter.push(`/category/${encodeURIComponent(queryLowerCase)}`);
    } else {
      ionRouter.push(`/search?q=${encodeURIComponent(queryText)}`);
    }
    clearSearch();
  };

  // Lógica de busca no dropdown (sem mudanças)
  const handleSearchChange = useCallback((event: any) => {
    const searchText = event.target.value;
    setSearchQuery(searchText);

    if (searchText.length > 0) {
      const filteredResults = allGames.filter(game => 
        game.title.toLowerCase().includes(searchText.toLowerCase())
      ).slice(0, 5); 

      setSearchResults(filteredResults);
      setIsResultsVisible(filteredResults.length > 0);
    } else {
      clearSearch();
    }
  }, [allGames]);

  const hideSearchResults = () => setIsResultsVisible(false);

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsResultsVisible(false);
  };

  const value = {
    searchQuery,
    searchResults,
    isResultsVisible,
    isSearching,
    allGames,
    handleSearchSubmit,
    handleSearchChange,
    hideSearchResults,
    clearSearch
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
