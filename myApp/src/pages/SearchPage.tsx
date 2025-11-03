import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  IonPage,
  IonContent,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonIcon,
} from '@ionic/react';
import { sadOutline } from 'ionicons/icons'; // MUDANÇA: Ícone do Ionic
import { useSearch } from '../contexts/SearchContext'; // Ajuste o caminho se necessário
import Header from '../components/Header'; // MUDANÇA: Nosso novo header
import GameCard from '../components/GameCard'; // TODO: Você precisará criar este componente

// --- Estilos CSS-in-JS (traduzido do seu SearchPage.module.scss) ---
const style = `
  /* Adiciona padding ao conteúdo principal */
  .search-content-padding {
    padding: 2.5rem;
  }

  /* Em telas pequenas, reduz o padding */
  @media (max-width: 768px) {
    .search-content-padding {
      padding: 1.5rem;
    }
  }

  .search-title {
    font-size: 2.5rem;
    color: var(--ion-text-color, #fff);
    margin-bottom: 0.5rem;
  }

  /* Estiliza o termo buscado */
  .search-title span {
    color: var(--ion-color-primary, #4D7CFF);
  }

  .results-count {
    font-size: 1.1rem;
    color: var(--ion-color-medium, #718096);
    margin-bottom: 2.5rem;
  }

  /* Container para "Nenhum resultado" */
  .no-results-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 60vh; /* Ocupa boa parte da tela */
    color: var(--ion-color-medium, #718096);
  }

  .no-results-icon {
    font-size: 64px; /* Tamanho do ícone */
    margin-bottom: 1.5rem;
    color: var(--ion-color-primary, #4D7CFF);
  }
`;

const SearchPage: React.FC = () => {
  // MUDANÇA: Lendo o parâmetro da URL com useLocation
  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search).get('q') || '', [search]);

  // MUDANÇA: Lógica do Contexto (idêntica, mas sem o isSearching por enquanto)
  const { allGames, isSearching } = useSearch();

  // MUDANÇA: Lógica de filtragem (idêntica)
  const searchedGames = useMemo(() => {
    if (!query || allGames.length === 0) {
      return [];
    }
    return allGames.filter((game: any) =>
      game.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allGames]);

  // MUDANÇA: Usando IonLoading
  if (isSearching && allGames.length === 0) {
    return <IonLoading isOpen={true} message="Buscando jogos..." />;
  }

  return (
    <IonPage>
      <style>{style}</style>
      <Header /> {/* MUDANÇA: Nosso novo Header */}
      
      <IonContent fullscreen>
        <div className="search-content-padding">
          {searchedGames.length > 0 ? (
            <>
              <IonText>
                <h1 className="search-title">
                  Resultados para: <span>"{query}"</span>
                </h1>
              </IonText>
              <IonText color="medium">
                <p className="results-count">
                  {searchedGames.length} jogo(s) encontrado(s)
                </p>
              </IonText>
              
              {/* MUDANÇA: Usando IonGrid para o layout responsivo */}
              <IonGrid>
                <IonRow>
                  {searchedGames.map((game: any) => (
                    // 1 coluna em telas pequenas, 3 em médias, 4 em grandes
                    <IonCol key={game.id} size="12" size-md="4" size-xl="3">
                      {/* TODO: Você precisa criar e importar o GameCard.tsx */}
                      {/* <GameCard game={game} /> */}
                      <div>Game Card Placeholder: {game.title}</div>
                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            </>
          ) : (
            // MUDANÇA: Layout de "Nenhum resultado" com componentes Ionic
            <div className="no-results-container">
              <IonIcon icon={sadOutline} className="no-results-icon" />
              <IonText>
                <h1 className="search-title">
                  Nenhum resultado para: <span>"{query}"</span>
                </h1>
              </IonText>
              <IonText color="medium">
                <p>Tente uma busca diferente ou verifique a ortografia.</p>
              </IonText>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SearchPage;
