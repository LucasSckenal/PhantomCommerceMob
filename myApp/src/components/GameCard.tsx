import React from 'react';
import { IonCard, IonImg, IonIcon, IonText } from '@ionic/react';
import {
  star,
  pricetagOutline,
  logoPlaystation,
  logoXbox,
  logoSteam,
  gameControllerOutline,
  desktopOutline,
} from 'ionicons/icons';

// --- Estilos CSS-in-JS (Traduzido do seu GameCard.module.scss) ---
// MUDANÇA: Mapeamento de ícones para Ionic
const platformIcons: { [key: string]: string } = {
  xbox: logoXbox,
  playstation: logoPlaystation,
  steam: logoSteam,
  'nintendo switch': gameControllerOutline,
  pc: desktopOutline,
};

// Define a ordem de exibição desejada para as plataformas
const platformOrder = ['pc', 'playstation', 'xbox', 'nintendo switch', 'steam'];

// --- Estilos CSS-in-JS (Traduzido do seu GameCard.module.scss) ---
const style = `
  .gameCard {
    /* MUDANÇA: IonCard usa --background por padrão */
    --background: var(--ion-color-step-100, #1A202C); 
    border-radius: var(--br-8, 8px);
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    /* MUDANÇA: Transições do Ionic */
    transition: transform 0.3s ease, box-shadow 0.3s ease; 
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-decoration: none;
    color: var(--ion-text-color, #fff);
    height: 100%; /* Garante que o card preencha a coluna */
  }

  /* MUDANÇA: Efeito hover em um app Ionic */
  .gameCard:hover {
    border-color: var(--ion-color-primary, #4D7CFF);
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
  }
  .gameCard:hover .overlay { opacity: 1; }
  .gameCard:hover .gameImage { transform: scale(1.05); }


  .imageContainer {
    position: relative;
    width: 100%;
    padding-top: 133.33%; /* Proporção 3:4 */
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .imageContainer::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70%;
    background: linear-gradient(to top, rgba(26, 32, 44, 0.95) 10%, transparent 100%);
    z-index: 1;
    transition: opacity 0.3s ease;
  }

  .gameImage {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .platformIcons {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 2;
    display: flex;
    gap: 0.5rem;
    background-color: rgba(15, 20, 36, 0.7);
    backdrop-filter: blur(4px);
    padding: 0.4rem 0.6rem;
    border-radius: 16px;
    color: #fff;
  }
  
  /* MUDANÇA: Ícones do Ionic precisam de alinhamento */
  .platformIcons ion-icon {
    font-size: 16px; 
    vertical-align: middle;
  }

  .overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(15, 20, 36, 0.7);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0; 
    transition: opacity 0.3s ease;
  }

  .viewMoreButton {
    border: 2px solid var(--ion-color-primary, #4D7CFF);
    padding: 10px 20px;
    border-radius: 16px;
    font-weight: 600;
    color: #fff;
    background-color: rgba(15, 20, 36, 0.8); 
    backdrop-filter: blur(10px);
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .viewMoreButton:hover {
    background: var(--ion-color-primary, #4D7CFF);
  }

  .cardBody {
    padding: 1rem; 
    display: flex; 
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
  }

  .gameTitle {
    font-size: 1.1rem; 
    font-weight: 600; 
    margin-bottom: 0.5rem;
    min-height: 2.6em; /* Garante espaço para 2 linhas */
    color: var(--ion-text-color, #fff);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tagsContainer {
    display: flex; 
    align-items: center; 
    gap: 0.4rem;
    color: var(--ion-color-medium, #718096); 
    margin-bottom: 0.8rem;
  }
  .tagIcon { 
    flex-shrink: 0; 
    font-size: 14px;
  }

  .gameTags {
    font-size: 0.8rem; 
    white-space: nowrap;
    overflow: hidden; 
    text-overflow: ellipsis;
  }

  .ratingInfo {
    display: flex; 
    align-items: center; 
    gap: 0.4rem;
    margin-top: auto; 
    padding-top: 0.5rem; 
    color: var(--ion-color-medium, #718096);
  }
  .starIcon { 
    color: var(--ion-color-primary, #4D7CFF);
    font-size: 16px;
  }

  .priceSection {
    padding: 0 1rem 1rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .priceContainer {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
  .gamePrice { 
    font-size: 1.2rem; 
    font-weight: 700; 
    color: var(--ion-text-color, #fff); 
  }
  .originalPrice {
    font-size: 0.8rem;
    color: var(--ion-color-medium, #718096);
    text-decoration: line-through;
  }

  .discountBadge {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: 2;
    background-color: var(--ion-color-danger, #E03E3E);
    color: var(--ion-color-danger-contrast, #fff);
    padding: 5px 9px;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: bold;
  }
`;

const GameCard: React.FC<{ game: any }> = ({ game }) => {
  if (!game) return null;

  // --- Lógica 100% Reutilizada ---
  const price = game.discountedPrice ?? game.price;
  const oldPrice = game.originalPrice ?? (game.oldPrice > price ? game.oldPrice : null);
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const sortedPlatforms = game.platforms
    ? [...game.platforms].sort((a: string, b: string) => {
        const platformA = a.toLowerCase();
        const platformB = b.toLowerCase();
        const indexA = platformOrder.indexOf(platformA);
        const indexB = platformOrder.indexOf(platformB);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      })
    : [];
  // --- Fim da Lógica Reutilizada ---

  return (
    // MUDANÇA: <Link> vira <IonCard> com routerLink
    <IonCard routerLink={`/product/${game.id}`} className="gameCard">
      <style>{style}</style>
      
      <div className="imageContainer">
        {/* MUDANÇA: <Image> vira <IonImg> */}
        <IonImg
          src={game.headerImageUrl || game.coverImageUrl || '/placeholder.jpg'}
          alt={game.title}
          className="gameImage"
        />
        <div className="platformIcons">
          {sortedPlatforms.map((platform: string) => (
            <span key={platform} title={platform}>
              {/* MUDANÇA: Ícones do Ionic */}
              <IonIcon icon={platformIcons[platform.toLowerCase()] || desktopOutline} />
            </span>
          ))}
        </div>
        <div className="overlay">
          <div className="viewMoreButton">Ver mais</div>
        </div>
      </div>
      
      <div className="cardBody">
        <h3 className="gameTitle">{game.title}</h3>
        <div className="tagsContainer">
          {/* MUDANÇA: Ícone do Ionic */}
          <IonIcon icon={pricetagOutline} className="tagIcon" />
          <span className="gameTags">{(game.categories || []).join(', ')}</span>
        </div>
        <div className="ratingInfo">
          {/* MUDANÇA: Ícone do Ionic */}
          <IonIcon icon={star} className="starIcon" />
          <span>{game.rating || 'N/A'}</span>
        </div>
      </div>
      
      <div className="priceSection">
        <div className="priceContainer">
          {discount > 0 && oldPrice && (
            <span className="originalPrice">
              R$ {oldPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
          <IonText>
            <p className="gamePrice">
              R$ {price ? price.toFixed(2).replace('.', ',') : 'N/A'}
            </p>
          </IonText>
        </div>
      </div>
      
      {discount > 0 && <span className="discountBadge">-{discount}%</span>}
    </IonCard>
  );
};

export default GameCard;
