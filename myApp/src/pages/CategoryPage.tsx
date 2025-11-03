// /src/pages/CategoryPage.tsx
// MUDANÇA: "use client" removido

import React, { useState, useEffect, useMemo, Suspense } from 'react';
// MUDANÇA: Imports do react-router-dom (usado pelo Ionic)
import { useParams, useLocation } from 'react-router-dom';
// MUDANÇA: Imports do Ionic (componentes de UI)
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonModal,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonFooter,
} from '@ionic/react';
// MUDANÇA: Imports de Ícones do Ionic
import { options, close, refresh } from 'ionicons/icons';
import { StoreProvider, useStore } from '../contexts/StoreContext';
// MUDANÇA: Importando o GameCard (caminho de exemplo)
import GameCard from '../components/GameCard'; // Assumindo que você criou este componente

// --- 1. NOVO COMPONENTE: O Modal de Filtros ---
// Todo o seu <aside> foi movido para este componente

interface FilterModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  // Passando todos os estados e handlers do useStore()
  allAvailableTags: string[];
  allAvailablePlatforms: string[];
  sortOrder: string;
  setSortOrder: (value: string) => void;
  selectedTags: string[];
  handleTagChange: (tag: string) => void;
  selectedPlatforms: string[];
  handlePlatformChange: (platform: string) => void;
  priceRange: { min: string; max: string };
  handlePriceChange: (e: any) => void;
  clearFilters: () => void;
  activeFilterCount: number;
  isPristine: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onDismiss,
  allAvailableTags,
  allAvailablePlatforms,
  sortOrder,
  setSortOrder,
  selectedTags,
  handleTagChange,
  selectedPlatforms,
  handlePlatformChange,
  priceRange,
  handlePriceChange,
  clearFilters,
  activeFilterCount,
  isPristine,
}) => {
  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Filtros {activeFilterCount > 0 && `(${activeFilterCount})`}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* MUDANÇA: Seção de Ordenação movida para dentro dos filtros */}
        <IonList>
          <IonListHeader>
            <IonLabel>Ordenar por</IonLabel>
          </IonListHeader>
          <IonItem fill="outline">
            <IonSelect
              value={sortOrder}
              onIonChange={(e) => setSortOrder(e.detail.value)}
              placeholder="Selecionar"
              interface="action-sheet"
            >
              <IonSelectOption value="rating">Melhor Avaliação</IonSelectOption>
              <IonSelectOption value="price-asc">Preço: Menor para Maior</IonSelectOption>
              <IonSelectOption value="price-desc">Preço: Maior para Menor</IonSelectOption>
              <IonSelectOption value="name-asc">Nome: A-Z</IonSelectOption>
              <IonSelectOption value="name-desc">Nome: Z-A</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Gêneros</IonLabel>
          </IonListHeader>
          {allAvailableTags.map((tag) => (
            <IonItem key={tag}>
              <IonCheckbox
                slot="start"
                checked={selectedTags.includes(tag.toLowerCase())}
                onIonChange={() => handleTagChange(tag)}
              />
              <IonLabel>{tag}</IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Plataformas</IonLabel>
          </IonListHeader>
          {allAvailablePlatforms.map((platform) => (
            <IonItem key={platform}>
              <IonCheckbox
                slot="start"
                checked={selectedPlatforms.includes(platform.toLowerCase())}
                onIonChange={() => handlePlatformChange(platform)}
              />
              <IonLabel>{capitalize(platform)}</IonLabel>
            </IonItem>
          ))}
        </IonList>

        <IonList>
          <IonListHeader>
            <IonLabel>Faixa de Preço</IonLabel>
          </IonListHeader>
          <IonItem fill="outline" className="ion-margin-bottom">
            <IonInput
              type="number"
              name="min"
              placeholder="Mín"
              value={priceRange.min}
              onIonChange={handlePriceChange}
            />
          </IonItem>
          <IonItem fill="outline">
            <IonInput
              type="number"
              name="max"
              placeholder="Máx"
              value={priceRange.max}
              onIonChange={handlePriceChange}
            />
          </IonItem>
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  fill="outline"
                  expand="block"
                  onClick={clearFilters}
                  disabled={isPristine}
                >
                  <IonIcon icon={refresh} slot="start" />
                  Limpar
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton fill="solid" expand="block" onClick={onDismiss}>
                  Aplicar
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

// --- 2. COMPONENTE DA UI (Quase idêntico ao seu) ---
function CategoryUI() {
  // MUDANÇA: useParams do react-router-dom
  const params = useParams<{ slug: string }>();
  const slug = params.slug || 'all';

  const {
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
  } = useStore();

  const [isMounted, setIsMounted] = useState(false);
  // MUDANÇA: Estado para controlar o modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // MUDANÇA: O useEffect que atualizava a URL (router.push) foi REMOVIDO.
    // Não é um padrão comum em apps mobile e a lógica de estado do
    // StoreContext já cuida de re-filtrar os dados.
  }, []);

  const capitalize = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

  // Lógica de título (sem mudanças)
  const dynamicPageTitle = useMemo(() => {
    // ... (sua lógica original, sem mudanças)
    const isAllCategory = slug.toLowerCase() === 'all';
    const baseTagLower = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
    const tagsToDisplay = selectedTags.filter(t => t !== baseTagLower).map(capitalize);
    const platformsToDisplay = selectedPlatforms.map(capitalize);
    if (tagsToDisplay.length === 0 && platformsToDisplay.length === 0 && !baseTagLower) return 'Todos os Jogos';
    let title = "Jogos";
    if (baseTagLower) title += ` de ${capitalize(baseTagLower)}`;
    if (tagsToDisplay.length > 0) title += `${baseTagLower ? ' e' : ' de'} ${tagsToDisplay.join(', ')}`;
    if (platformsToDisplay.length > 0) title += ` para ${platformsToDisplay.join(', ')}`;
    return title;
  }, [selectedTags, selectedPlatforms, slug]);

  // Lógica de contagem de filtros (sem mudanças)
  const { activeFilterCount, isPristine } = useMemo(() => {
    // ... (sua lógica original, sem mudanças)
    const isAllCategory = slug.toLowerCase() === 'all';
    const baseTag = isAllCategory ? '' : decodeURIComponent(slug).toLowerCase();
    const additionalTags = selectedTags.filter(t => t !== baseTag);
    let count = additionalTags.length + selectedPlatforms.length;
    if (priceRange.min) count++;
    if (priceRange.max) count++;
    if (sortOrder !== 'rating') count++;
    return { activeFilterCount: count, isPristine: count === 0 };
  }, [selectedTags, selectedPlatforms, priceRange, sortOrder, slug]);

  // Handlers (sem mudanças na lógica interna)
  const handleTagChange = (tag: string) => {
    const lowerCaseTag = tag.toLowerCase();
    setSelectedTags((prev: string[]) =>
      prev.includes(lowerCaseTag) ? prev.filter(t => t !== lowerCaseTag) : [...prev, lowerCaseTag]
    );
  };
  const handlePlatformChange = (platform: string) => {
    const lowerCasePlatform = platform.toLowerCase();
    setSelectedPlatforms((prev: string[]) =>
      prev.includes(lowerCasePlatform) ? prev.filter(p => p !== lowerCasePlatform) : [...prev, lowerCasePlatform]
    );
  };
  // MUDANÇA: Adaptado para onIonChange
  const handlePriceChange = (e: any) => {
    const { name, value } = e.target;
    setPriceRange((prev: any) => ({ ...prev, [name]: value }));
  };

  if (loadingGames && !isMounted) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IonSpinner name="crescent" />
            <IonText className="ion-margin-start">Carregando jogos...</IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      {/* MUDANÇA: Cabeçalho do Ionic com botão de Filtro */}
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{dynamicPageTitle}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setIsFilterModalOpen(true)}>
              <IonIcon icon={options} slot="icon-only" />
              {activeFilterCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'var(--ion-color-danger)',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '12px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      {/* MUDANÇA: Layout principal agora é o <IonContent> */}
      <IonContent fullscreen>
        <header style={{ padding: '16px', borderBottom: '1px solid var(--ion-color-step-150)' }}>
          <IonText color="medium">
            <p style={{ margin: 0 }}>
              Mostrando {filteredAndSortedGames.length} resultados
            </p>
          </IonText>
        </header>

        {/* MUDANÇA: Grid de jogos com <IonGrid> */}
        <IonGrid>
          <IonRow>
            {loadingGames ? (
              <IonCol size="12" className="ion-text-center ion-padding">
                <IonSpinner name="crescent" />
                <IonText><p>Atualizando...</p></IonText>
              </IonCol>
            ) : filteredAndSortedGames.length === 0 ? (
              <IonCol size="12" className="ion-text-center ion-padding">
                <IonText><p>Nenhum jogo encontrado com os filtros selecionados.</p></IonText>
              </IonCol>
            ) : (
              filteredAndSortedGames.map((game: any) => (
                // MUDANÇA: Colunas responsivas do Ionic
                <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={game.id}>
                  {/* 2. RENDERIZA O COMPONENTE GameCard */}
                  <GameCard game={game} />
                </IonCol>
              ))
            )}
          </IonRow>
        </IonGrid>

        {/* MUDANÇA: Renderiza o Modal de Filtros */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onDismiss={() => setIsFilterModalOpen(false)}
          allAvailableTags={allAvailableTags}
          allAvailablePlatforms={allAvailablePlatforms}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          selectedTags={selectedTags}
          handleTagChange={handleTagChange}
          selectedPlatforms={selectedPlatforms}
          handlePlatformChange={handlePlatformChange}
          priceRange={priceRange}
          handlePriceChange={handlePriceChange}
          clearFilters={clearFilters}
          activeFilterCount={activeFilterCount}
          isPristine={isPristine}
        />
      </IonContent>
    </IonPage>
  );
}

// --- 3. COMPONENTE PRINCIPAL (Wrapper de Contexto) ---
// (Lógica quase idêntica à sua)
export default function CategoryPage() {
  // MUDANÇA: useParams e useLocation do react-router-dom
  const params = useParams<{ slug: string }>();
  const location = useLocation();
  const slug = params.slug || 'all';

  // Lógica para ler os filtros iniciais da URL (sem mudanças)
  const initialFilters = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const sort = searchParams.get('sort') || 'rating';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const platforms = searchParams.get('platforms')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const isAllCategory = slug.toLowerCase() === 'all';
    const baseTags = isAllCategory ? [] : [decodeURIComponent(slug).toLowerCase()];
    return {
      sortOrder: sort,
      selectedTags: [...new Set([...baseTags, ...tags])],
      selectedPlatforms: platforms,
      priceRange: { min: minPrice, max: maxPrice }
    };
  }, [slug, location.search]);

  // MUDANÇA: Suspense do React em vez do next/navigation
  return (
    <Suspense fallback={
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <IonSpinner name="crescent" />
            <IonText className="ion-margin-start">Carregando página...</IonText>
          </div>
        </IonContent>
      </IonPage>
    }>
      <StoreProvider slug={slug} initialFilters={initialFilters}>
        <CategoryUI />
      </StoreProvider>
    </Suspense>
  );
}
