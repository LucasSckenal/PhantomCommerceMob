import React, { useRef } from "react";
import { IonButton, IonIcon, IonText } from "@ionic/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperInstance } from "swiper";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import {
  arrowForward,
  arrowBack,
  star,
  logoPlaystation,
  logoXbox,
  logoSteam,
  gameControllerOutline,
  desktopOutline,
} from "ionicons/icons";

// --- Estilos CSS-in-JS CORRIGIDOS ---
const style = `
  .heroSlider {
    height: 65vh;
    min-height: 500px;
    border-radius: var(--br-16, 16px);
    overflow: hidden;
  }

  .heroSlide {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    background-size: cover;
    background-position: center center; /* CORREÇÃO: Centraliza a imagem */
    background-repeat: no-repeat;
    padding: 2rem 3rem;
    color: var(--ion-text-color-contrast, #fff);
    position: relative;
  }

  /* NOVO: Container para garantir que a imagem cubra toda a área */
  .heroSlide::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: 0;
  }

  .heroOverlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image: radial-gradient(circle, transparent 45%, black 80%),
                      linear-gradient(to right, rgba(15, 20, 36, 0.7) 20%, transparent 80%);
    background-color: rgba(15, 20, 36, 0.4);
  }

  .heroContent {
    position: relative;
    z-index: 2;
    max-width: 45%;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding-left: 3rem;
    text-align: left;
  }

  .heroTitle {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.1;
    text-shadow: 0 2px 10px rgba(0,0,0,0.5);
  }

  .heroSubtitle { font-size: 1.2rem; font-weight: bold; }
  .heroDescription { 
    font-size: 0.95rem; 
    line-height: 1.6; 
    max-width: 480px; 
    
    /* Adiciona clamp para limitar a 3 linhas */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .heroInfoBar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  
  .infoItem, .platformIconsHero {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    background-color: rgba(15, 20, 36, 0.7);
    padding: 0.4rem 0.8rem;
    border-radius: 16px;
    font-size: 0.9rem;
  }
  .infoItem ion-icon { 
    color: var(--ion-color-primary, #4D7CFF); 
    font-size: 16px;
  }
  .platformIconsHero ion-icon {
    font-size: 16px;
  }

  .heroPriceSection {
    margin-top: 0.5rem;
  }
  .currentPrice { font-size: 2.2rem; font-weight: 700; }
  .originalPrice { 
    font-size: 1rem;
    color: var(--ion-color-medium);
    text-decoration: line-through;
    margin-left: 0.5rem;
  }

  .heroActions {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.5rem;
  }

  .heroButtonPrimary {
    --background: var(--ion-color-primary, #2D5BFF);
    --background-hover: var(--ion-color-primary-shade, #2951e0);
    --color: var(--ion-text-color-contrast, #fff);
    --border-radius: 8px;
    --padding-start: 2.5rem;
    --padding-end: 2.5rem;
    --padding-top: 0.9rem;
    --padding-bottom: 0.9rem;
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }

  .heroButtonSecondary {
    --background: rgba(15, 20, 36, 0.8);
    --color: var(--ion-text-color-contrast, #fff);
    --border-color: var(--ion-color-primary, #4D7CFF);
    --border-width: 1px;
    --border-style: solid;
    --border-radius: 8px;
    --padding-start: 1.5rem;
    --padding-end: 1.5rem;
    --padding-top: 0.8rem;
    --padding-bottom: 0.8rem;
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
  }
  .heroButtonSecondary:hover {
    --color: var(--ion-color-primary, #4D7CFF);
  }

  .heroNavArrow {
    position: absolute;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
    --background: rgba(26, 32, 44, 0.5);
    --background-hover: var(--ion-color-primary-shade, #2951e0);
    --border-color: var(--ion-color-primary, #4D7CFF);
    --border-width: 1px;
    --border-style: solid;
    --color: #fff;
    --border-radius: 50%;
    width: 48px;
    height: 48px;
    backdrop-filter: blur(4px);
  }
  .heroNavArrow.left { left: 2rem; }
  .heroNavArrow.right { right: 2rem; }

  .heroSlider .swiper-pagination {
    bottom: 2rem !important;
  }
  .heroSlider .swiper-pagination-bullet {
    background: var(--ion-color-light, #f4f5f8);
    opacity: 0.7;
  }
  .heroSlider .swiper-pagination-bullet-active {
    background: var(--ion-color-primary, #4D7CFF);
    opacity: 1;
  }

  /* MUDANÇA: CSS Responsivo para Mobile - CORRIGIDO */
  @media (max-width: 768px) {
    .heroSlider {
      height: 60vh; /* Ajustado para mobile */
      min-height: 400px;
    }

    .heroSlide {
      padding: 1rem;
      align-items: flex-end;
      background-position: center center; /* Garante centralização no mobile */
    }

    .heroContent {
      max-width: 100%;
      padding-left: 0;
      text-align: center;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem; /* Reduzido */
    }

    .heroTitle {
      font-size: 2rem; /* Título menor para mobile */
      line-height: 1.2;
    }

    .heroSubtitle {
      font-size: 0.9rem;
    }

    .heroDescription {
      font-size: 0.8rem;
      max-width: 95%;
      -webkit-line-clamp: 2; /* Menos linhas no mobile */
    }
    
    .heroInfoBar {
      gap: 0.5rem;
      justify-content: center;
    }

    .infoItem, .platformIconsHero {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
    }
    .infoItem ion-icon, .platformIconsHero ion-icon {
      font-size: 12px;
    }

    .heroPriceSection {
      margin-top: 0.25rem;
    }
    .currentPrice {
      font-size: 1.5rem;
    }

    .heroActions {
      gap: 0.5rem;
      flex-direction: column;
      width: 100%;
    }

    .heroButtonPrimary, .heroButtonSecondary {
      font-size: 0.85rem;
      width: 90%;
      --padding-start: 1rem;
      --padding-end: 1rem;
      --padding-top: 0.7rem;
      --padding-bottom: 0.7rem;
    }

    .heroNavArrow {
      display: none;
    }
  }

  /* NOVO: Otimização para telas muito pequenas */
  @media (max-width: 480px) {
    .heroSlider {
      height: 55vh;
      min-height: 350px;
    }

    .heroTitle {
      font-size: 1.7rem;
    }

    .heroDescription {
      -webkit-line-clamp: 2;
    }

    .heroInfoBar {
      flex-direction: column;
      gap: 0.25rem;
    }
  }

  /* NOVO: Garantir que a imagem sempre cubra o container */
  .heroSlide .image-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .heroSlide .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

// ... (o resto do código permanece igual)
const platformIcons: { [key: string]: string } = {
  xbox: logoXbox,
  playstation: logoPlaystation,
  steam: logoSteam,
  "nintendo switch": gameControllerOutline,
  pc: desktopOutline,
};

const platformOrder = ["pc", "playstation", "xbox", "nintendo switch", "steam"];

interface HomeHeroSliderProps {
  games: any[];
}

const HomeHeroSlider: React.FC<HomeHeroSliderProps> = ({ games = [] }) => {
  const slidesRef = useRef<SwiperInstance | null>(null);

  const handlePrev = () => slidesRef.current?.slidePrev();
  const handleNext = () => slidesRef.current?.slideNext();

  const sortedPlatforms = (platforms: string[] = []) => {
    return [...platforms].sort((a, b) => {
      const platformA = a.toLowerCase();
      const platformB = b.toLowerCase();
      const indexA = platformOrder.indexOf(platformA);
      const indexB = platformOrder.indexOf(platformB);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  // NOVO: Função para garantir que a imagem seja carregada corretamente
  const getOptimizedImageUrl = (url: string) => {
    if (!url) return "";
    // Adiciona parâmetros de otimização se for uma URL do Firebase Storage
    if (url.includes("firebasestorage.googleapis.com")) {
      return `${url}?alt=media`;
    }
    return url;
  };

  if (!games || games.length === 0) {
    return null;
  }

  return (
    <div style={{ position: "relative" }}>
      <style>{style}</style>
      <Swiper
        className="heroSlider"
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 7000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
        }}
        onSwiper={(swiper) => {
          slidesRef.current = swiper;
        }}
      >
        {games.map((game: any) => {
          const imageUrl = getOptimizedImageUrl(
            game.headerImageUrl || game.coverImageUrl
          );

          return (
            <SwiperSlide
              key={game.id}
              className="heroSlide"
              style={{
                backgroundImage: `url(${imageUrl})`,
                // NOVO: Garante que a imagem cubra o container
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {/* NOVO: Container adicional para a imagem como fallback */}
              <div
                className="image-container"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 0,
                }}
              />

              <div className="heroOverlay"></div>
              <div className="heroContent">
                <h2 className="heroTitle">{game.title}</h2>
                <h3 className="heroSubtitle">
                  {(game.categories || [])[0] || ""}
                </h3>
                <p className="heroDescription">
                  {game.shortDescription || game.description}
                </p>

                <div className="heroInfoBar">
                  <div className="infoItem">
                    <IonIcon icon={star} />
                    <span>{game.rating || "N/A"}</span>
                  </div>
                  <div className="platformIconsHero">
                    {sortedPlatforms(game.platforms || []).map((platform) => (
                      <IonIcon
                        key={platform}
                        icon={
                          platformIcons[platform.toLowerCase()] ||
                          desktopOutline
                        }
                        title={platform}
                      />
                    ))}
                  </div>
                </div>

                <div className="heroPriceSection">
                  <IonText>
                    <span className="currentPrice">
                      {game.discountedPrice
                        ? `R$ ${game.discountedPrice
                            .toFixed(2)
                            .replace(".", ",")}`
                        : game.price > 0
                        ? `R$ ${game.price.toFixed(2).replace(".", ",")}`
                        : "Grátis"}
                    </span>
                    {game.discountedPrice && game.originalPrice && (
                      <span className="originalPrice">
                        R$ {game.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </IonText>
                </div>

                <div className="heroActions">
                  <IonButton
                    className="heroButtonPrimary"
                    routerLink={`/product/${game.id}`}
                  >
                    <IonIcon slot="start" icon={arrowForward} />
                    Ver Jogo
                  </IonButton>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <IonButton
        className="heroNavArrow left"
        fill="clear"
        onClick={handlePrev}
      >
        <IonIcon slot="icon-only" icon={arrowBack} />
      </IonButton>
      <IonButton
        className="heroNavArrow right"
        fill="clear"
        onClick={handleNext}
      >
        <IonIcon slot="icon-only" icon={arrowForward} />
      </IonButton>
    </div>
  );
};

export default HomeHeroSlider;
