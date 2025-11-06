import React from "react";
import { IonCard, IonImg, IonIcon, IonText } from "@ionic/react";
import {
  star,
  pricetagOutline,
  logoPlaystation,
  logoXbox,
  logoSteam,
  gameControllerOutline,
  desktopOutline,
} from "ionicons/icons";

// Mapeamento de ícones para Ionic
const platformIcons: { [key: string]: string } = {
  xbox: logoXbox,
  playstation: logoPlaystation,
  steam: logoSteam,
  "nintendo switch": gameControllerOutline,
  pc: desktopOutline,
};

// Define a ordem de exibição desejada para as plataformas
const platformOrder = ["pc", "playstation", "xbox", "nintendo switch", "steam"];

// Estilos CSS-in-JS otimizados para mobile
const style = `
  .gameCard {
    --background: var(--ion-color-step-100, #1A202C);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-decoration: none;
    color: var(--ion-text-color, #fff);
    height: 100%;
    margin: 0;
  }

  .gameCard:hover {
    border-color: var(--ion-color-primary, #4D7CFF);
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }
  .gameCard:hover .overlay { opacity: 1; }
  .gameCard:hover .gameImage { transform: scale(1.05); }

  .imageContainer {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* Proporção 16:9 - mais adequada para mobile */
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .imageContainer::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(to top, rgba(26, 32, 44, 0.95) 10%, transparent 100%);
    z-index: 1;
    transition: opacity 0.3s ease;
  }

  .gameImage {
    position: absolute;
    top: 0; 
    left: 0; 
    width: 100%; 
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .platformIcons {
    position: absolute;
    bottom: 8px;
    right: 8px;
    z-index: 2;
    display: flex;
    gap: 0.25rem;
    background-color: rgba(15, 20, 36, 0.8);
    backdrop-filter: blur(4px);
    padding: 0.25rem 0.4rem;
    border-radius: 12px;
    color: #fff;
  }
  
  .platformIcons ion-icon {
    font-size: 12px;
    vertical-align: middle;
  }

  .overlay {
    position: absolute; 
    top: 0; 
    left: 0; 
    right: 0; 
    bottom: 0;
    background: rgba(15, 20, 36, 0.7);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0; 
    transition: opacity 0.3s ease;
  }

  .viewMoreButton {
    border: 1.5px solid var(--ion-color-primary, #4D7CFF);
    padding: 6px 12px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.75rem;
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
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;
  }

  .gameTitle {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
    min-height: 2.2em;
    color: var(--ion-text-color, #fff);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.2;
  }

  .tagsContainer {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    color: var(--ion-color-medium, #718096);
    margin-bottom: 0.6rem;
  }
  .tagIcon {
    color: var(--ion-color-primary, #718096);
    flex-shrink: 0;
    font-size: 16px;
  }

  .gameTags {
    color: var(--ion-color-primary, #718096);
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ratingInfo {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: auto;
    padding-top: 0.4rem;
    color: var(--ion-color-primary, #718096);
    font-size: 1rem;
  }
  .starIcon {
    color: var(--ion-color-primary, #4D7CFF);
    font-size: 16px;
  }

  .priceSection {
    padding: 0 0.75rem 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 0.5rem;
  }

  .priceLeft {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .priceRow {
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .gamePrice {
    font-size: 1rem;
    font-weight: 700;
    color: var(--ion-text-color, #fff);
  }
  .originalPrice {
    font-size: 0.9rem;
    color: var(--ion-color-medium, #718096);
    text-decoration: line-through;
  }

  /* CORREÇÃO: Discount badge à direita */
  .discountBadge {
    background-color: var(--ion-color-danger, #E03E3E);
    color: var(--ion-color-danger-contrast, #fff);
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: bold;
    white-space: nowrap;
    align-self: flex-end;
  }

  /* Mobile First - Estilos base já são para mobile */

  /* Tablet */
  @media (min-width: 768px) {
    .imageContainer {
      padding-top: 133.33%; /* Volta para 3:4 em tablets */
    }

    .gameTitle {
      font-size: 1rem;
    }

    .platformIcons {
      bottom: 12px;
      right: 12px;
      gap: 0.4rem;
      padding: 0.3rem 0.5rem;
    }

    .platformIcons ion-icon {
      font-size: 14px;
    }

    .cardBody {
      padding: 1rem;
    }

    .tagsContainer {
      gap: 0.4rem;
      margin-bottom: 0.8rem;
    }
    .tagIcon {
      font-size: 14px;
    }

    .gameTags {
      color: var(--ion-color-primary, #718096);
      font-size: 0.9rem;
    }

    .ratingInfo {
      color: var(--ion-color-primary, #718096);
      gap: 0.4rem;
      font-size: 0.9rem;
    }
    .starIcon {
      font-size: 14px;
    }

    .priceSection {
      padding: 0 1rem 1rem;
    }

    .gamePrice {
      font-size: 1.2rem;
    }
    .originalPrice {
      font-size: 0.9 rem;
    }

    .discountBadge {
      font-size: 0.9rem;
      padding: 5px 10px;
    }
  }

  /* Desktop */
  @media (min-width: 1024px) {
    .gameCard:hover {
      transform: translateY(-6px);
    }

    .viewMoreButton {
      padding: 8px 16px;
      font-size: 0.8rem;
    }
  }

  /* Otimização para telas muito pequenas */
  @media (max-width: 360px) {
    .cardBody {
      padding: 0.5rem;
    }

    .gameTitle {
      text-transform: uppercase;
      font-size: 1.2rem;
      min-height: 1.8em;
    }

    .priceSection {
      padding: 0 0.5rem 0.5rem;
    }

    .gamePrice {
      font-size: 1.2rem;
    }

    .discountBadge {
      font-size: 0.9rem;
      padding: 3px 6px;
    }
  }
`;

const GameCard: React.FC<{ game: any }> = ({ game }) => {
  if (!game) return null;

  const price = game.discountedPrice ?? game.price;
  const oldPrice =
    game.originalPrice ?? (game.oldPrice > price ? game.oldPrice : null);
  const discount = oldPrice
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

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

  return (
    <IonCard routerLink={`/product/${game.id}`} className="gameCard" button>
      <style>{style}</style>

      <div className="imageContainer">
        <IonImg
          src={game.headerImageUrl || game.coverImageUrl || "/placeholder.jpg"}
          alt={game.title}
          className="gameImage"
        />
        <div className="platformIcons">
          {sortedPlatforms.slice(0, 3).map((platform: string) => (
            <span key={platform} title={platform}>
              <IonIcon
                icon={platformIcons[platform.toLowerCase()] || desktopOutline}
              />
            </span>
          ))}
          {sortedPlatforms.length > 3 && (
            <span title={`+${sortedPlatforms.length - 3} mais`}>
              <IonText style={{ fontSize: "10px", fontWeight: "bold" }}>
                +{sortedPlatforms.length - 3}
              </IonText>
            </span>
          )}
        </div>
        <div className="overlay">
          <div className="viewMoreButton">Ver mais</div>
        </div>
      </div>

      <div className="cardBody">
        <h3 className="gameTitle">{game.title}</h3>
        <div className="tagsContainer">
          <IonIcon icon={pricetagOutline} className="tagIcon" />
          <span className="gameTags">
            {(game.categories || []).slice(0, 2).join(", ")}
            {(game.categories || []).length > 2 && "..."}
          </span>
        </div>
        <div className="ratingInfo">
          <IonIcon icon={star} className="starIcon" />
          <span>{game.rating || "N/A"}</span>
        </div>
      </div>

      <div className="priceSection">
        <div className="priceLeft">
          {discount > 0 ? (
            <>
              <div className="priceRow">
                <span className="originalPrice">
                  R$ {oldPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="priceRow">
                <span className="gamePrice">
                  R$ {price.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </>
          ) : (
            <div className="priceRow">
              <span className="gamePrice">
                {price ? `R$ ${price.toFixed(2).replace(".", ",")}` : "Grátis"}
              </span>
            </div>
          )}
        </div>

        {discount > 0 && <span className="discountBadge">-{discount}%</span>}
      </div>
    </IonCard>
  );
};

export default GameCard;
