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
    background-position: center center;
    background-repeat: no-repeat;
    padding: 2rem 3rem;
    color: var(--ion-text-color-contrast, #fff);
    position: relative;
  }

  /* Overlay escuro agora aplicado APENAS ao texto */
  .heroContent {
    position: relative;
    z-index: 2;
    max-width: 45%;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    padding: 2rem 2.5rem;
    background: rgba(10, 15, 30, 0.65);
    backdrop-filter: blur(6px);
    border-radius: 16px;
    text-align: left;
  }

  .heroTitle {
    font-size: 3.2rem;
    font-weight: 700;
    line-height: 1.1;
    text-shadow: 0 3px 10px rgba(0,0,0,0.7);
  }

  .heroSubtitle { 
    font-size: 1.2rem; 
    font-weight: bold; 
    text-shadow: 0 2px 6px rgba(0,0,0,0.6);
  }

  .heroDescription { 
    font-size: 1.1rem; 
    line-height: 1.6; 
    max-width: 480px; 
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 2px 8px rgba(0,0,0,0.7);
  }

  .heroInfoBar {
    display: flex;
    align-items: center;
    gap: 1rem;
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

  .currentPrice { 
    font-size: 2rem; 
    font-weight: 700; 
    text-shadow: 0 2px 8px rgba(0,0,0,0.8);
  }

  .originalPrice { 
    font-size: 1rem;
    color: var(--ion-color-medium);
    text-decoration: line-through;
    margin-left: 0.5rem;
  }

  .heroActions {
    display: flex;
    gap: 1.2rem;
    margin-top: 0.5rem;
  }

  .heroButtonPrimary {
    --background: var(--ion-color-primary, #2D5BFF);
    --color: #fff;
    --border-radius: 8px;
    --padding-start: 2rem;
    --padding-end: 2rem;
    --padding-top: 0.8rem;
    --padding-bottom: 0.8rem;
    font-size: 1rem;
    font-weight: 600;
    text-transform: none;
    box-shadow: 0 0 8px rgba(0,0,0,0.5);
  }

  .heroButtonPrimary:hover {
    filter: brightness(1.1);
  }

  .heroNavArrow {
    position: absolute;
    z-index: 10;
    top: 50%;
    transform: translateY(-50%);
    --background: rgba(26, 32, 44, 0.5);
    --border-color: var(--ion-color-primary, #4D7CFF);
    --border-width: 1px;
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

  /* Responsivo */
  @media (max-width: 768px) {
    .heroSlider {
      height: 60vh;
      min-height: 400px;
    }

    .heroSlide {
      padding: 1rem;
      align-items: flex-end;
      justify-content: center;
    }

    .heroContent {
      max-width: 95%;
      padding: 1rem;
      margin-bottom: 0.8rem;
      align-items: center;
      text-align: center;
      background: rgba(0,0,0,0.55);
      border-radius: 12px;
      backdrop-filter: blur(6px);
    }

    .heroTitle {
      font-size: 1.9rem;
    }

    .heroSubtitle {
      font-size: 0.9rem;
    }

    .heroDescription {
      font-size: 1.2rem;
      -webkit-line-clamp: 2;
    }

    .heroInfoBar {
      gap: 0.5rem;
      justify-content: center;
    }

    .heroActions {
      flex-direction: column;
      gap: 0.6rem;
      width: 100%;
    }

    .heroButtonPrimary {
      width: 90%;
      font-size: 0.9rem;
    }

    .heroNavArrow {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .heroTitle {
      font-size: 1.6rem;
    }
  }
`;

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

  const sortedPlatforms = (platforms: string[] = []) =>
    [...platforms].sort(
      (a, b) =>
        platformOrder.indexOf(a.toLowerCase()) -
        platformOrder.indexOf(b.toLowerCase())
    );

  const getOptimizedImageUrl = (url: string) =>
    url?.includes("firebasestorage.googleapis.com") ? `${url}?alt=media` : url;

  if (!games || games.length === 0) return null;

  return (
    <div style={{ position: "relative" }}>
      <style>{style}</style>
      <Swiper
        className="heroSlider"
        modules={[Pagination, Autoplay]}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        loop
        pagination={{ clickable: true }}
        onSwiper={(swiper) => (slidesRef.current = swiper)}
      >
        {games.map((game: any) => {
          const imageUrl = getOptimizedImageUrl(
            game.headerImageUrl || game.coverImageUrl
          );

          return (
            <SwiperSlide
              key={game.id}
              className="heroSlide"
              style={{ backgroundImage: `url(${imageUrl})` }}
            >
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
                          platformIcons[platform.toLowerCase()] || desktopOutline
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
