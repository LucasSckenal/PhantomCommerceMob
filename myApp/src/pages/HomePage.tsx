import React, { useMemo } from 'react';
import {
  IonPage,
  IonContent,
  IonLoading,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonIcon,
} from '@ionic/react';
// MUDANÇA: Adicionando ícones para a seção de estatísticas
import { barChartOutline, peopleOutline, ribbonOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { useStore } from '../contexts/StoreContext';
import Header from '../components/Header';
import HomeHeroSlider from '../components/HomeHeroSlider'; // Renomeado de HeroSection
import SectionHeader from '../components/SectionHeader';
import HorizontalGameScroll from '../components/HorizontalGameScroll';
// MUDANÇA: Importando os novos componentes
import BestSellersGrid from '../components/BestSellersGrid';
import GenresGrid from '../components/GenresGrid';

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
    margin-bottom: 3rem;
  }

  /* MUDANÇA: Estilos para a nova Seção de Liderança (Stats) */
  .leadershipSection {
    --background: var(--ion-card-background, #1A202C);
    --border-radius: var(--br-16, 16px);
    border: 1px solid var(--ion-border-color, #4A5568);
    padding: 2rem 1.5rem;
    text-align: center;
  }

  .leadershipContent h3 {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--ion-text-color, #fff);
    border-bottom: 3px solid var(--ion-color-primary, #4D7CFF);
    padding-bottom: 0.5rem;
    display: inline-block; /* Para a borda se ajustar ao texto */
    margin: 0 auto 1rem auto;
  }

  .leadershipContent p {
    color: var(--ion-color-medium, #718096);
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto 2rem auto;
  }

  .statItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--ion-color-step-150, #1F2736);
    padding: 1.5rem 1rem;
    border-radius: var(--br-16, 16px);
    text-align: center;
    border: 1px solid var(--ion-border-color, #4A5568);
    height: 100%; /* Faz os cards terem a mesma altura */
  }
  
  .statItem ion-icon {
    font-size: 2rem; /* 28px */
    color: var(--ion-color-primary, #4D7CFF);
    margin-bottom: 0.5rem;
  }

  .statItem h4 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--ion-text-color, #fff);
    margin: 0.5rem 0;
    padding-bottom: 0.25rem;
    border-bottom: 2px solid var(--ion-color-primary, #4D7CFF);
  }

  .statItem p {
    color: var(--ion-color-medium, #718096);
    margin: 0;
    font-size: 0.9rem;
  }
`;

const HomePage: React.FC = () => {
  // 1. Buscar os dados
  const { games, loadingGames } = useStore();

  // 2. Processar os dados (lógica copiada do seu page.jsx)
  const {
    heroGames,
    popularGames,
    promotions,
    bestSellers, // MUDANÇA: Descomentado
    genres, // MUDANÇA: Descomentado
  } = useMemo(() => {
    // MUDANÇA: Adicionada verificação de segurança
    const safeGames = games.filter(game => !!game);

    const bestRatedGames = [...safeGames].sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));

    const discountedGames = [...safeGames]
      .filter((game: any) => game.originalPrice && game.discountedPrice && game.originalPrice > game.discountedPrice)
      .map((game: any) => ({
        ...game,
        discountPercentage: Math.round(((game.originalPrice - game.discountedPrice) / game.originalPrice) * 100),
      }))
      .sort((a: any, b: any) => b.discountPercentage - a.discountPercentage);

    const heroGames = bestRatedGames.slice(0, 3);
    const popularGames = bestRatedGames.slice(3, 11);
    const bestSellers = bestRatedGames.slice(0, 4); // MUDANÇA: Agora é usado
    const promotions = discountedGames.slice(0, 5);
    // MUDANÇA: Agora é usado
    const genres = ["Ação", "Aventura", "RPG", "Estratégia", "Indie", "Esportes", "Corrida"]; 

    return { heroGames, popularGames, bestSellers, promotions, genres };
  }, [games]);

  // 3. Renderizar a página
  return (
    <IonPage>
      <style>{style}</style>
      
      <IonContent className="home-page-content" fullscreen>
        {loadingGames ? (
          <IonLoading isOpen={loadingGames} message={'Carregando jogos...'} />
        ) : (
          <>
            {/* 1. Hero Section (Carrossel) */}
            <div className="section">
              {/* MUDANÇA: Prop 'games' está correta */}
              <HomeHeroSlider games={heroGames} />
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

            {/* 4. Mais Vendidos (MUDANÇA: Agora renderiza o componente) */}
            <div className="section">
              <SectionHeader title="Mais Vendidos" viewMoreLink="/category/all?sort=sales" />
              <BestSellersGrid games={bestSellers} />
            </div>
            
            {/* 5. Gêneros (MUDANÇA: Agora renderiza o componente) */}
            <div className="section">
              <SectionHeader title="Explore por Gênero" />
              <GenresGrid genres={genres} />
            </div>

            {/* 6. Liderança (MUDANÇA: Nova seção adicionada) */}
            <div className="section">
              <IonCard className="leadershipSection">
                <IonCardContent>
                  <div className="leadershipContent">
                    <h3>Liderança em Gaming no Brasil</h3>
                    <p>Referência máxima em entretenimento digital, oferecendo a maior variedade de jogos e a comunidade mais engajada do país.</p>
                  </div>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="12" size-md="6" size-lg="3">
                        <div className="statItem">
                          <IonIcon icon={peopleOutline} />
                          <h4>2.5M+</h4>
                          <p>Usuários Ativos</p>
                        </div>
                      </IonCol>
                      <IonCol size="12" size-md="6" size-lg="3">
                        <div className="statItem">
                          <IonIcon icon={barChartOutline} />
                          <h4>500K+</h4>
                          <p>Avaliações Positivas</p>
                        </div>
                      </IonCol>
                      <IonCol size="12" size-md="6" size-lg="3">
                        <div className="statItem">
                          <IonIcon icon={ribbonOutline} />
                          <h4>98%</h4>
                          <p>Satisfação do Cliente</p>
                        </div>
                      </IonCol>
                      <IonCol size="12" size-md="6" size-lg="3">
                        <div className="statItem">
                          <IonIcon icon={shieldCheckmarkOutline} />
                          <h4>24/7</h4>
                          <p>Suporte Dedicado</p>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </div>

          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;

