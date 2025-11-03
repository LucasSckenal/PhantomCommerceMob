import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
// MUDANÇA: db foi removido, agora usamos a instância do firebase.ts
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";

// --- Tipagem ---
interface PriceRange {
  min: string | number;
  max: string | number;
}

interface InitialFilters {
  sortOrder: string;
  selectedTags: string[];
  selectedPlatforms: string[];
  priceRange: PriceRange;
}

interface StoreContextProps {
  games: any[]; // Defina um tipo melhor se tiver
  loadingGames: boolean;
  allAvailableTags: string[];
  allAvailablePlatforms: string[];
  sortOrder: string;
  setSortOrder: (order: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  filteredAndSortedGames: any[];
  clearFilters: () => void;
}

interface StoreProviderProps {
  children: ReactNode;
  slug?: string; // Slug é opcional no provider global
  initialFilters?: InitialFilters; // Filtros iniciais são opcionais
}

// --- Valores Padrão ---
// MUDANÇA: Definimos valores padrão para o caso de initialFilters não ser passado
const DEFAULT_FILTERS: InitialFilters = {
  sortOrder: 'rating',
  selectedTags: [],
  selectedPlatforms: [],
  priceRange: { min: '', max: '' }
};

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export function StoreProvider({ 
  children, 
  slug = 'all', // MUDANÇA: Valor padrão para slug
  initialFilters = DEFAULT_FILTERS // MUDANÇA: Valor padrão para filtros
}: StoreProviderProps) {
  
    const [games, setGames] = useState<any[]>([]);
    const [loadingGames, setLoadingGames] = useState(true);
    const [allAvailableTags, setAllAvailableTags] = useState<string[]>([]);
    const [allAvailablePlatforms, setAllAvailablePlatforms] = useState<string[]>([]);

    // MUDANÇA: Usamos os valores de initialFilters (ou o padrão)
    const [sortOrder, setSortOrder] = useState(initialFilters.sortOrder);
    const [selectedTags, setSelectedTags] = useState(initialFilters.selectedTags);
    const [selectedPlatforms, setSelectedPlatforms] = useState(initialFilters.selectedPlatforms);
    const [priceRange, setPriceRange] = useState(initialFilters.priceRange);

    const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

    // Efeito para buscar os jogos (semelhante ao original)
    useEffect(() => {
      const fetchGames = async () => {
        setLoadingGames(true);
        try {
          const gamesCollectionRef = collection(db, "games");
          let gamesQuery: any = gamesCollectionRef;

          const isAllCategory = slug.toLowerCase() === "all";
          const baseTagFromSlug = isAllCategory
            ? ""
            : capitalize(decodeURIComponent(slug));

          if (baseTagFromSlug) {
            gamesQuery = query(
              gamesQuery,
              where("categories", "array-contains", baseTagFromSlug)
            );
          }

          const minPriceVal = parseFloat(String(priceRange.min));
          if (!isNaN(minPriceVal) && minPriceVal > 0) {
            gamesQuery = query(gamesQuery, where("price", ">=", minPriceVal));
          }

          const maxPriceVal = parseFloat(String(priceRange.max));
          if (!isNaN(maxPriceVal) && maxPriceVal > 0) {
            gamesQuery = query(gamesQuery, where("price", "<=", maxPriceVal));
          }

          const querySnapshot = await getDocs(gamesQuery);
          const fetchedGames = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            originalPrice: doc.data().oldPrice || doc.data().price,
            discountedPrice: doc.data().price,
            tags: doc.data().categories || [],
            platforms:
              doc.data().platforms?.map((p: string) => p.toLowerCase()) || [],
            gallery: doc.data().galleryImageUrls || [],
          }));

          setGames(fetchedGames);
        } catch (error) {
          console.error("Erro ao buscar jogos do Firestore:", error);
        } finally {
          setLoadingGames(false);
        }
      };

      fetchGames();
    }, [
      slug,
      priceRange.min,
      priceRange.max,
      selectedTags,
      selectedPlatforms,
      sortOrder,
    ]);


    // Efeito para extrair tags e plataformas
    useEffect(() => {
        const uniqueTags = new Set<string>();
        const uniquePlatforms = new Set<string>();
        games.forEach(game => {
            game.tags.forEach((tag: string) => uniqueTags.add(tag));
            game.platforms.forEach((platform: string) => uniquePlatforms.add(platform));
        });
        setAllAvailableTags(Array.from(uniqueTags).sort());
        setAllAvailablePlatforms(Array.from(uniquePlatforms).sort());
    }, [games]);

    // Lógica de filtragem e ordenação (semelhante ao original)
    const filteredAndSortedGames = useMemo(() => {
        let gamesToFilter = [...games];
        const isAllCategory = slug.toLowerCase() === 'all';
        const baseTagLower = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
        
        const effectiveSelectedTags = selectedTags.filter(t => t.toLowerCase() !== baseTagLower);
        
        if (effectiveSelectedTags.length > 0) {
            gamesToFilter = gamesToFilter.filter(game =>
                effectiveSelectedTags.every(st => game.tags.map((t: string) => t.toLowerCase()).includes(st.toLowerCase()))
            );
        }
        if (selectedPlatforms.length > 0) {
            gamesToFilter = gamesToFilter.filter(game =>
                selectedPlatforms.every(sp => game.platforms.includes(sp.toLowerCase()))
            );
        }

        return gamesToFilter.sort((a, b) => {
            switch (sortOrder) {
                case 'price-asc': return a.discountedPrice - b.discountedPrice;
                case 'price-desc': return b.discountedPrice - a.discountedPrice;
                case 'name-asc': return (a.title || '').localeCompare(b.title || '');
                case 'name-desc': return (b.title || '').localeCompare(a.title || '');
                case 'rating': default: return (b.rating || 0) - (a.rating || 0);
            }
        });
    }, [games, selectedTags, selectedPlatforms, sortOrder, slug]);

    // Limpar filtros (semelhante ao original)
    const clearFilters = useCallback(() => {
        const baseTags = slug.toLowerCase() === 'all' ? [] : [decodeURIComponent(slug).toLowerCase()];
        setSelectedTags(baseTags);
        setSelectedPlatforms([]);
        setPriceRange({ min: '', max: '' });
        setSortOrder('rating');
    }, [slug]);

    const value: StoreContextProps = {
        games,
        loadingGames,
        allAvailableTags,
        allAvailablePlatforms,
        sortOrder,
        setSortOrder,
        selectedTags,
        setSelectedTags,
        selectedPlatforms,
        setSelectedPlatforms,
        priceRange,
        setPriceRange,
        filteredAndSortedGames,
        clearFilters,
    };

    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error('useStore deve ser usado dentro de um StoreProvider');
    }
    return context;
}

