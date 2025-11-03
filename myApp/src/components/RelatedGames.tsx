import React from 'react';
import { IonGrid, IonRow, IonCol, IonText } from '@ionic/react';
import { useProduct } from '../contexts/ProductContext'; // Ajuste o caminho se necessário
import GameCard from './GameCard'; // TODO: Você precisará criar este componente

// --- Estilos CSS-in-JS (Traduzido do seu RelatedGames.module.scss) ---
const style = `
  .relatedSection {
    /* MUDANÇA: Usando padding do IonGrid, mas podemos adicionar margem */
    padding: 1rem;
    margin: 0 auto 3rem auto;
  }

  .sectionTitle {
    width: fit-content;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--ion-text-color, #fff);
    margin-bottom: 1.5rem; /* Aumentado para dar espaço para a grid */
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--ion-color-primary, #4D7CFF);
  }
`;

const RelatedGames: React.FC = () => {
  // MUDANÇA: Lógica idêntica
  const { relatedGames } = useProduct();

  if (!relatedGames || relatedGames.length === 0) {
    return null;
  }

  return (
    <section className="relatedSection">
      <style>{style}</style>
      
      {/* MUDANÇA: Título com IonText */}
      <IonText>
        <h2 className="sectionTitle">Jogos Relacionados</h2>
      </IonText>

      {/* MUDANÇA: Usando IonGrid para o layout responsivo */}
      <IonGrid>
        <IonRow>
          {relatedGames.map((game: any) => (
            // 1 coluna em telas pequenas, 3 em médias, 4 em grandes
            <IonCol key={game.id} size="12" size-md="4" size-xl="3">
              {/* TODO: Você precisa criar e importar o GameCard.tsx. 
                Vou usar um placeholder por enquanto. 
              */}
              <GameCard game={game} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </section>
  );
};

export default RelatedGames;
