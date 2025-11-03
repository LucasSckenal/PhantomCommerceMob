import React from 'react';
import { IonImg, IonIcon, IonText } from '@ionic/react';
import { star, pricetagOutline } from 'ionicons/icons';

// --- Estilos CSS-in-JS (Traduzido do seu Home.module.scss) ---
const style = `
  .bestSellersGrid {
    display: grid;
    /* MUDANÇA: Uma coluna por defeito (mobile), duas em ecrãs maiores */
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  /* MUDANÇA: Media query para ecrãs maiores */
  @media (min-width: 992px) {
    .bestSellersGrid {
      grid-template-columns: 1fr 1fr;
    }
  }

  .bestSellerCard {
    background-color: var(--ion-card-background, #1A202C);
    border-radius: var(--br-16, 16px);
    padding: 1rem;
    display: grid;
    /* MUDANÇA: Layout de colunas adaptado */
    grid-template-columns: auto 65px 1fr auto; /* Rank | Imagem | Info | Preço */
    align-items: center;
    gap: 1rem;
    border: 1px solid var(--ion-border-color, #4A5568);
    text-decoration: none;
    position: relative;
    overflow: hidden;
    min-height: 120px;
    transition: all 0.3s ease;
  }

  .bestSellerCard:hover {
    border-color: var(--ion-color-primary, #4D7CFF);
    transform: translateY(-3px);
  }

  /* Imagem de fundo que aparece no hover (opcional, removido para simplicidade mobile) */

  .bestSellerImageContainer {
    position: relative;
    z-index: 1;
    width: 65px;
    height: 90px;
    border-radius: var(--br-8, 8px);
    overflow: hidden;
  }

  .bestSellerImageSide {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .rank,
  .bestSellerInfo,
  .bestSellerPrice {
    position: relative;
    z-index: 1;
  }

  .rank {
    font-size: 1.5rem;
    font-weight: bolder;
    padding: 0 0.5rem;
    color: var(--ion-text-color, #fff);
    transition: color 0.4s ease;
  }
  .bestSellerCard:hover .rank {
    color: var(--ion-color-primary, #4D7CFF);
  }

  .bestSellerInfo {
    color: var(--ion-text-color, #fff);
    overflow: hidden; /* Evita que o texto quebre o layout */
    
    h4 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
      line-height: 1.3;
      /* Evita quebra de texto */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bestSellerTags {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--ion-color-medium, #718096);
      margin-bottom: 0.25rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bestSellerRating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.9rem;
      color: var(--ion-color-primary, #4D7CFF);
    }
    .bestSellerRating ion-icon {
      font-size: 14px; /* Ajusta o tamanho da estrela */
    }
  }

  .bestSellerPrice {
    text-align: right;
    color: var(--ion-text-color, #fff);
    padding-left: 0.5rem;

    span {
      display: block;
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--ion-color-primary, #4D7CFF);
    }
    /* O botão "Ver jogo" foi removido para simplificar o card */
  }

  /* Ajustes para ecrãs muito pequenos */
  @media (max-width: 576px) {
    .bestSellerCard {
      grid-template-columns: auto 1fr auto; /* Rank | Info | Preço */
      gap: 0.75rem;
    }
    .bestSellerImageContainer {
      display: none; /* Esconde a imagem em ecrãs muito pequenos */
    }
    .bestSellerInfo h4 {
      font-size: 1rem;
    }
    .bestSellerPrice span {
      font-size: 1rem;
    }
  }
`;

// --- Formatação (Reutilizada) ---
const formatCurrency = (value: number) =>
  (value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface BestSellersGridProps {
  games: any[];
}

const BestSellersGrid: React.FC<BestSellersGridProps> = ({ games = [] }) => {
  if (!games || games.length === 0) {
    return null;
  }

  return (
    <>
      <style>{style}</style>
      <div className="bestSellersGrid">
        {games.map((game: any, index: number) => (
          <a 
            key={game.id} 
            href={`/product/${game.id}`} /* MUDANÇA: Use <a> ou routerLink num IonItem */
            className="bestSellerCard"
          >
            <span className="rank">#{index + 1}</span>
            <div className="bestSellerImageContainer">
              <IonImg 
                src={game.headerImageUrl || game.coverImageUrl || '/placeholder.jpg'} 
                alt={game.title} 
                className="bestSellerImageSide" 
              />
            </div>
            <div className="bestSellerInfo">
              <h4>{game.title}</h4>
              <div className="bestSellerTags">
                <IonIcon icon={pricetagOutline} />
                <span>{(game.categories || []).join(', ')}</span>
              </div>
              <div className="bestSellerRating">
                <IonIcon icon={star} />
                <span>{game.rating || 'N/A'}</span>
              </div>
            </div>
            <div className="bestSellerPrice">
              <span>
                {formatCurrency(game.discountedPrice || game.price || 0)}
              </span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
};

export default BestSellersGrid;

