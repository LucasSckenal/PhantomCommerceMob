import React, { useRef, useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { sadOutline, searchOutline } from 'ionicons/icons';
import { useSearch } from '../contexts/SearchContext'; // Ajuste o caminho se necessário
import { useIonRouter } from '@ionic/react';

// --- Estilos CSS-in-JS (traduzido do seu NotFound.module.scss) ---
const style = `
  /* Animação para o ícone */
  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  /* Centraliza o conteúdo da página */
  .not-found-content {
    --background: var(--ion-background-color, #0F1424);
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
  }

  .not-found-card {
    --background: var(--ion-card-background, #1A202C);
    text-align: center;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--ion-border-color, #4A5568);
    border-radius: 16px;
    padding: 20px; /* Adiciona padding interno */
  }

  .illustration {
    margin-bottom: 20px;
    animation: float 3s ease-in-out infinite;
  }

  .illustration ion-icon {
    font-size: 80px; /* Tamanho do ícone */
    color: var(--ion-color-primary, #4D7CFF);
  }

  .title-404 {
    font-size: 5rem;
    font-weight: bold;
    color: var(--ion-text-color, #fff);
    margin: 0;
  }

  .subtitle {
    font-size: 1.75rem;
    color: var(--ion-text-color, #fff);
    margin-top: 10px;
  }

  .description {
    color: var(--ion-color-medium, #718096);
    margin-top: 15px;
    margin-bottom: 30px;
    line-height: 1.6;
  }

  /* Seção de Busca */
  .search-section {
    position: relative;
    width: 100%;
    margin-bottom: 20px;
  }

  .search-bar {
    --background: var(--ion-background-color, #0F1424);
    --border-radius: 8px;
    --box-shadow: none;
    border: 1px solid var(--ion-border-color, #4A5568);
    padding-left: 0; /* Remove padding extra */
    padding-right: 0;
  }
  
  /* Dropdown de Resultados */
  .search-results-container {
    background-color: var(--ion-background-color, #0F1424);
    border: 1px solid var(--ion-border-color, #4A5568);
    border-radius: 8px;
    margin-top: 8px;
    max-height: 320px;
    overflow-y: auto;
    z-index: 50;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    padding: 0.5rem;
    text-align: left;
  }

  .search-results-list {
    padding: 0;
    margin: 0;
    --background: transparent;
    --inner-padding-end: 0;
  }

  .search-result-item {
    --background: transparent;
    --background-hover: var(--ion-color-step-150, rgba(255, 255, 255, 0.05));
    --border-radius: 6px;
    --color: var(--ion-text-color, #fff);
    margin-bottom: 4px;
  }

  .result-image {
    width: 100px;
    height: 56px;
    border-radius: 4px;
    object-fit: cover;
  }
`;

const NotFoundPage: React.FC = () => {
  const {
    searchQuery,
    searchResults,
    isResultsVisible,
    handleSearchSubmit,
    handleSearchChange,
    hideSearchResults,
    clearSearch,
  } = useSearch();

  const router = useIonRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Efeito para fechar os resultados da busca ao clicar fora
  // MUDANÇA: Atualizado para funcionar com componentes Ionic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        hideSearchResults();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [hideSearchResults]);

  // MUDANÇA: onSearchSubmit agora chama o router do Ionic
  const onSearchSubmit = (event?: React.FormEvent) => {
    event?.preventDefault();
    handleSearchSubmit(searchQuery); // Isso já usa o ionRouter (como definimos no SearchContext)
  };

  // MUDANÇA: handleSearchChange agora espera um evento do IonSearchbar
  const onSearchChange = (e: CustomEvent) => {
    // Simulando o evento "target.value" que o handleSearchChange espera
    handleSearchChange({ target: { value: e.detail.value } } as any);
  };

  // MUDANÇA: Navegação ao clicar no resultado
  const onResultClick = (id: string) => {
    router.push(`/product/${id}`);
    clearSearch();
  };

  return (
    <IonPage>
      <style>{style}</style>
      <IonContent className="not-found-content">
        <IonCard className="not-found-card">
          <IonCardHeader>
            <div className="illustration">
              <IonIcon icon={sadOutline} />
            </div>
            <IonCardTitle className="title-404">404</IonCardTitle>
            <IonCardSubtitle className="subtitle">
              Página Não Encontrada
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <p className="description">
              Ops! A página que você procura não existe. Que tal tentar uma busca?
            </p>

            {/* Barra de Busca com resultados dinâmicos */}
            <div className="search-section" ref={searchContainerRef}>
              <form onSubmit={onSearchSubmit}>
                <IonSearchbar
                  className="search-bar"
                  value={searchQuery}
                  onIonChange={onSearchChange}
                  onIonClear={clearSearch}
                  onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                  placeholder="Buscar jogos..."
                  searchIcon={searchOutline}
                  debounce={300}
                />
              </form>

              {/* Dropdown de Resultados */}
              {isResultsVisible && searchResults.length > 0 && (
                <div className="search-results-container">
                  <IonList className="search-results-list">
                    {searchResults.map((game: any) => (
                      <IonItem
                        key={game.id}
                        button
                        onClick={() => onResultClick(game.id)}
                        className="search-result-item"
                        lines="none"
                      >
                        <IonThumbnail slot="start">
                          <img
                            src={game.coverImageUrl || game.headerImageUrl}
                            alt={`Capa do jogo ${game.title}`}
                            className="result-image"
                          />
                        </IonThumbnail>
                        <IonLabel>
                          <h3>{game.title}</h3>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </IonList>
                </div>
              )}
            </div>

            <div className="actions">
              <IonButton
                expand="block"
                routerLink="/"
                routerDirection="root"
              >
                Voltar à Página Inicial
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default NotFoundPage;
