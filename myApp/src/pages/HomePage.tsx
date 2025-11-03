import React, { useMemo } from 'react';
import {
  IonPage,
  IonContent,
  IonLoading,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
} from '@ionic/react';
import { useStore } from '../contexts/StoreContext';
import Header from '../components/Header'; // O cabeçalho que acabamos de criar
import HeroSection from '../components/HomeHeroSlider'; // O carrossel que criamos
import SectionHeader from '../components/SectionHeader'; // O título de seção
import HorizontalGameScroll from '../components/HorizontalGameScroll'; // O scroll horizontal
// import GameCard from '../components/GameCard'; // TODO: Você precisará criar este
// import BestSellersGrid from '../components/BestSellersGrid'; // TODO: Você precisará criar este

// Estilos específicos para esta página
const style = `
  .home-page-content {
    --padding-top: 1.5rem;
    --padding-bottom: 1.5rem;
    --padding-start: 1rem;
    --padding-end: 1rem;
  }

  @media (min-width: 768px) {
    .home-page-content {
      --padding-start: 3rem;
      --padding-end: 3rem;
    }
  }

  .section {
    margin-bottom: 3rem; /* Reduzido de 5rem para mobile */
  }

  /* TODO: Mover para um arquivo .css global se usado em mais lugares */
  .genres-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }

  .genre-button {
    --background: var(--ion-card-background, #1A202C);
    --border-color: var(--ion-border-color, #4A5568);
    --border-style: solid;
    --border-width: 1px;
    --color: var(--ion-text-color, #fff);
    --border-radius: 16px;
    --padding-top: 1.5rem;
    --padding-bottom: 1.5rem;
    height: 120px; /* Altura fixa */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    text-transform: none;
    transition: all 0.3s ease;
  }

  .genre-button:hover {
    --background: var(--ion-color-step-200, #39455e);
    --border-color: var(--ion-color-primary, #4D7CFF);
    --color: var(--ion-color-primary, #4D7CFF);
  }
`;

const HomePage: React.FC = () => {
  // 1. Buscar os dados
  const { games, loadingGames } = useStore();

  // 2. Processar os dados (lógica copiada do seu page.jsx)
  // useMemo garante que isso só seja recalculado quando os jogos mudarem
  const {
    heroGames,
    popularGames,
    promotions,
    // bestSellers, // TODO: Descomente quando criar o grid de best sellers
    // genres, // TODO: Descomente quando criar o grid de gêneros
  } = useMemo(() => {
    const bestRatedGames = [...games].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));

    const discountedGames = [...games]
      .filter((game: any) => game.originalPrice && game.discountedPrice && game.originalPrice > game.discountedPrice)
      .map((game: any) => ({
        ...game,
        discountPercentage: Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100),
      }))
      .sort((a: any, b: any) => b.discountPercentage - a.discountPercentage);

    const heroGames = bestRatedGames.slice(0, 3);
    const popularGames = bestRatedGames.slice(3, 11);
    const bestSellers = bestRatedGames.slice(0, 4);
    const promotions = discountedGames.slice(0, 5);
    const genres = ["Ação", "Aventura", "RPG", "Estratégia", "Indie", "Esportes", "Corrida"];

    return { heroGames, popularGames, bestSellers, promotions, genres };
  }, [games]);

  // 3. Renderizar a página
  return (
    <IonPage>
      <style>{style}</style>
      <Header /> {/* O cabeçalho que criamos */}
      
      <IonContent className="home-page-content" fullscreen>
        {loadingGames ? (
          <IonLoading isOpen={loadingGames} message={'Carregando jogos...'} />
        ) : (
          <>
            {/* 1. Hero Section (Carrossel) */}
            <div className="section">
              <HeroSection heroGames={heroGames} />
            </div>

            {/* 2. Populares da Semana */}
            <div className="section">
              <SectionHeader title="Populares da Semana" />
              <HorizontalGameScroll games={popularGames} />
            </div>
            
            {/* 3. Promoções Imperdíveis */}
            <div className="section">
              <SectionHeader title="Promoções Imperdíveis" viewMoreLink="/category/all?sort=discount" />
              <HorizontalGameScroll games={promotions} />
            </div>

            {/* 4. Mais Vendidos (TODO) */}
            {/* <div className="section">
              <SectionHeader title="Mais Vendidos" viewMoreLink="/category/all?sort=sales" />
              <BestSellersGrid games={bestSellers} />
            </div> 
            */}
            
            {/* 5. Gêneros (TODO) */}
            {/* <div className="section">
              <SectionHeader title="Explore por Gênero" />
              <div className="genres-grid">
                {genres.map(genre => (
                  <IonButton 
                    key={genre} 
                    className="genre-button"
                    // routerLink={`/category/${genre-slug}`} // TODO: Adicionar lógica do slug
                  >
                    {/* <IonIcon icon={...} /> TODO: Adicionar ícones }
                    <span>{genre}</span>
                  </IonButton>
                ))}
              </div>
            </div>
            */}

          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;

